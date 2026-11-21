import { useRef, useState } from "react";
import { useSEO } from "@/lib/seo";
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
  CheckCircle2,
  X,
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

function BookingHero({
  search,
  onSearch,
  guests,
  onGuests,
}: {
  search: string;
  onSearch: (v: string) => void;
  guests: number;
  onGuests: (v: number) => void;
}) {
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
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Sep 1 – Sep 7</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
            <Users className="w-4 h-4 text-gray-400" />
            <select
              value={guests}
              onChange={(e) => onGuests(Number(e.target.value))}
              className="text-sm text-gray-600 outline-none bg-transparent"
            >
              {[1, 2, 3, 4].map((g) => (
                <option key={g} value={g}>
                  {g} adult{g > 1 ? "s" : ""}
                </option>
              ))}
            </select>
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

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

function HotelCard({
  hotel,
  index,
  nights,
  onBook,
}: {
  hotel: (typeof hotels)[0];
  index: number;
  nights: number;
  onBook: (hotel: (typeof hotels)[0]) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [booked, setBooked] = useState(false);

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
              <span className="text-xs text-gray-500">
                {nights} night{nights > 1 ? "s" : ""}:
              </span>
              <span className="text-xl font-bold text-gray-900">
                ${hotel.price * nights}
              </span>
            </div>
            {booked ? (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Booked!
              </div>
            ) : (
              <button
                onClick={() => {
                  setBooked(true);
                  onBook(hotel);
                }}
                className="mt-2 bg-[#0071c2] hover:bg-[#005fa3] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Reserve
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HotelListings({
  search,
  guests,
  onBook,
}: {
  search: string;
  guests: number;
  onBook: (hotel: (typeof hotels)[0]) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);
  const [page, setPage] = useState(1);
  const perPage = 4;
  const nights = 6;

  const filtered = hotels.filter(
    (h) =>
      h.rating >= minRating &&
      h.price <= maxPrice &&
      (search.trim() === "" ||
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const pageCount = Math.max(1, Math.ceil(sorted.length / perPage));
  const pageItems = sorted.slice((page - 1) * perPage, page * perPage);
  const sortLabels: Record<SortKey, string> = {
    recommended: "Recommended",
    "price-asc": "Price: low to high",
    "price-desc": "Price: high to low",
    rating: "Guest rating",
  };

  return (
    <section className="py-10 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Nairobi: {filtered.length} properties found
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sep 1 – Sep 7 · {guests} adult{guests > 1 ? "s" : ""} · 1 room
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Rating filter */}
            <div className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              {[8.5, 9, 9.5].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setMinRating((prev) => (prev === r ? 0 : r));
                    setPage(1);
                  }}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    minRating === r
                      ? "bg-[#003580] text-white"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {r}+
                </button>
              ))}
            </div>
            {/* Price filter */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
              <span className="text-gray-400 text-xs whitespace-nowrap">Max ${maxPrice}</span>
              <input
                type="range"
                min={60}
                max={300}
                step={10}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setPage(1);
                }}
                className="w-24 accent-[#0071c2]"
              />
            </div>
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-[#0071c2] transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort by: {sortLabels[sortKey]}
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg border border-gray-200 shadow-xl z-30 overflow-hidden"
                  >
                    {(Object.keys(sortLabels) as SortKey[]).map((k) => (
                      <button
                        key={k}
                        onClick={() => {
                          setSortKey(k);
                          setSortOpen(false);
                          setPage(1);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                          sortKey === k
                            ? "text-[#003580] font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {sortLabels[k]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {pageItems.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No properties match your filters</p>
              <button
                onClick={() => {
                  setMinRating(0);
                  setMaxPrice(300);
                  setPage(1);
                }}
                className="mt-3 text-sm text-[#0071c2] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            pageItems.map((hotel, i) => (
              <HotelCard
                key={hotel.name}
                hotel={hotel}
                index={i}
                nights={nights}
                onBook={onBook}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-[#0071c2] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#0071c2]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AppSidebar({
  activeTab,
  onTab,
}: {
  activeTab: string;
  onTab: (id: string) => void;
}) {
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
              onClick={() => onTab(tab.id)}
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

/* ── Management dashboard panels ─────────────────────────── */

function BookingsPanel() {
  const rows = [
    { guest: "James Mwangi", property: "Serena Hotel", dates: "Sep 1-5", amount: 740, status: "Confirmed" },
    { guest: "Sarah Johnson", property: "Hemingways", dates: "Sep 3-8", amount: 1225, status: "Confirmed" },
    { guest: "Peter Kimani", property: "Radisson Blu", dates: "Sep 5-7", amount: 284, status: "Pending" },
    { guest: "Amina Hassan", property: "Eka Hotel", dates: "Sep 7-10", amount: 267, status: "Confirmed" },
    { guest: "Grace Otieno", property: "Sarova Panafric", dates: "Sep 9-12", amount: 294, status: "Cancelled" },
  ];
  const badge = (s: string) =>
    s === "Confirmed"
      ? "bg-emerald-50 text-emerald-600"
      : s === "Pending"
        ? "bg-amber-50 text-amber-600"
        : "bg-red-50 text-red-500";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">All Bookings</h3>
        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#003580] text-white font-semibold hover:bg-[#002a66] transition-colors">
          + New Booking
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3 pr-4 font-medium">Guest</th>
              <th className="pb-3 pr-4 font-medium">Property</th>
              <th className="pb-3 pr-4 font-medium">Dates</th>
              <th className="pb-3 pr-4 font-medium text-right">Amount</th>
              <th className="pb-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.guest} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 font-semibold text-gray-900">{b.guest}</td>
                <td className="py-3 pr-4 text-gray-500">{b.property}</td>
                <td className="py-3 pr-4 text-gray-500">{b.dates}</td>
                <td className="py-3 pr-4 text-right font-bold text-gray-900">${b.amount.toLocaleString()}</td>
                <td className="py-3 text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge(b.status)}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PropertiesPanel() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {hotels.map((h) => (
        <div key={h.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="h-32 overflow-hidden">
            <img src={h.img} alt={h.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-sm text-gray-900 leading-snug">{h.name}</h4>
              <span className="text-xs font-bold bg-[#003580] text-white px-2 py-0.5 rounded flex-shrink-0">
                {h.rating}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{h.location}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-bold text-gray-900">${h.price}/night</span>
              <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-600 font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesPanel() {
  const threads = [
    { from: "James Mwangi", text: "Is late check-out possible on the 5th?", time: "2m", unread: true },
    { from: "Sarah Johnson", text: "Thank you — the upgrade was perfect!", time: "1h", unread: true },
    { from: "Peter Kimani", text: "Can I add breakfast to my booking?", time: "3h", unread: false },
    { from: "Amina Hassan", text: "Which terminal is closest to Eka?", time: "1d", unread: false },
  ];
  return (
    <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
      {threads.map((t) => (
        <div key={t.from} className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
            {t.from.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{t.from}</span>
              {t.unread && <span className="w-2 h-2 rounded-full bg-[#0071c2]" />}
            </div>
            <p className="text-sm text-gray-500 truncate">{t.text}</p>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">{t.time}</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPanel() {
  const channels = [
    { name: "Direct", pct: 42, color: "bg-[#003580]" },
    { name: "OTA", pct: 31, color: "bg-[#0071c2]" },
    { name: "Corporate", pct: 18, color: "bg-[#febb02]" },
    { name: "Travel agents", pct: 9, color: "bg-gray-300" },
  ];
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-4">Bookings by Channel</h3>
        <div className="space-y-3">
          {channels.map((c) => (
            <div key={c.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 font-medium">{c.name}</span>
                <span className="text-gray-900 font-bold">{c.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.pct}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${c.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-4">Occupancy Trend</h3>
        <div className="flex items-end gap-1.5 h-36">
          {[62, 68, 64, 71, 74, 70, 78, 82, 79, 85, 88, 91].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className={`flex-1 rounded-t ${i === 11 ? "bg-[#003580]" : "bg-[#003580]/25"}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-400">
          {"JFMAMJJASOND".split("").map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-2xl">
      <h3 className="font-bold text-gray-900 mb-5">Property Settings</h3>
      <div className="space-y-4">
        {["Property name", "Contact email", "Cancellation window"].map((label, i) => (
          <div key={label}>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">{label}</label>
            <input
              defaultValue={["Serena Hotel Nairobi", "ops@yzbooking.com", "48 hours"][i]}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0071c2] transition-colors"
            />
          </div>
        ))}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-400">Instant booking</span>
          <div className="w-11 h-6 rounded-full bg-[#0071c2] relative cursor-pointer">
            <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow" />
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          setSaved(true);
          window.setTimeout(() => setSaved(false), 2500);
        }}
        className="mt-6 bg-[#003580] hover:bg-[#002a66] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
      >
        {saved ? "Saved ✓" : "Save Changes"}
      </button>
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

function BookingModal({
  hotel,
  guests,
  nights,
  onClose,
}: {
  hotel: (typeof hotels)[0];
  guests: number;
  nights: number;
  onClose: () => void;
}) {
  const total = hotel.price * nights;
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
        className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
      >
        <div className="relative h-36">
          <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
          <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5" /> {hotel.location}
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Dates</span>
              <span className="text-gray-900 font-medium">Sep 1 – Sep 7 ({nights} nights)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Guests</span>
              <span className="text-gray-900 font-medium">{guests} adult{guests > 1 ? "s" : ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">${hotel.price} × {nights} nights</span>
              <span className="text-gray-900 font-medium">${total}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-900 font-bold">Total</span>
              <span className="text-gray-900 font-bold">${total}</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-700">
              Free cancellation until Aug 30. No prepayment needed — pay at the property.
            </p>
          </div>

          <button className="w-full mt-4 bg-[#0071c2] hover:bg-[#005fa3] text-white py-3 rounded-xl font-semibold transition-colors">
            Confirm Reservation
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DemoWebapp() {
  useSEO({
    title: "Booking Platform Demo — Interactive Prototype",
    description:
      "An interactive preview of a booking and dashboard platform built by Yasir Zayed: search, availability, checkout and operations dashboards.",
    path: "/demo/webapp",
    noindex: true,
  });
  const [view, setView] = useState<"portal" | "app">("portal");
  const [search, setSearch] = useState("");
  const [guests, setGuests] = useState(2);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [booking, setBooking] = useState<(typeof hotels)[0] | null>(null);

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
            <BookingHero search={search} onSearch={setSearch} guests={guests} onGuests={setGuests} />
            <DestinationScroller />
            <HotelListings search={search} guests={guests} onBook={setBooking} />
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
            <AppSidebar activeTab={activeTab} onTab={setActiveTab} />
            <div className="flex-1 overflow-auto">
              {activeTab === "dashboard" ? <DashboardContent /> : (
                <div className="bg-[#f8f9fa] p-6 min-h-full">
                  <h2 className="text-xl font-bold text-gray-900 capitalize mb-5">
                    {activeTab}
                  </h2>
                  {activeTab === "bookings" && <BookingsPanel />}
                  {activeTab === "properties" && <PropertiesPanel />}
                  {activeTab === "messages" && <MessagesPanel />}
                  {activeTab === "analytics" && <AnalyticsPanel />}
                  {activeTab === "settings" && <SettingsPanel />}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking confirmation modal */}
      <AnimatePresence>
        {booking && (
          <BookingModal
            hotel={booking}
            guests={guests}
            nights={6}
            onClose={() => setBooking(null)}
          />
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
