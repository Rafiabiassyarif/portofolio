import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface Skill { id: number; name: string; icon: string | null; category: string; order: number; isVisible: boolean; }
const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools', 'Mobile', 'Other'];
const emptyForm = { name: '', icon: '', category: 'Frontend', order: 0 };

const categoryColors: Record<string, string> = {
  Frontend: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Backend: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Database: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Tools: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Mobile: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Other: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function SkillsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = async () => {
    const data = await api.getSkills();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item: Skill) => { setEditing(item); setForm({ name: item.name, icon: item.icon || '', category: item.category, order: item.order }); setModalOpen(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.updateSkill(editing.id, form, token!);
      } else {
        await api.createSkill(form, token!);
      }
      await fetchData();
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteSkill(id, token!);
    setDeleteId(null);
    await fetchData();
  };

  const handleToggleVisibility = async (item: Skill) => {
    await api.updateSkill(item.id, { isVisible: !item.isVisible }, token!);
    await fetchData();
  };

  // Group by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter(s => s.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Skills</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola daftar keahlian teknis Anda.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground text-sm font-semibold transition-all hover:scale-[1.02]">
          <Plus className="w-4 h-4" /> Tambah Skill
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Memuat data...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-muted border border-dashed border-border rounded-2xl">
          <div className="text-4xl mb-3">⚡</div>
          <p className="text-muted-foreground text-sm">Belum ada kategori skill. Tambahkan card skill Anda!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((skill) => (
            <div key={skill.id} className={`bg-muted border ${skill.isVisible ? 'border-border' : 'border-dashed border-border opacity-50'} rounded-2xl p-5 flex justify-between items-start group transition-all`}>
              <div>
                <h3 className="text-muted-foreground font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs border ${categoryColors[skill.category] || categoryColors.Other}`}>{skill.category}</span>
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skill.name.split(',').map(s => s.trim()).filter(Boolean).map((s, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-card border border-border text-muted-foreground text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => handleToggleVisibility(skill)} className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors">
                  {skill.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(skill)} className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(skill.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-foreground font-semibold">{editing ? 'Edit Card Skill' : 'Tambah Card Skill'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Nama Skill (Pisahkan dengan koma)</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="HTML, CSS, JavaScript, React.js" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Kategori</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-[#141E2F] border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-indigo-500/50 transition-all">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Icon (nama ikon Lucide, opsional)</label>
                <input type="text" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="Code2" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:text-muted-foreground hover:bg-muted transition-all">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground text-sm font-semibold transition-all flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="text-foreground font-semibold mb-2">Hapus Skill?</h3>
            <p className="text-muted-foreground text-sm mb-6">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:text-muted-foreground transition-all">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-foreground text-sm font-semibold transition-all">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
