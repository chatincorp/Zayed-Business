import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Star, Trash2, Edit3, ToggleLeft, ToggleRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  quote: string;
  rating: number;
  featured: boolean;
  avatar: string;
}

const mockTestimonials: Testimonial[] = [
  { id: "1", name: "James Mwangi", role: "CTO", company: null, quote: "Yasir Zayed transformed our digital presence. The AI chatbot alone reduced support tickets by 60%.", rating: 5, featured: true, avatar: "JM" },
  { id: "2", name: "Sarah Williams", role: "Director", company: null, quote: "Professional, strategic, and results-driven. They delivered a website that actually converts.", rating: 5, featured: true, avatar: "SW" },
  { id: "3", name: "Ahmed Hassan", role: "CEO", company: null, quote: "The digital transformation roadmap they built was exactly what we needed to scale across the region.", rating: 4, featured: false, avatar: "AH" },
  { id: "4", name: "Priya Patel", role: "Operations Lead", company: null, quote: "Workflow automation saved us 200+ hours per month. Incredible ROI.", rating: 5, featured: false, avatar: "PP" },
];

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newQuote, setNewQuote] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [editId, setEditId] = useState<string | null>(null);

  const toggleFeatured = (id: string) => setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t)));
  const deleteTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id));

  const handleCreate = () => {
    if (!newName.trim() || !newQuote.trim()) return;
    setTestimonials((prev) => [...prev, { id: Date.now().toString(), name: newName, role: newRole, company: null, quote: newQuote, rating: newRating, featured: false, avatar: newName.split(" ").map((n) => n[0]).join("") }]);
    setNewName(""); setNewRole(""); setNewQuote(""); setNewRating(5);
    setShowCreate(false);
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border bg-background text-sm";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground text-sm mt-1">{testimonials.length} testimonials · {testimonials.filter((t) => t.featured).length} featured</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
          <Plus className="w-4 h-4" /> New Testimonial
        </button>
      </div>

      {showCreate && (
        <div className="p-5 rounded-xl bg-card border border-border mb-6 space-y-4">
          <h3 className="font-semibold text-sm">Add Testimonial</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} />
            <input placeholder="Role" value={newRole} onChange={(e) => setNewRole(e.target.value)} className={inputClass} />
          </div>
          <textarea placeholder="Testimonial quote…" value={newQuote} onChange={(e) => setNewQuote(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => <button key={s} onClick={() => setNewRating(s)}><Star className={`w-4 h-4 ${s <= newRating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} /></button>)}
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreate} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Create</button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className={`p-5 rounded-xl bg-card border transition-all ${t.featured ? "border-electric/30" : "border-border"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-electric/10 flex items-center justify-center text-electric text-xs font-bold">{t.avatar}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
              </div>
            </div>
            <p className="text-sm text-foreground/80 italic mb-3">"{t.quote}"</p>
            <div className="flex items-center justify-between">
              <button onClick={() => toggleFeatured(t.id)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t.featured ? <><ToggleRight className="w-4 h-4 text-electric" /> Featured</> : <><ToggleLeft className="w-4 h-4" /> Not Featured</>}
              </button>
              <div className="flex gap-1">
                <button onClick={() => setEditId(editId === t.id ? null : t.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteTestimonial(t.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
