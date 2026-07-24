import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Save, Upload, Github, ExternalLink, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { api, API_URL } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface Project { id: number; titleId: string; titleEn: string; descriptionId: string; descriptionEn: string; imageUrl: string | null; githubUrl: string | null; demoUrl: string | null; tags: string | null; backgroundColor: string | null; order: number; isVisible: boolean; }
const emptyForm = { titleId: '', titleEn: '', descriptionId: '', descriptionEn: '', githubUrl: '', demoUrl: '', tags: '', backgroundColor: '#1a1a1a', order: 0 };

export default function ProjectsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formLanguage, setFormLanguage] = useState<'id'|'en'>('id');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const data = await api.getProjects();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setImagePreview(null); setRemoveImage(false); setModalOpen(true); };
  const openEdit = (item: Project) => {
    setEditing(item);
    setForm({ titleId: item.titleId, titleEn: item.titleEn, descriptionId: item.descriptionId, descriptionEn: item.descriptionEn, githubUrl: item.githubUrl || '', demoUrl: item.demoUrl || '', tags: item.tags || '', backgroundColor: item.backgroundColor || '#1a1a1a', order: item.order });
    setImageFile(null);
    setImagePreview(item.imageUrl ? `${API_URL}${item.imageUrl}` : null);
    setRemoveImage(false);
    setModalOpen(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imageFile) fd.append('image', imageFile);
      if (removeImage) fd.append('removeImage', 'true');
      if (editing) {
        await api.updateProject(editing.id, fd, token!);
      } else {
        await api.createProject(fd, token!);
      }
      await fetchData();
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteProject(id, token!);
    setDeleteId(null);
    await fetchData();
  };

  const handleToggleVisibility = async (item: Project) => {
    const fd = new FormData();
    fd.append('isVisible', (!item.isVisible).toString());
    await api.updateProject(item.id, fd, token!);
    await fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola semua project portofolio Anda.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground text-sm font-semibold transition-all hover:scale-[1.02]">
          <Plus className="w-4 h-4" /> Tambah Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Memuat data...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-muted border border-dashed border-border rounded-2xl">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-muted-foreground text-sm">Belum ada project. Tambahkan yang pertama!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className={`bg-card border ${item.isVisible ? 'border-border' : 'border-dashed border-border opacity-50'} rounded-2xl overflow-hidden transition-all group`}>
              {/* Image */}
              <div className="aspect-video bg-card relative overflow-hidden">
                {item.imageUrl ? (
                  <img src={`${API_URL}${item.imageUrl}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white/15" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-foreground font-semibold mb-1 truncate">{item.titleId}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{item.descriptionId}</p>
                {item.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.split(',').map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-muted border border-border text-muted-foreground">{tag.trim()}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {item.githubUrl && <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-muted-foreground transition-colors"><Github className="w-4 h-4" /></a>}
                    {item.demoUrl && <a href={item.demoUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-muted-foreground transition-colors"><ExternalLink className="w-4 h-4" /></a>}
                  </div>
                  <button onClick={() => handleToggleVisibility(item)} className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                    {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl my-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-foreground font-semibold">{editing ? 'Edit Project' : 'Tambah Project Baru'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">Gambar Project</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative aspect-video rounded-xl border-2 border-dashed border-border hover:border-indigo-500/40 overflow-hidden cursor-pointer bg-muted transition-colors group/img flex items-center justify-center"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full group/preview">
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-foreground text-xs rounded-lg transition-colors">
                          Hapus Gambar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-white/20 mx-auto mb-2 group-hover/img:text-indigo-400 transition-colors" />
                      <p className="text-muted-foreground text-xs">Klik untuk upload gambar</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </div>

              {/* Language Toggle */}
              <div className="flex bg-muted p-1 rounded-xl w-fit border border-border">
                <button
                  type="button"
                  onClick={() => setFormLanguage('id')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${formLanguage === 'id' ? 'bg-indigo-600 text-foreground' : 'text-muted-foreground hover:text-muted-foreground'}`}
                >
                  Indonesian (ID)
                </button>
                <button
                  type="button"
                  onClick={() => setFormLanguage('en')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${formLanguage === 'en' ? 'bg-indigo-600 text-foreground' : 'text-muted-foreground hover:text-muted-foreground'}`}
                >
                  English (EN)
                </button>
              </div>

              {formLanguage === 'id' ? (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Judul Project (ID)</label>
                    <input type="text" value={form.titleId} onChange={e => setForm(p => ({ ...p, titleId: e.target.value }))} placeholder="KroomBridge" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Deskripsi (ID)</label>
                    <textarea value={form.descriptionId} onChange={e => setForm(p => ({ ...p, descriptionId: e.target.value }))} placeholder="Deskripsi singkat dalam Bahasa Indonesia..." rows={3} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Project Title (EN)</label>
                    <input type="text" value={form.titleEn} onChange={e => setForm(p => ({ ...p, titleEn: e.target.value }))} placeholder="KroomBridge" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Description (EN)</label>
                    <textarea value={form.descriptionEn} onChange={e => setForm(p => ({ ...p, descriptionEn: e.target.value }))} placeholder="Short description in English..." rows={3} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none" />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Link GitHub</label>
                  <input type="url" value={form.githubUrl} onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..." className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Link Demo</label>
                  <input type="url" value={form.demoUrl} onChange={e => setForm(p => ({ ...p, demoUrl: e.target.value }))} placeholder="https://..." className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Tags (pisahkan dengan koma)</label>
                <input type="text" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="React.js, Node.js, MySQL" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Warna Background (Untuk Animasi Stack)</label>
                <div className="flex gap-4 items-center">
                  <input type="color" value={form.backgroundColor} onChange={e => setForm(p => ({ ...p, backgroundColor: e.target.value }))} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <input type="text" value={form.backgroundColor} onChange={e => setForm(p => ({ ...p, backgroundColor: e.target.value }))} placeholder="#1a1a1a" className="flex-1 bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all uppercase" />
                </div>
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
            <h3 className="text-foreground font-semibold mb-2">Hapus Project?</h3>
            <p className="text-muted-foreground text-sm mb-6">Gambar dan data project akan dihapus permanen.</p>
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
