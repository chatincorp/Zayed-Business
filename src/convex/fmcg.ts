import { v } from "convex/values";
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

export const createProduct = mutation({
  args: {
    supplierEmail: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    unit: v.string(),
    caseSize: v.number(),
    moq: v.number(),
    pricePerUnit: v.number(),
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

    assertPaymentTerms(args.paymentTerms);
    if (!args.imageStorageId && !args.imageUrl?.trim()) {
      throw new Error("Upload a product image so buyers can see what they are ordering.");
    }
    if (args.caseSize < 1) throw new Error("Case size must be at least 1.");
    if (args.moq < 1) throw new Error("Minimum order quantity must be at least 1.");
    if (args.pricePerUnit <= 0) throw new Error("Price per unit must be greater than zero.");

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
    deliveryAddress: v.string(),
    preferredDate: v.optional(v.string()),
    notes: v.optional(v.string()),
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

    const items = args.items.map((item) => {
      if (!Number.isFinite(item.quantity) || item.quantity < 1) {
        throw new Error(`Quantity for ${item.name} must be at least 1.`);
      }
      const quantity = Math.round(item.quantity);
      const unitPrice = Math.max(0, item.unitPrice);
      return {
        ...item,
        quantity,
        unitPrice,
        lineTotal: quantity * unitPrice,
      };
    });

    const estimatedTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const existing = await ctx.db.query("wholesaleOrders").collect();
    const reference = `YZ-WS-${String(existing.length + 1001).padStart(4, "0")}`;
    const now = Date.now();

    const id = await ctx.db.insert("wholesaleOrders", {
      reference,
      clientName: requireText(args.clientName, "Contact name"),
      businessName: requireText(args.businessName, "Business name"),
      email: requireText(args.email, "Email").toLowerCase(),
      phone: requireText(args.phone, "Phone number"),
      county: requireText(args.county, "County"),
      deliveryAddress: requireText(args.deliveryAddress, "Delivery address"),
      preferredDate: args.preferredDate?.trim() || undefined,
      notes: args.notes?.trim() || undefined,
      items,
      estimatedTotal,
      currency: BASE_CURRENCY,
      status: "pending_review",
      createdAt: now,
      updatedAt: now,
    });

    return { id, reference, estimatedTotal, currency: BASE_CURRENCY };
  },
});

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
  },
  handler: async (ctx, { id, status, reviewNotes }) => {
    await ctx.db.patch(id, {
      status,
      reviewNotes: reviewNotes?.trim() || undefined,
      updatedAt: Date.now(),
    });
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
  },
  handler: async (ctx, { id, status }) => {
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
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status, updatedAt: Date.now() });
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
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

