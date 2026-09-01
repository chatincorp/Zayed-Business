import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Dumbbell,
  Waves,
  Heart,
  SlidersHorizontal,
  Plane,
  Building2,
  ArrowUpDown,
  MessageSquare,
  Bell,
  Settings,
  BarChart3,
  Briefcase,
  TrendingUp,
} from "lucide-react";

const destinations = [
  {
    name: "Nairobi, Kenya",
    img: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=600&q=80",
    stays: 2847,
    from: 45,
  },
  {
    name: "Mombasa, Kenya",
    img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&q=80",
    stays: 1523,
    from: 38,
  },
  {
    name: "London, UK",
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    stays: 8921,
    from: 89,
  },
  {
    name: "Dubai, UAE",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    stays: 5634,
    from: 72,
  },
  {
    name: "Cape Town, SA",
    img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80",
    stays: 3218,
    from: 56,
  },
];

const hotels = [
  {
    name: "Serena Hotel Nairobi",
    location: "Nairobi City Centre",
    stars: 5,
    price: 185,
    originalPrice: 220,
    rating: 9.2,
    reviews: 2847,
    badge: "Superb",
    amenities: ["wifi", "pool", "gym", "restaurant"],
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
  },
  {
    name: "Hemingways Nairobi",
    location: "Karen, Nairobi",
    stars: 5,
    price: 245,
    originalPrice: 310,
    rating: 9.5,
    reviews: 1563,
    badge: "Exceptional",
    amenities: ["wifi", "pool", "restaurant", "parking"],
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80",
  },
  {
    name: "Radisson Blu Nairobi",
    location: "Upper Hill, Nairobi",
    stars: 5,
    price: 142,
    originalPrice: 180,
    rating: 8.8,
    reviews: 3241,
    badge: "Excellent",
    amenities: ["wifi", "gym", "restaurant", "spa"],
    img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80",
  },
  {
    name: "Sarova Panafric",
    location: "Kenyatta Avenue",
    stars: 4,
    price: 98,
    originalPrice: 130,
    rating: 8.4,
    reviews: 4102,
    badge: "Very Good",
    amenities: ["wifi", "pool", "restaurant"],
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80",
  },
  {
    name: "Marie Stopes House",
    location: "Westlands, Nairobi",
    stars: 4,
    price: 76,
    originalPrice: 95,
    rating: 8.1,
    reviews: 1890,
    badge: "Very Good",
    amenities: ["wifi", "parking"],
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  },
  {
    name: "Eka Hotel Nairobi",
    location: "Mombasa Road",
    stars: 4,
    price: 89,
    originalPrice: 115,
    rating: 8.6,
    reviews: 2156,
    badge: "Excellent",
    amenities: ["wifi", "gym", "restaurant", "parking"],
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80",
  },
];

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  pool: Waves,
  gym: Dumbbell,
  restaurant: Utensils,
  parking: Car,
  spa: Coffee,
};

