import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronRight, Trash2, Edit3, GripVertical, Eye, EyeOff } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  visible: boolean;
  order: number;
}

const mockFAQ: FAQItem[] = [
  { id: "1", question: "What services does Yasir Zayed offer?", answer: "We provide business development, web development, AI integration, security solutions, and digital transformation services.", category: "General", visible: true, order: 1 },
  { id: "2", question: "How do I request a quotation?", answer: "You can request a quotation through our contact form, by calling us, or by booking a meeting through the website.", category: "Sales", visible: true, order: 2 },
  { id: "3", question: "Do you work with international clients?", answer: "Yes, we work with clients globally across Africa, Europe, Asia, the Americas, and the Middle East.", category: "General", visible: true, order: 3 },
  { id: "4", question: "What is YASIR VERIFY™?", answer: "YASIR VERIFY™ is our proprietary human verification system that protects against bots and fraudulent activity.", category: "Security", visible: true, order: 4 },
  { id: "5", question: "Can you build custom AI chatbots?", answer: "Yes, we develop AI-powered chatbots tailored to your specific business requirements, customer queries, and operational workflows.", category: "Technology", visible: true, order: 5 },
  { id: "6", question: "What is your pricing model?", answer: "We offer project-based pricing, retainer models, and customized packages depending on the scope and requirements.", category: "Sales", visible: false, order: 6 },
];

const faqCategories = ["All", "General", "Sales", "Technology", "Security", "Support"];

export default function FAQManager() {
  const [items, setItems] = useState(mockFAQ);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [newCat, setNewCat] = useState("General");
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = items.filter((f) => catFilter === "All" || f.category === catFilter);
  const toggleVisible = (id: string) => setItems((prev) => prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)));
  const deleteItem = (id: string) => setItems((prev) => prev.filter((f) => f.id !== id));

  const handleCreate = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setItems((prev) => [...prev, { id: Date.now().toString(), question: newQ, answer: newA, category: newCat, visible: true, order: prev.length + 1 }]);
    setNewQ(""); setNewA(""); setShowCreate(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">FAQ Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} questions · {items.filter((f) => f.visible).length} visible</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors">
          <Plus className="w-4 h-4" /> New FAQ
        </button>
      </div>

      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {faqCategories.map((c) => <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${catFilter === c ? "bg-electric text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{c}</button>)}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4">
            <div className="p-5 rounded-xl bg-card border border-border space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder="Question" value={newQ} onChange={(e) => setNewQ(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm" />
                <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm">
                  {faqCategories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <textarea placeholder="Answer" value={newA} onChange={(e) => setNewA(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none" />
              <div className="flex gap-2">
                <button onClick={handleCreate} className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark">Create</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {filtered.map((faq) => (
          <div key={faq.id} className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}>
              <GripVertical className="w-4 h-4 text-muted-foreground/30 shrink-0" />
              {expandedId === faq.id ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{faq.question}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">{faq.category}</span>
              <button onClick={(e) => { e.stopPropagation(); toggleVisible(faq.id); }} className={`shrink-0 p-1 rounded ${faq.visible ? "text-emerald-500" : "text-muted-foreground"}`}>{faq.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>
              <button onClick={(e) => { e.stopPropagation(); deleteItem(faq.id); }} className="shrink-0 p-1 rounded text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            {expandedId === faq.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-4 pb-4 border-t border-border/50">
                {editId === faq.id ? (
                  <div className="mt-3 space-y-3">
                    <input defaultValue={faq.question} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                    <textarea defaultValue={faq.answer} rows={3} className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => setEditId(null)} className="px-3 py-1.5 bg-electric text-white rounded-lg text-xs font-medium">Save</button>
                      <button onClick={() => setEditId(null)} className="px-3 py-1.5 border rounded-lg text-xs">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-foreground/80 leading-relaxed">{faq.answer}</p>
                    <button onClick={() => setEditId(faq.id)} className="mt-2 text-xs text-electric hover:underline flex items-center gap-1"><Edit3 className="w-3 h-3" /> Edit</button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
