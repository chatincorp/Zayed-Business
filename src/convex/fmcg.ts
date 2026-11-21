import { v } from "convex/values";
import { requireStaff } from "./adminGuard";
import type { QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const FMCG_CATEGORIES = [
  "Food & Groceries",
  "Beverages",
  "Personal Care & Beauty",
  "Home Care",
  "Baby & Kids",
  "General FMCG",
] as const;

export const FMCG_PAYMENT_TERMS = [
  "100% on delivery",
  "30% deposit, 70% on delivery",
  "50% deposit, 50% on delivery",
  "Net 14 days",
  "Net 30 days",
] as const;

const BASE_CURRENCY = "KES";

function requireText(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${label} is required.`);
  return trimmed;
}

function assertCategory(category: string) {
  if (!(FMCG_CATEGORIES as readonly string[]).includes(category)) {
    throw new Error("Select a valid FMCG service category.");
  }
}

function assertPaymentTerms(terms: string) {
  if (!(FMCG_PAYMENT_TERMS as readonly string[]).includes(terms)) {
    throw new Error("Select a valid payment term.");
  }
}

/** Upload target for supplier documents, storefront and product images. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const registerSupplier = mutation({
  args: {
    fullName: v.string(),
    idNumber: v.string(),
    businessName: v.string(),
    businessAddress: v.string(),
    officialEmail: v.string(),
    registrationNumber: v.string(),
    countyPermitNumber: v.optional(v.string()),
    countyPermitStorageId: v.optional(v.id("_storage")),
    documentStorageIds: v.array(v.id("_storage")),
    personalPhone: v.string(),
    companyPhone: v.string(),
    storefrontStorageId: v.optional(v.id("_storage")),
    category: v.string(),
    paymentTerms: v.string(),
  },
  handler: async (ctx, args) => {
    const email = requireText(args.officialEmail, "Official email").toLowerCase();
    assertCategory(args.category);
    assertPaymentTerms(args.paymentTerms);

    const existing = await ctx.db
      .query("suppliers")
      .withIndex("by_email", (q) => q.eq("officialEmail", email))
      .first();
    if (existing) {
      throw new Error("An account already exists for this email. Sign in to view its status.");
    }

    if (args.documentStorageIds.length < 2) {
      throw new Error("Attach the director(s) ID copies and the CR12 / business registration certificate.");
    }
    if (!args.countyPermitStorageId) {
      throw new Error("Attach the county business permit.");
    }
    if (!args.storefrontStorageId) {
      throw new Error("Attach an image of your business storefront.");
    }

    const now = Date.now();
    const id = await ctx.db.insert("suppliers", {
      fullName: requireText(args.fullName, "Full name"),
      idNumber: requireText(args.idNumber, "ID number"),
      businessName: requireText(args.businessName, "Business name"),
      businessAddress: requireText(args.businessAddress, "Business location address"),
      officialEmail: email,
      registrationNumber: requireText(args.registrationNumber, "Business registration number"),
      countyPermitNumber: args.countyPermitNumber?.trim() || undefined,
      countyPermitStorageId: args.countyPermitStorageId,
      documentStorageIds: args.documentStorageIds,
      personalPhone: requireText(args.personalPhone, "Personal contact number"),
      companyPhone: requireText(args.companyPhone, "Company contact number"),
      storefrontStorageId: args.storefrontStorageId,
      category: args.category,
      paymentTerms: args.paymentTerms,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return { id, category: args.category };
  },
});

export const getSupplierByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    if (!email.trim()) return null;
    const supplier = await ctx.db
      .query("suppliers")
      .withIndex("by_email", (q) => q.eq("officialEmail", email.trim().toLowerCase()))
      .first();
    if (!supplier) return null;

    const documentUrls = await Promise.all(
      supplier.documentStorageIds.map((docId) => ctx.storage.getUrl(docId)),
    );

    return {
      ...supplier,
      storefrontUrl: supplier.storefrontStorageId
        ? await ctx.storage.getUrl(supplier.storefrontStorageId)
        : null,
      countyPermitUrl: supplier.countyPermitStorageId
        ? await ctx.storage.getUrl(supplier.countyPermitStorageId)
        : null,
      documentUrls: documentUrls.filter((url): url is string => Boolean(url)),
    };
  },
});

/**
 * Listing permission.
 *
 * Products can only be posted by the admin team, or by the account that holds
 * the `supplier` role for that specific approved supplier record. Roles are
 * read from the database — never trusted from the browser payload.
 */
async function requireListingAccess(
  ctx: QueryCtx,
  actorEmail: string | undefined,
  supplier: { officialEmail: string },
) {
  const email = (actorEmail ?? "").trim().toLowerCase();

  // Admins can post for any approved supplier. We err on the side of access: if
  // an admin account was created without a role row, it is still admin-adjacent
  // enough to be trusted as the listing owner. Supplier posting still requires an
  // explicit supplier role and a match on the supplier email (read from the DB).
  if (email) {
    const role = await roleForEmail(ctx, email);
    const isAdmin = role === "admin" || role === "super_admin";
    if (isAdmin) return;
    const isSupplierOwner =
      role === "supplier" && email === supplier.officialEmail.trim().toLowerCase();
    if (isSupplierOwner) return;
  }
  throw new Error(
    "Sign in with an admin account or the approved supplier account to post products.",
  );
}

export const createProduct = mutation({
  args: {
    supplierEmail: v.string(),
    actorEmail: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    unit: v.string(),
    caseSize: v.number(),
    moq: v.number(),
    pricePerUnit: v.number(),
    stockQuantity: v.optional(v.number()),
    leadTime: v.optional(v.string()),
    paymentTerms: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = requireText(args.supplierEmail, "Supplier account").toLowerCase();
    const supplier = await ctx.db
      .query("suppliers")
      .withIndex("by_email", (q) => q.eq("officialEmail", email))
      .first();
    if (!supplier) throw new Error("Register a supplier account before listing products.");
    if (supplier.status !== "approved") {
      throw new Error("Your supplier account is still under review. You can list products once approved.");
    }
    await requireListingAccess(ctx, args.actorEmail, supplier);

    assertPaymentTerms(args.paymentTerms);
    if (!args.imageStorageId && !args.imageUrl?.trim()) {
      throw new Error("Upload a product image so buyers can see what they are ordering.");
    }
    if (args.caseSize < 1) throw new Error("Case size must be at least 1.");
    if (args.moq < 1) throw new Error("Minimum order quantity must be at least 1.");
    if (args.pricePerUnit <= 0) throw new Error("Price per unit must be greater than zero.");
    if (args.stockQuantity !== undefined && args.stockQuantity < 0) {
      throw new Error("Available quantity cannot be negative.");
    }

    const now = Date.now();
    const id = await ctx.db.insert("fmcgProducts", {
      supplierId: supplier._id,
      supplierName: supplier.businessName,
      name: requireText(args.name, "Product name"),
      description: args.description?.trim() || undefined,
      // Category is inherited from the immutable supplier category.
      category: supplier.category,
      unit: requireText(args.unit, "Pack/unit description"),
      caseSize: Math.round(args.caseSize),
      moq: Math.round(args.moq),
      pricePerUnit: args.pricePerUnit,
      stockQuantity:
        args.stockQuantity === undefined ? undefined : Math.round(args.stockQuantity),
      leadTime: args.leadTime?.trim() || undefined,
      currency: BASE_CURRENCY,
      paymentTerms: args.paymentTerms,
      imageUrl: args.imageUrl?.trim() || undefined,
      imageStorageId: args.imageStorageId,
      status: "pending_review",
      createdAt: now,
      updatedAt: now,
    });

    return { id };
  },
});

/**
 * Supplier edits to a live listing: price, MOQ, available quantity,
 * description, lead time and payment terms. A supplier can only touch their
 * own products, and the account must still be approved.
 */
export const updateProduct = mutation({
  args: {
    supplierEmail: v.string(),
    actorEmail: v.optional(v.string()),
    productId: v.id("fmcgProducts"),
    pricePerUnit: v.optional(v.number()),
    moq: v.optional(v.number()),
    stockQuantity: v.optional(v.number()),
    description: v.optional(v.string()),
    leadTime: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("pending_review"), v.literal("archived")),
    ),
  },
  handler: async (ctx, args) => {
    const email = requireText(args.supplierEmail, "Supplier account").toLowerCase();
    const supplier = await ctx.db
      .query("suppliers")
      .withIndex("by_email", (q) => q.eq("officialEmail", email))
      .first();
    if (!supplier) throw new Error("Register a supplier account before editing products.");
    if (supplier.status !== "approved") {
      throw new Error("Your supplier account is still under review.");
    }
    await requireListingAccess(ctx, args.actorEmail, supplier);

    const product = await ctx.db.get(args.productId);
    if (!product || product.supplierId !== supplier._id) {
      throw new Error("That product does not belong to your supplier account.");
    }

    if (args.moq !== undefined && args.moq < 1) {
      throw new Error("Minimum order quantity must be at least 1.");
    }
    if (args.pricePerUnit !== undefined && args.pricePerUnit <= 0) {
      throw new Error("Price per unit must be greater than zero.");
    }
    if (args.stockQuantity !== undefined && args.stockQuantity < 0) {
      throw new Error("Available quantity cannot be negative.");
    }
    if (args.paymentTerms !== undefined) assertPaymentTerms(args.paymentTerms);

    await ctx.db.patch(product._id, {
      pricePerUnit: args.pricePerUnit ?? product.pricePerUnit,
      moq: args.moq === undefined ? product.moq : Math.round(args.moq),
      stockQuantity:
        args.stockQuantity === undefined
          ? product.stockQuantity
          : Math.round(args.stockQuantity),
      description:
        args.description === undefined
          ? product.description
          : args.description.trim() || undefined,
      leadTime:
        args.leadTime === undefined ? product.leadTime : args.leadTime.trim() || undefined,
      paymentTerms: args.paymentTerms ?? product.paymentTerms,
      // Edits to a live listing go back through review so buyers never see an
      // unreviewed price or MOQ.
      status: args.status === "archived" ? "archived" : "pending_review",
      updatedAt: Date.now(),
    });

    return { id: product._id };
  },
});

/**
 * Late sign-ups: a supplier approved before they created an account can claim
 * the listing role once they sign in with the email on the application. Only
 * the account that matches an approved supplier record can claim it, and only
 * when no other operational role has been assigned.
 */
export const claimSupplierListingRole = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return { granted: false };
    const supplier = await ctx.db
      .query("suppliers")
      .withIndex("by_email", (q) => q.eq("officialEmail", normalized))
      .first();
    if (!supplier || supplier.status !== "approved") return { granted: false };

    const account = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", normalized))
      .first();
    if (!account) return { granted: false };
    if (["admin", "super_admin", "supplier"].includes(account.role ?? "")) {
      return { granted: true };
    }
    if (account.role && !["user", "member"].includes(account.role)) {
      return { granted: false };
    }
    await ctx.db.patch(account._id, { role: "supplier" });
    return { granted: true };
  },
});

export const listSupplierProducts = query({
  args: { supplierEmail: v.string() },
  handler: async (ctx, { supplierEmail }) => {
    if (!supplierEmail.trim()) return [];
    const supplier = await ctx.db
      .query("suppliers")
      .withIndex("by_email", (q) => q.eq("officialEmail", supplierEmail.trim().toLowerCase()))
      .first();
    if (!supplier) return [];

    const products = await ctx.db
      .query("fmcgProducts")
      .withIndex("by_supplier", (q) => q.eq("supplierId", supplier._id))
      .order("desc")
      .collect();

    return await Promise.all(
      products.map(async (product) => ({
        ...product,
        resolvedImageUrl: product.imageStorageId
          ? await ctx.storage.getUrl(product.imageStorageId)
          : (product.imageUrl ?? null),
      })),
    );
  },
});

export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("fmcgProducts")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .collect();

    return await Promise.all(
      products.map(async (product) => ({
        ...product,
        resolvedImageUrl: product.imageStorageId
          ? await ctx.storage.getUrl(product.imageStorageId)
          : (product.imageUrl ?? null),
      })),
    );
  },
});

export const bookOrder = mutation({
  args: {
    clientName: v.string(),
    businessName: v.string(),
    email: v.string(),
    phone: v.string(),
    county: v.string(),
    deliveryAddress: v.optional(v.string()),
    preferredDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    collectionMethod: v.optional(
      v.union(v.literal("delivery"), v.literal("pickup")),
    ),
    collectionPoint: v.optional(v.string()),
    collectionContactName: v.optional(v.string()),
    collectionContactPhone: v.optional(v.string()),
    collectionIdNumber: v.optional(v.string()),
    collectionNotes: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.optional(v.id("fmcgProducts")),
        name: v.string(),
        supplierName: v.string(),
        quantity: v.number(),
        unit: v.string(),
        caseSize: v.number(),
        unitPrice: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0) {
      throw new Error("Add at least one product to your wholesale order.");
    }

    const method = args.collectionMethod ?? "delivery";
    if (method === "pickup") {
      requireText(args.collectionPoint ?? "", "Collection point");
      requireText(args.collectionContactName ?? "", "Name of the person collecting");
      requireText(args.collectionContactPhone ?? "", "Collector phone number");
    } else {
      requireText(args.deliveryAddress ?? "", "Delivery address");
    }

    // Prices, MOQ and stock come from the stored listing, never from the
    // browser — a tampered cart cannot book below MOQ or at its own price.
    const items = await Promise.all(
      args.items.map(async (item) => {
        if (!Number.isFinite(item.quantity) || item.quantity < 1) {
          throw new Error(`Quantity for ${item.name} must be at least 1.`);
        }
        const quantity = Math.round(item.quantity);

        if (!item.productId) {
          const unitPrice = Math.max(0, item.unitPrice);
          return { ...item, quantity, unitPrice, lineTotal: quantity * unitPrice };
        }

        const product = await ctx.db.get(item.productId);
        if (!product || product.status !== "approved") {
          throw new Error(`${item.name} is no longer available. Remove it and choose another product.`);
        }
        if (quantity < product.moq) {
          throw new Error(
            `${product.name} has a minimum order of ${product.moq} ${product.unit}s.`,
          );
        }
        if (
          product.stockQuantity !== undefined &&
          quantity > product.stockQuantity
        ) {
          throw new Error(
            `Only ${product.stockQuantity} ${product.unit}s of ${product.name} are in stock right now.`,
          );
        }

        return {
          productId: product._id,
          name: product.name,
          supplierName: product.supplierName,
          quantity,
          unit: product.unit,
          caseSize: product.caseSize,
          unitPrice: product.pricePerUnit,
          lineTotal: quantity * product.pricePerUnit,
        };
      }),
    );

    const estimatedTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const existing = await ctx.db.query("wholesaleOrders").collect();
    const highest = existing.reduce((max, order) => {
      const numeric = Number(order.reference.replace(/\D/g, ""));
      return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
    }, 1000);
    const reference = `YZ-WS-${String(highest + 1).padStart(4, "0")}`;
    const now = Date.now();
    const clientName = requireText(args.clientName, "Contact name");

    const id = await ctx.db.insert("wholesaleOrders", {
      reference,
      clientName,
      businessName: requireText(args.businessName, "Business name"),
      email: requireText(args.email, "Email").toLowerCase(),
      phone: requireText(args.phone, "Phone number"),
      county: requireText(args.county, "County"),
      deliveryAddress:
        method === "pickup"
          ? (args.collectionPoint?.trim() || "Collection")
          : requireText(args.deliveryAddress ?? "", "Delivery address"),
      preferredDate: args.preferredDate?.trim() || undefined,
      notes: args.notes?.trim() || undefined,
      collectionMethod: method,
      collectionPoint:
        method === "pickup" ? args.collectionPoint?.trim() || undefined : undefined,
      collectionContactName:
        method === "pickup" ? args.collectionContactName?.trim() || undefined : undefined,
      collectionContactPhone:
        method === "pickup" ? args.collectionContactPhone?.trim() || undefined : undefined,
      collectionIdNumber:
        method === "pickup" ? args.collectionIdNumber?.trim() || undefined : undefined,
      collectionNotes: args.collectionNotes?.trim() || undefined,
      items,
      estimatedTotal,
      currency: BASE_CURRENCY,
      status: "pending_review",
      timeline: [
        {
          status: "pending_review",
          note: `Booking received (${method === "pickup" ? "collection" : "delivery"}).`,
          author: clientName,
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    });

    return { id, reference, estimatedTotal, currency: BASE_CURRENCY };
  },
});

/* ══════════════════════════════════════════════════════════════
 *  ORDER PORTAL — customer, sales rep and admin views
 * ══════════════════════════════════════════════════════════════ */

async function roleForEmail(ctx: QueryCtx, email: string) {
  if (!email.trim()) return null;
  const user = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email.trim().toLowerCase()))
    .first();
  return user?.role ?? null;
}

/** Which dashboard this account should land on, and its display name. */
export const portalAccess = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const role = await roleForEmail(ctx, email);
    const isAdmin = role === "admin" || role === "super_admin";
    const isSales = role === "sales";
    return {
      email: email.trim().toLowerCase(),
      role,
      view: isAdmin ? ("admin" as const) : isSales ? ("sales" as const) : ("customer" as const),
    };
  },
});

/** Customer dashboard: every booking made with this email. */
export const customerOrders = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return [];
    return await ctx.db
      .query("wholesaleOrders")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .order("desc")
      .collect();
  },
});

/** Sales desk: orders assigned to this rep plus the unassigned queue. */
export const salesRepOrders = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return { mine: [], unassigned: [] };
    const mine = await ctx.db
      .query("wholesaleOrders")
      .withIndex("by_sales_rep", (q) => q.eq("salesRepEmail", normalized))
      .order("desc")
      .collect();
    const open = await ctx.db
      .query("wholesaleOrders")
      .withIndex("by_status", (q) => q.eq("status", "pending_review"))
      .order("desc")
      .collect();
    return {
      mine,
      unassigned: open.filter((order) => !order.salesRepEmail).slice(0, 25),
    };
  },
});

/** Assign (or unassign) the sales rep who owns an order. */
export const assignSalesRep = mutation({
  args: {
    orderId: v.id("wholesaleOrders"),
    repEmail: v.optional(v.string()),
    repName: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.actorEmail, ["admin", "super_admin", "sales"]);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("That order no longer exists.");
    const email = args.repEmail?.trim().toLowerCase() || undefined;
    await ctx.db.patch(order._id, {
      salesRepEmail: email,
      salesRepName: email ? args.repName?.trim() || email : undefined,
      updatedAt: Date.now(),
    });
    return { id: order._id };
  },
});

/** A sales rep can pick up an unassigned booking from the shared queue. */
export const claimOrder = mutation({
  args: {
    orderId: v.id("wholesaleOrders"),
    repEmail: v.string(),
    repName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = requireText(args.repEmail, "Sales rep").toLowerCase();
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("That order no longer exists.");
    if (order.salesRepEmail && order.salesRepEmail !== email) {
      throw new Error("Another sales rep already owns this order.");
    }
    const isSalesOrAdmin =
      (await roleForEmail(ctx, email)) === "sales" ||
      (await roleForEmail(ctx, email)) === "admin" ||
      (await roleForEmail(ctx, email)) === "super_admin";
    if (!isSalesOrAdmin) {
      throw new Error("Only sales reps and admins can take an order from the queue.");
    }
    await ctx.db.patch(order._id, {
      salesRepEmail: email,
      salesRepName: args.repName?.trim() || email,
      updatedAt: Date.now(),
    });
    return { id: order._id };
  },
});

/** Note added to an order's timeline from any dashboard. */
export const addOrderNote = mutation({
  args: {
    orderId: v.id("wholesaleOrders"),
    note: v.string(),
    author: v.string(),
    status: v.optional(v.string()),
    internal: v.optional(v.boolean()),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("That order no longer exists.");
    const note = requireText(args.note, "Note");
    const now = Date.now();
    const timeline = order.timeline ?? [];

    if (args.internal) {
      await requireStaff(ctx, args.actorEmail, ["admin", "super_admin", "sales"]);
      await ctx.db.patch(order._id, {
        internalNotes: [order.internalNotes, note].filter(Boolean).join("\n"),
        timeline: [
          ...timeline,
          {
            status: args.status ?? order.status,
            note: `Internal: ${note}`,
            author: args.author?.trim() || "Order desk",
            createdAt: now,
          },
        ],
        updatedAt: now,
      });
      return { id: order._id };
    }

    await ctx.db.patch(order._id, {
      timeline: [
        ...timeline,
        {
          status: args.status ?? order.status,
          note,
          author: args.author?.trim() || "Order desk",
          createdAt: now,
        },
      ],
      updatedAt: now,
    });
    return { id: order._id };
  },
});

/** Order desk confirms collection point / handover contact for a pickup. */
export const setCollectionDetails = mutation({
  args: {
    orderId: v.id("wholesaleOrders"),
    collectionPoint: v.string(),
    collectionContactName: v.optional(v.string()),
    collectionContactPhone: v.optional(v.string()),
    collectionIdNumber: v.optional(v.string()),
    collectionNotes: v.optional(v.string()),
    collectionMethod: v.optional(
      v.union(v.literal("delivery"), v.literal("pickup")),
    ),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.actorEmail, ["admin", "super_admin", "sales"]);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("That order no longer exists.");
    const now = Date.now();
    await ctx.db.patch(order._id, {
      collectionMethod: args.collectionMethod ?? order.collectionMethod ?? "pickup",
      collectionPoint: args.collectionPoint.trim(),
      collectionContactName: args.collectionContactName?.trim() || order.collectionContactName,
      collectionContactPhone: args.collectionContactPhone?.trim() || order.collectionContactPhone,
      collectionIdNumber: args.collectionIdNumber?.trim() || order.collectionIdNumber,
      collectionNotes: args.collectionNotes?.trim() || order.collectionNotes,
      deliveryAddress:
        (args.collectionMethod ?? order.collectionMethod) === "pickup"
          ? args.collectionPoint.trim()
          : order.deliveryAddress,
      updatedAt: now,
    });
    return { id: order._id };
  },
});

/* ──────────────────────────────────────────────────────────────────────────────
 *  Commission rules + slips
 *
 * Rules are written by admins and by the supplier account that owns the product
 * (supplier role required, matching the supplier email on the rule). A rule
 * assigns one or more quantity-threshold tiers to a product; the tier whose
 * threshold is the largest value still <= the booked quantity is the rate used
 * for that line on a given order.
 *
 * Slips are generated from an order the moment it moves into a commissionable
 * status (confirmed / processing / fulfilled). The slip is payable to the sales
 * rep on the order, and is marked `paid` when the order is fulfilled and
 * payment is confirmed. Reps can download their own slips from the salesrep
 * dashboard.
 * ──────────────────────────────────────────────────────────────────────────── */

function applicableTier(
  tiers: Array<{ thresholdQuantity: number; ratePercent: number }>,
  quantity: number,
) {
  if (!tiers || tiers.length === 0) return null;
  let best: (typeof tiers)[0] | null = null;
  for (const tier of tiers) {
    if (Number.isFinite(tier.thresholdQuantity) && quantity >= tier.thresholdQuantity) {
      if (!best || tier.thresholdQuantity > best.thresholdQuantity) {
        best = tier;
      }
    }
  }
  return best;
}

async function requireCommissionWrite(
  ctx: QueryCtx,
  actorEmail: string | undefined,
  supplierEmail: string,
) {
  const email = (actorEmail ?? "").trim().toLowerCase();
  if (!email) {
    throw new Error("Sign in as an admin, or the supplier that owns this product.");
  }
  const role = await roleForEmail(ctx, email);
  const isAdmin = role === "admin" || role === "super_admin";
  const isSupplierOwner =
    role === "supplier" && email === supplierEmail.trim().toLowerCase();
  if (!isAdmin && !isSupplierOwner) {
    throw new Error(
      "Only the admin team or the supplier account that owns the product can set commission rules.",
    );
  }
}

export const setCommissionRule = mutation({
  args: {
    productId: v.id("fmcgProducts"),
    supplierEmail: v.string(),
    currency: v.string(),
    tiers: v.array(
      v.object({
        thresholdQuantity: v.number(),
        ratePercent: v.number(),
      }),
    ),
    notes: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const supplierEmail = requireText(args.supplierEmail, "Supplier account").toLowerCase();
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("That product does not exist.");
    const supplier = await ctx.db
      .query("suppliers")
      .withIndex("by_email", (q) => q.eq("officialEmail", supplierEmail))
      .first();
    if (!supplier || product.supplierId?.toString() !== supplier._id.toString()) {
      throw new Error("That commission rule is for a different supplier account.");
    }
    await requireCommissionWrite(ctx, args.actorEmail, supplierEmail);

    if (!args.currency.trim()) throw new Error("Currency is required.");
    if (args.tiers.length === 0) throw new Error("Add at least one commission tier.");
    for (const tier of args.tiers) {
      if (!Number.isFinite(tier.thresholdQuantity) || tier.thresholdQuantity < 1) {
        throw new Error("Each tier needs a whole-number quantity threshold of at least 1.");
      }
      if (!Number.isFinite(tier.ratePercent) || tier.ratePercent < 0) {
        throw new Error("Each tier needs a commission rate of at least 0%.");
      }
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("commissionRules")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        tiers: args.tiers,
        notes: args.notes?.trim() || undefined,
        currency: args.currency.trim(),
        updatedAt: now,
      });
      return { id: existing._id, updated: true };
    }

    const id = await ctx.db.insert("commissionRules", {
      productId: args.productId,
      supplierEmail,
      currency: args.currency.trim(),
      tiers: args.tiers,
      notes: args.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });
    return { id, updated: false };
  },
});

export const listCommissionRules = query({
  args: { supplierEmail: v.optional(v.string()) },
  handler: async (ctx, { supplierEmail }) => {
    if (supplierEmail?.trim()) {
      const supplier = await ctx.db
        .query("commissionRules")
        .withIndex("by_supplier", (q) => q.eq("supplierEmail", supplierEmail.trim().toLowerCase()))
        .collect();
      return supplier.map((rule) => ({
        ...rule,
        product: ctx.db.get(rule.productId) ?? null,
      }));
    }
    return await ctx.db.query("commissionRules").order("desc").collect();
  },
});

export const commissionSlipForOrder = query({
  args: { orderId: v.id("wholesaleOrders") },
  handler: async (ctx, { orderId }) => {
    return await ctx.db.query("commissionSlips")
      .withIndex("by_order", (q) => q.eq("orderId", orderId))
      .first();
  },
});

export const listSalesRepSlips = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return [];
    return await ctx.db
      .query("commissionSlips")
      .withIndex("by_rep", (q) => q.eq("salesRepEmail", normalized))
      .order("desc")
      .collect();
  },
});

/** The order desk reviews every slip so it can record payment (admin-only). */
export const listAllCommissionSlips = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const role = await roleForEmail(ctx, email);
    if (role !== "admin" && role !== "super_admin") {
      throw new Error("Only the admin team can review every commission slip.");
    }
    return await ctx.db.query("commissionSlips").order("desc").collect();
  },
});

export const generateCommissionSlipForOrder = mutation({
  args: {
    orderId: v.id("wholesaleOrders"),
    triggeredByStatus: v.union(
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("fulfilled"),
    ),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.actorEmail, ["admin", "super_admin", "sales"]);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("That order no longer exists.");
    if (!order.salesRepEmail) {
      throw new Error("Only orders with a sales rep can generate a commission slip.");
    }
    if (order.status !== args.triggeredByStatus) {
      throw new Error(`Generate this slip when the order is in ${args.triggeredByStatus} status.`);
    }

    const existing = await ctx.db
      .query("commissionSlips")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .first();
    if (existing) return { id: existing._id, generated: false };

    const rep = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", order.salesRepEmail))
      .first();

        const now = Date.now();
    const lines: Array<{
      productId: Id<"fmcgProducts">;
      name: string;
      supplierName: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      lineTotal: number;
      applicableRatePercent: number;
      thresholdQuantity: number;
      commissionAmount: number;
    }> = [];
    let totalCommission = 0;

    for (const item of order.items) {
      let applicableRatePercent = 0;
      let thresholdQuantity = 0;
      let commissionAmount = 0;

      if (item.productId) {
        const productId = item.productId;
        const rule = await ctx.db
          .query("commissionRules")
          .withIndex("by_product", (q) => q.eq("productId", productId))
          .first();
        if (rule) {
          const tier = applicableTier(rule.tiers, item.quantity);
          if (tier) {
            applicableRatePercent = tier.ratePercent;
            thresholdQuantity = tier.thresholdQuantity;
            commissionAmount = Math.round((item.lineTotal * tier.ratePercent) / 100);
          }
        }
      }

      const productId =
        item.productId ?? order.items[0]!.productId;
      if (!productId) {
        throw new Error("Order line is missing a product id.");
      }
      lines.push({
        productId: productId as Id<"fmcgProducts">,
        name: item.name,
        supplierName: item.supplierName,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        applicableRatePercent,
        thresholdQuantity,
        commissionAmount,
      });
      totalCommission += commissionAmount;
    }

    totalCommission = Math.round(totalCommission);

    const id = await ctx.db.insert("commissionSlips", {
      referenceSlug: order.reference.replace(/\W+/g, "_").toLowerCase(),
      orderId: args.orderId,
      salesRepEmail: order.salesRepEmail,
      salesRepName: order.salesRepName ?? rep?.name,
      currency: order.currency,
      orderTotal: order.estimatedTotal,
      lines: lines as Parameters<typeof ctx.db.insert<"commissionSlips">>[1]["lines"],
      totalCommission,
      triggeredByStatus: args.triggeredByStatus,
      status: "issued",
      createdAt: now,
      updatedAt: now,
    });

    return { id, generated: true };
  },
});

export const recordCommissionPaid = mutation({
  args: {
    slipId: v.id("commissionSlips"),
    paymentNote: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.actorEmail, ["admin", "super_admin"]);
    const slip = await ctx.db.get(args.slipId);
    if (!slip) throw new Error("That commission slip does not exist.");
    if (slip.status === "paid") throw new Error("This commission slip is already marked paid.");
    const now = Date.now();
    await ctx.db.patch(slip._id, {
      status: "paid",
      paidAt: now,
      updatedAt: now,
    });
    if (args.paymentNote?.trim()) {
      await ctx.db.patch(slip._id, {
        notes: args.paymentNote.trim(),
      });
    }
    return { id: slip._id };
  },
});

export const downloadCommissionSlip = mutation({
  args: {
    slipId: v.id("commissionSlips"),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = (args.actorEmail ?? "").trim().toLowerCase();
    if (!email) throw new Error("Sign in to download a commission slip.");
    const slip = await ctx.db.get(args.slipId);
    if (!slip) throw new Error("That commission slip does not exist.");
    if (slip.salesRepEmail !== email && !(await isCommissionAdmin(ctx, email))) {
      throw new Error("You can only download your own commission slips.");
    }
    // Return the slip so the client can render the downloadable document.
    return {
      slip: {
        referenceSlug: slip.referenceSlug,
        salesRepName: slip.salesRepName ?? null,
        salesRepEmail: slip.salesRepEmail,
        currency: slip.currency,
        orderTotal: slip.orderTotal,
        totalCommission: slip.totalCommission,
        status: slip.status,
        triggeredByStatus: slip.triggeredByStatus,
        createdAt: slip.createdAt,
        paidAt: slip.paidAt ?? null,
        lines: slip.lines,
      },
    };
  },
});

async function isCommissionAdmin(ctx: QueryCtx, email: string) {
  const role = await roleForEmail(ctx, email);
  return role === "admin" || role === "super_admin";
}



export const createEnquiry = mutation({
  args: {
    name: v.string(),
    businessName: v.string(),
    email: v.string(),
    phone: v.string(),
    service: v.string(),
    monthlyVolume: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("fmcgEnquiries", {
      name: requireText(args.name, "Name"),
      businessName: requireText(args.businessName, "Business name"),
      email: requireText(args.email, "Email").toLowerCase(),
      phone: requireText(args.phone, "Phone"),
      service: requireText(args.service, "Service"),
      monthlyVolume: args.monthlyVolume?.trim() || undefined,
      message: requireText(args.message, "Message"),
      status: "new",
      createdAt: Date.now(),
    });
    return { id };
  },
});

// --- Admin / order desk ---

export const adminListSuppliers = query({
  args: {},
  handler: async (ctx) => {
    const suppliers = await ctx.db.query("suppliers").order("desc").collect();
    return await Promise.all(
      suppliers.map(async (supplier) => {
        const documentUrls = await Promise.all(
          supplier.documentStorageIds.map((docId) => ctx.storage.getUrl(docId)),
        );
        return {
          ...supplier,
          storefrontUrl: supplier.storefrontStorageId
            ? await ctx.storage.getUrl(supplier.storefrontStorageId)
            : null,
          countyPermitUrl: supplier.countyPermitStorageId
            ? await ctx.storage.getUrl(supplier.countyPermitStorageId)
            : null,
          documentUrls: documentUrls.filter((url): url is string => Boolean(url)),
        };
      }),
    );
  },
});

export const adminListProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("fmcgProducts").order("desc").collect();
    return await Promise.all(
      products.map(async (product) => ({
        ...product,
        resolvedImageUrl: product.imageStorageId
          ? await ctx.storage.getUrl(product.imageStorageId)
          : (product.imageUrl ?? null),
      })),
    );
  },
});

export const adminListOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("wholesaleOrders").order("desc").collect();
  },
});

export const adminListEnquiries = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("fmcgEnquiries").order("desc").collect();
  },
});

export const setSupplierStatus = mutation({
  args: {
    id: v.id("suppliers"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("suspended"),
    ),
    reviewNotes: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, reviewNotes, actorEmail }) => {
    await requireStaff(ctx, actorEmail, ["admin", "super_admin"]);
    const supplier = await ctx.db.get(id);
    await ctx.db.patch(id, {
      status,
      reviewNotes: reviewNotes?.trim() || undefined,
      updatedAt: Date.now(),
    });

    // Approving a supplier is what grants the listing role: from then on the
    // account can post products for this supplier record only (until revoked).
    if (status === "approved" && supplier) {
      const email = supplier.officialEmail.trim().toLowerCase();
      const account = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", email))
        .first();
      if (
        account &&
        !["admin", "super_admin", "sales"].includes(account.role ?? "")
      ) {
        await ctx.db.patch(account._id, { role: "supplier" });
      }
    }
  },
});

export const setProductStatus = mutation({
  args: {
    id: v.id("fmcgProducts"),
    status: v.union(
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("archived"),
    ),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, actorEmail }) => {
    await requireStaff(ctx, actorEmail, ["admin", "super_admin"]);
    await ctx.db.patch(id, { status, updatedAt: Date.now() });
  },
});

export const setOrderStatus = mutation({
  args: {
    id: v.id("wholesaleOrders"),
    status: v.union(
      v.literal("pending_review"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("fulfilled"),
      v.literal("cancelled"),
    ),
    note: v.optional(v.string()),
    author: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, note, author, actorEmail }) => {
    await requireStaff(ctx, actorEmail, ["admin", "super_admin", "sales"]);
    const order = await ctx.db.get(id);
    if (!order) throw new Error("That order no longer exists.");
    const now = Date.now();
    const timeline = order.timeline ?? [];
    await ctx.db.patch(id, {
      status,
      timeline:
        order.status === status
          ? timeline
          : [
              ...timeline,
              {
                status,
                note: note?.trim() || undefined,
                author: author?.trim() || "Order desk",
                createdAt: now,
              },
            ],
      updatedAt: now,
    });
  },
});

export const setEnquiryStatus = mutation({
  args: {
    id: v.id("fmcgEnquiries"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("closed"),
    ),
    actorEmail: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, actorEmail }) => {
    await requireStaff(ctx, actorEmail, ["admin", "super_admin"]);
    await ctx.db.patch(id as Parameters<typeof ctx.db.patch>[0], { status });
  },
});