function BookingHero() {
  return (
    <div className="relative bg-[#003580] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#003580]/30 to-[#003580]/90" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3"
        >
          Find your next stay
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-white/70 text-lg mb-8 max-w-xl"
        >
          Search deals on hotels, homes, and much more...
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-white rounded-xl p-3 flex flex-col sm:flex-row gap-3 shadow-2xl"
        >
          <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              placeholder="Where are you going?"
              className="flex-1 text-sm outline-none bg-transparent"
              defaultValue="Nairobi, Kenya"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Sep 1 – Sep 7</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">2 adults</span>
          </div>
          <button className="bg-[#0071c2] hover:bg-[#005fa3] text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors">
            Search
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function DestinationScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Trending destinations
          </h2>
          <button className="text-[#0071c2] text-sm font-semibold hover:underline">
            View all →
          </button>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-shrink-0 w-[200px] group cursor-pointer"
            >
              <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="text-white font-semibold text-sm">
                    {dest.name}
                  </div>
                  <div className="text-white/70 text-xs">
                    {dest.stays.toLocaleString()}+ stays
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                From{" "}
                <span className="font-bold text-gray-900">${dest.from}</span> /night
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HotelCard({ hotel, index }: { hotel: (typeof hotels)[0]; index: number }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#0071c2]/20 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative w-full sm:w-64 h-44 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={hotel.img}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
        <div className="absolute top-3 left-3 bg-[#003580] text-white px-2 py-1 rounded text-xs font-semibold">
          {hotel.badge}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-gray-900 text-lg">{hotel.name}</h3>
            <div className="flex items-center gap-1 bg-[#003580] text-white px-2.5 py-1 rounded-lg text-sm font-bold flex-shrink-0">
              {hotel.rating}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-500">{hotel.location}</span>
          </div>
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-[#febb02] text-[#febb02]"
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {hotel.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity] || Wifi;
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1 text-xs text-gray-500"
                >
                  <Icon className="w-3 h-3" />
                  <span className="capitalize">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-xs text-gray-400">
            {hotel.reviews.toLocaleString()} reviews
          </div>
          <div className="text-right">
            {hotel.originalPrice > hotel.price && (
              <div className="text-xs text-gray-400 line-through">
                ${hotel.originalPrice}
              </div>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-500">1 night:</span>
              <span className="text-xl font-bold text-gray-900">
                ${hotel.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HotelListings() {
  return (
    <section className="py-10 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Nairobi: 2,847 properties found
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sep 1 – Sep 7, 2 adults, 1 room
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#0071c2] transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#0071c2] transition-colors">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort by: Recommended
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {hotels.map((hotel, i) => (
            <HotelCard key={hotel.name} hotel={hotel} index={i} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {[1, 2, 3, "...", 12].map((page, i) => (
            <button
              key={i}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === 1
                  ? "bg-[#0071c2] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#0071c2]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppSidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "bookings", label: "Bookings", icon: Briefcase },
    { id: "properties", label: "Properties", icon: Building2 },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="hidden lg:flex w-56 bg-white border-r border-gray-200 flex-col">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#003580] flex items-center justify-center">
            <span className="text-white text-xs font-bold">YZ</span>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">YZ Booking</div>
            <div className="text-[10px] text-gray-400">Management Portal</div>
          </div>
        </div>
      </div>
      <div className="p-2 flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-[#003580]/10 text-[#003580] font-semibold"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DashboardContent() {
  const metrics = [
    { label: "Total Bookings", value: "1,247", change: "+12.5%", up: true },
    { label: "Revenue", value: "$48,520", change: "+8.2%", up: true },
    { label: "Occupancy Rate", value: "87%", change: "+3.1%", up: true },
    { label: "Avg. Rating", value: "4.8", change: "-0.1", up: false },
  ];

  return (
    <div className="flex-1 bg-[#f8f9fa] p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Welcome back, here&apos;s your overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#003580] flex items-center justify-center text-white text-xs font-bold">
            YZ
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-white rounded-xl p-4 border border-gray-100"
          >
            <div className="text-xs text-gray-400 mb-1">{m.label}</div>
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
            <div
              className={`text-xs font-semibold mt-1 ${
                m.up ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {m.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Revenue Overview</h3>
          <div className="flex gap-2 text-xs">
            <span className="px-3 py-1 bg-[#003580] text-white rounded-full">
              Monthly
            </span>
            <span className="px-3 py-1 text-gray-400 rounded-full">Weekly</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-40">
          {[35, 42, 38, 55, 48, 62, 58, 72, 68, 80, 75, 88].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`flex-1 rounded-t ${
                i === 11 ? "bg-[#003580]" : "bg-[#003580]/20"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[10px] text-gray-400">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
            (m) => (
              <span key={m}>{m}</span>
            )
          )}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
        <div className="space-y-3">
          {[
            { guest: "James Mwangi", property: "Serena Hotel", dates: "Sep 1-5", amount: "$740", status: "Confirmed" },
            { guest: "Sarah Johnson", property: "Hemingways", dates: "Sep 3-8", amount: "$1,225", status: "Confirmed" },
            { guest: "Peter Kimani", property: "Radisson Blu", dates: "Sep 5-7", amount: "$284", status: "Pending" },
            { guest: "Amina Hassan", property: "Eka Hotel", dates: "Sep 7-10", amount: "$267", status: "Confirmed" },
          ].map((b, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  {b.guest
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {b.guest}
                  </div>
                  <div className="text-xs text-gray-400">
                    {b.property} · {b.dates}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-900">
                  {b.amount}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    b.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DemoWebapp() {
  const [view, setView] = useState<"portal" | "app">("portal");

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top bar with toggle */}
      <div className="bg-[#003580] text-white px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Plane className="w-4 h-4" />
          <span className="font-semibold">YZ Booking Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60">View:</span>
          <button
            onClick={() => setView("portal")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              view === "portal"
                ? "bg-white text-[#003580]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Public Site
          </button>
          <button
            onClick={() => setView("app")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              view === "app"
                ? "bg-white text-[#003580]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Management Dashboard
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "portal" ? (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BookingHero />
            <DestinationScroller />
            <HotelListings />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-[calc(100vh-40px)]"
          >
            <AppSidebar />
            <DashboardContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to demos link */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="/"
          className="flex items-center gap-2 bg-[#003580]/90 backdrop-blur text-white/70 hover:text-white px-4 py-2 rounded-lg text-xs font-medium transition-all border border-white/10"
        >
          ← Back to Yasir Zayed
        </a>
      </div>
    </div>
  );
}
