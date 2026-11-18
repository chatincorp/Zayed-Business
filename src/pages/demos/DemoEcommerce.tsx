import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Tag,
  Zap,
  Gift,
  Headphones,
  Monitor as MonitorIcon,
  Gamepad2,
  BookOpen,
  Smartphone,
  Menu,
  X,
  Home,
  CheckCircle2,
  Plus,
  Minus,
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Smartphone, color: "#007185" },
  { name: "Computers", icon: MonitorIcon, color: "#007185" },
  { name: "Gaming", icon: Gamepad2, color: "#007185" },
  { name: "Audio", icon: Headphones, color: "#007185" },
  { name: "Fashion", icon: Tag, color: "#007185" },
  { name: "Home & Garden", icon: Home, color: "#007185" },
  { name: "Books", icon: BookOpen, color: "#007185" },
  { name: "Sports", icon: Zap, color: "#007185" },
];

const products = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    price: 298.0,
    originalPrice: 399.99,
    rating: 4.7,
    reviews: 12847,
    prime: true,
    delivery: "Tomorrow",
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Apple Watch Ultra 2 — Titanium Case, Alpine Loop",
    price: 749.0,
    originalPrice: 799.0,
    rating: 4.8,
    reviews: 8432,
    prime: true,
    delivery: "Tomorrow",
    badge: "#1 Best Seller",
    img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Samsonite Proxis 55cm Spinner Cabin Luggage — Rose Gold",
    price: 189.0,
    originalPrice: 265.0,
    rating: 4.5,
    reviews: 3241,
    prime: true,
    delivery: "2 days",
    badge: "",
    img: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&q=80",
    category: "Fashion",
  },
  {
    id: 4,
    name: "BenQ ScreenBar Monitor Light — Auto-Dimming LED Desk Lamp",
    price: 109.0,
    originalPrice: 129.0,
    rating: 4.6,
    reviews: 5678,
    prime: true,
    delivery: "Tomorrow",
    badge: "Limited Deal",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    category: "Home & Garden",
  },
  {
    id: 5,
    name: "Canon EOS R6 Mark II — Full Frame Mirrorless Camera Body",
    price: 2399.0,
    originalPrice: 2499.0,
    rating: 4.9,
    reviews: 2156,
    prime: true,
    delivery: "3 days",
    badge: "Amazon's Choice",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    category: "Electronics",
  },
  {
    id: 6,
    name: "Kindle Paperwhite Signature Edition — 32 GB, Agave Green",
    price: 189.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 18923,
    prime: true,
    delivery: "Tomorrow",
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    category: "Electronics",
  },
  {
    id: 7,
    name: "Logitech MX Master 3S — Wireless Performance Mouse",
    price: 89.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviews: 7845,
    prime: true,
    delivery: "Tomorrow",
    badge: "",
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
    category: "Electronics",
  },
  {
    id: 8,
    name: "Herman Miller Aeron Chair — Graphite, Size B Medium",
    price: 1395.0,
    originalPrice: 1695.0,
    rating: 4.6,
    reviews: 4567,
    prime: false,
    delivery: "5-7 days",
    badge: "Deal of the Day",
    img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80",
    category: "Home & Garden",
  },
  {
    id: 9,
    name: "Samsung 55\" S90C OLED 4K Smart TV — 2024 Model",
    price: 1297.99,
    originalPrice: 1597.99,
    rating: 4.7,
    reviews: 6234,
    prime: true,
    delivery: "3 days",
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80",
    category: "Electronics",
  },
];

const deals = [
  { label: "Today's Deals", icon: Tag, color: "#CC0C39" },
  { label: "Prime Day", icon: Zap, color: "#00A8E1" },
  { label: "Gift Cards", icon: Gift, color: "#C45500" },
  { label: "New Releases", icon: Star, color: "#007185" },
];

function NavBar({
  cartCount,
  onCartToggle,
  search,
  onSearch,
}: {
  cartCount: number;
  onCartToggle: () => void;
  search: string;
  onSearch: (v: string) => void;
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="bg-[#131921] sticky top-0 z-40">
      <div className="max-w-[1500px] mx-auto flex items-center gap-4 px-4 py-2">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer">
          <div className="text-white font-bold text-xl tracking-tight">
            yasirzayed
            <span className="text-[#ff9900]">.store</span>
          </div>
        </div>

        {/* Deliver to */}
        <div className="hidden lg:flex items-center gap-1 text-white text-xs cursor-pointer hover:outline hover:outline-1 hover:outline-white rounded p-1">
          <MapPin className="w-3.5 h-3.5" />
          <div>
            <div className="text-white/50 text-[10px]">Deliver to</div>
            <div className="font-bold text-sm">Nairobi 00100</div>
          </div>
        </div>

        {/* Search */}
        <div
          className={`flex-1 flex h-10 rounded-lg overflow-hidden transition-shadow ${
            searchFocused ? "ring-2 ring-[#ff9900]" : ""
          }`}
        >
          <select className="bg-gray-100 text-gray-700 text-xs px-3 border-r border-gray-200 outline-none hidden sm:block">
            <option>All</option>
            <option>Electronics</option>
            <option>Home</option>
          </select>
          <input
            type="text"
            placeholder="Search yasirzayed.store"
            className="flex-1 px-4 text-sm outline-none bg-white"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <button className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center">
            <Search className="w-5 h-5 text-[#131921]" />
          </button>
        </div>

        {/* Right nav */}
        <div className="flex items-center gap-4 text-white">
          <div className="hidden md:block cursor-pointer hover:outline hover:outline-1 hover:outline-white rounded p-1">
            <div className="text-[10px] text-white/50">Hello, Sign in</div>
            <div className="font-bold text-sm">Account & Lists</div>
          </div>
          <div className="hidden md:block cursor-pointer hover:outline hover:outline-1 hover:outline-white rounded p-1">
            <div className="text-[10px] text-white/50">Returns</div>
            <div className="font-bold text-sm">& Orders</div>
          </div>
          <button
            onClick={onCartToggle}
            className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white rounded p-1 relative"
          >
            <div className="relative">
              <ShoppingCart className="w-7 h-7" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff9900] text-[#131921] rounded-full text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-bold text-sm hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Sub nav */}
      <div className="bg-[#232f3e] px-4 py-1.5 flex items-center gap-6 text-white text-xs overflow-x-auto">
        <button className="flex items-center gap-1 font-semibold hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1">
          <Menu className="w-4 h-4" /> All
        </button>
        {[
          "Today's Deals",
          "Customer Service",
          "Registry",
          "Gift Cards",
          "Sell",
          "Prime",
          "Electronics",
          "Home & Kitchen",
          "Fashion",
        ].map((link) => (
          <span key={link} className="whitespace-nowrap cursor-pointer hover:underline">
            {link}
          </span>
        ))}
      </div>
    </nav>
  );
}

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const slides = [
    {
      title: "Upgrade Your Workspace",
      subtitle: "Save up to 40% on premium office furniture and accessories",
      bg: "from-[#1a2332] to-[#0d1b2a]",
      accent: "#00a8e1",
    },
    {
      title: "Tech Deals This Week",
      subtitle: "Discover latest electronics with Prime free delivery",
      bg: "from-[#232f3e] to-[#131921]",
      accent: "#ff9900",
    },
    {
      title: "New arrivals in Home & Garden",
      subtitle: "Refresh your living space with our curated collection",
      bg: "from-[#1b3a2a] to-[#0f2118]",
      accent: "#067d62",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[280px] sm:h-[350px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-r ${slides[current].bg}`}
        >
          <div className="max-w-[1500px] mx-auto px-8 sm:px-16 h-full flex items-center">
            <div className="max-w-lg">
              <h2
                className="text-3xl sm:text-4xl font-bold mb-3"
                style={{ color: slides[current].accent }}
              >
                {slides[current].title}
              </h2>
              <p className="text-white/60 text-lg mb-6">
                {slides[current].subtitle}
              </p>
              <button
                className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: slides[current].accent,
                  color: "#131921",
                }}
              >
                Shop Now
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

      {/* Nav arrows */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 hover:bg-black/10 transition-colors"
      >
        <ChevronLeft className="w-8 h-8 text-gray-600" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 hover:bg-black/10 transition-colors"
      >
        <ChevronRight className="w-8 h-8 text-gray-600" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-[#ff9900] w-6" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryBar({
  active,
  onSelect,
}: {
  active: string | null;
  onSelect: (c: string | null) => void;
}) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1500px] mx-auto px-4 py-4 flex gap-6 overflow-x-auto">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.name;
          return (
            <motion.button
              key={cat.name}
              whileHover={{ y: -2 }}
              onClick={() => onSelect(isActive ? null : cat.name)}
              className="flex-shrink-0 text-center group"
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors border ${
                  isActive
                    ? "bg-[#00a8e1]/10 border-[#00a8e1]/40"
                    : "bg-gray-50 group-hover:bg-gray-100 border-gray-100"
                }`}
              >
                <Icon
                  className={`w-7 h-7 ${isActive ? "text-[#00a8e1]" : "text-gray-600"}`}
                />
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-[#007185] font-bold" : "text-gray-600"
                }`}
              >
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: (typeof products)[0];
  onAddToCart: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square p-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <div className="absolute top-2 left-2 bg-[#cc0c39] text-white text-[10px] font-bold px-2 py-1 rounded">
            {product.badge}
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-[#cc0c39] text-white text-[10px] font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          <Heart
            className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-[#007185] transition-colors leading-snug">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(product.rating)
                  ? "fill-[#de7921] text-[#de7921]"
                  : "text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-[#007185] ml-1">
            {product.reviews.toLocaleString()}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {product.prime && (
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#00a8e1] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              prime
            </span>
            <span className="text-xs text-gray-500">
              FREE delivery{" "}
              <span className="font-bold">{product.delivery}</span>
            </span>
          </div>
        )}

        <div className="mt-auto">
          <button
            onClick={onAddToCart}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface CartLine {
  product: (typeof products)[0];
  qty: number;
}

function CartSidebar({
  open,
  onClose,
  items,
  onSetQty,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  items: CartLine[];
  onSetQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}) {
  const total = items.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const count = items.reduce((sum, l) => sum + l.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2 mb-1">
                          {product.name}
                        </h4>
                        <div className="text-lg font-bold text-gray-900">
                          ${(product.price * qty).toFixed(2)}
                        </div>
                        {product.prime && (
                          <span className="bg-[#00a8e1] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            prime
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end justify-between self-stretch">
                        <button
                          onClick={() => onRemove(product.id)}
                          className="text-xs text-[#007185] hover:text-[#c7511f]"
                        >
                          Remove
                        </button>
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-1 py-0.5">
                          <button
                            onClick={() => onSetQty(product.id, qty - 1)}
                            className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{qty}</span>
                          <button
                            onClick={() => onSetQty(product.id, qty + 1)}
                            className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">
                    Subtotal ({count} item{count !== 1 ? "s" : ""}):
                  </span>
                  <span className="text-xl font-bold">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-3 rounded-full font-semibold transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CheckoutModal({
  items,
  onClose,
}: {
  items: CartLine[];
  onClose: () => void;
}) {
  const subtotal = items.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = subtotal > 25 ? 0 : 5.99;
  const total = subtotal + shipping;
  const [placed, setPlaced] = useState(false);
  // Pure, deterministic order id derived from the cart contents.
  const orderId = useMemo(
    () =>
      `YZ-${items.reduce((s, l) => s + l.product.id * 7 + l.qty, 13)
        .toString()
        .padStart(3, "0")}${items.length.toString().padStart(3, "0")}`,
    [items]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
      >
        {placed ? (
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Order placed!</h3>
            <p className="text-sm text-gray-500 mb-1">
              Order <span className="font-bold text-gray-800">{orderId}</span> is confirmed.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Arriving in 2 days with Prime free delivery.
            </p>
            <button
              onClick={onClose}
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] px-8 py-2.5 rounded-full font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Checkout</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5 max-h-56 overflow-auto">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3 text-sm">
                  <img src={product.img} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-400">Qty {qty}</p>
                  </div>
                  <span className="font-bold text-gray-900">${(product.price * qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm mb-5">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-semibold" : ""}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-1">
                <span>Order total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setPlaced(true)}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-3 rounded-full font-semibold transition-colors"
            >
              Place Your Order — ${total.toFixed(2)}
            </button>
            <p className="text-[11px] text-gray-400 text-center mt-3">
              Demo checkout — no real payment is processed.
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function DemoEcommerce() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const addToCart = (product: (typeof products)[0]) => {
    setCartItems((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const setQty = (id: number, qty: number) => {
    setCartItems((prev) =>
      qty <= 0
        ? prev.filter((l) => l.product.id !== id)
        : prev.map((l) => (l.product.id === id ? { ...l, qty } : l))
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((l) => l.product.id !== id));
  };

  const cartCount = cartItems.reduce((s, l) => s + l.qty, 0);

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!activeCategory || p.category === activeCategory) &&
        (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#e3e6e6] font-sans">
      <NavBar
        cartCount={cartCount}
        onCartToggle={() => setCartOpen(true)}
        search={search}
        onSearch={setSearch}
      />
      <CategoryBar active={activeCategory} onSelect={setActiveCategory} />
      {!search && !activeCategory && <HeroBanner />}

      {/* Deal badges */}
      <div className="max-w-[1500px] mx-auto px-4 py-4 -mt-8 relative z-20">
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {deals.map((deal) => {
            const Icon = deal.icon;
            return (
              <motion.div
                key={deal.label}
                whileHover={{ y: -2 }}
                className="flex-shrink-0 flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <Icon className="w-5 h-5" style={{ color: deal.color }} />
                <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                  {deal.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {search
              ? `Results for "${search}"`
              : activeCategory
                ? activeCategory
                : "Today's Deals"}
          </h2>
          {visibleProducts.length !== products.length && (
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory(null);
              }}
              className="text-sm text-[#007185] hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {visibleProducts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No results found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try a different search term or browse a category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Feature banner */}
      <div className="max-w-[1500px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Truck, title: "Free Delivery", desc: "On orders over $25 with Prime" },
            { icon: Shield, title: "Secure Payments", desc: "256-bit encryption, 100% safe" },
            { icon: RotateCcw, title: "Easy Returns", desc: "30-day hassle-free return policy" },
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 flex items-center gap-4 border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00a8e1]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-[#00a8e1]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-gray-500">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#232f3e] text-white">
        <div className="max-w-[1500px] mx-auto px-4 py-10">
          <div className="text-center mb-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-[#37475a] hover:bg-[#485769] text-white text-sm px-8 py-3 rounded w-full sm:w-auto transition-colors"
            >
              Back to top
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { title: "Get to Know Us", links: ["Careers", "Blog", "About", "Investor Relations"] },
              { title: "Make Money", links: ["Sell products", "Become an Affiliate", "Advertise", "Self-Publish"] },
              { title: "Payment", links: ["Business Card", "Shop with Points", "Reload Balance", "Currency Converter"] },
              { title: "Let Us Help", links: ["Your Account", "Your Orders", "Shipping Rates", "Returns & Replacements"] },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="font-bold text-sm mb-3">{col.title}</h3>
                {col.links.map((link) => (
                  <div key={link} className="text-xs text-gray-400 mb-2 cursor-pointer hover:underline">
                    {link}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#131921] py-4 text-center">
          <div className="text-white font-bold text-sm">
            yasirzayed
            <span className="text-[#ff9900]">.store</span>
          </div>
          <div className="text-gray-500 text-xs mt-1">
            © 2026 Yasir Zayed. All rights reserved. Demo e-commerce platform.
          </div>
        </div>
      </footer>

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onSetQty={setQty}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal
            items={cartItems}
            onClose={() => setCheckoutOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Back to demos link */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="/"
          className="flex items-center gap-2 bg-[#131921]/90 backdrop-blur text-white/70 hover:text-white px-4 py-2 rounded-lg text-xs font-medium transition-all border border-white/10"
        >
          ← Back to Yasir Zayed
        </a>
      </div>
    </div>
  );
}
