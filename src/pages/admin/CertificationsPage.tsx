import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Save, Upload, Award, Link, Image, Eye, EyeOff } from 'lucide-react';
import { api, API_URL } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface Certification { id: number; titleId: string; titleEn: string; issuerId: string; issuerEn: string; dateId: string; dateEn: string; imageUrl: string | null; credentialUrl: string | null; order: number; isVisible: boolean; }
const emptyForm = { titleId: '', titleEn: '', issuerId: '', issuerEn: '', dateId: '', dateEn: '', credentialUrl: '', order: 0 };

export default function CertificationsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formLanguage, setFormLanguage] = useState<'id'|'en'>('id');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const data = await api.getCertifications();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setImagePreview(null); setRemoveImage(false); setModalOpen(true); };
  const openEdit = (item: Certification) => {
    setEditing(item);
    setForm({ titleId: item.titleId, titleEn: item.titleEn, issuerId: item.issuerId, issuerEn: item.issuerEn, dateId: item.dateId, dateEn: item.dateEn, credentialUrl: item.credentialUrl || '', order: item.order });
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
        await api.updateCertification(editing.id, fd, token!);
      } else {
        await api.createCertification(fd, token!);
      }
      await fetchData();
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteCertification(id, token!);
    setDeleteId(null);
    await fetchData();
  };

  const handleToggleVisibility = async (item: Certification) => {
    const fd = new FormData();
    fd.append('isVisible', (!item.isVisible).toString());
    await api.updateCertification(item.id, fd, token!);
    await fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Certifications</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola sertifikat dan pencapaian Anda.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground text-sm font-semibold transition-all hover:scale-[1.02]">
          <Plus className="w-4 h-4" /> Tambah Sertifikat
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Memuat data...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-muted border border-dashed border-border rounded-2xl">
          <div className="text-4xl mb-3">🏅</div>
          <p className="text-muted-foreground text-sm">Belum ada sertifikat. Tambahkan yang pertama!</p>
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
                    <Award className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-foreground font-semibold mb-1 truncate">{item.titleId}</h3>
                <p className="text-indigo-400/70 text-sm mb-1">{item.issuerId}</p>
                <p className="text-muted-foreground text-xs mb-3">{item.dateId}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <div className="flex-1 min-w-0">
                    {item.credentialUrl && (
                      <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-amber-400 transition-colors flex items-center gap-1.5 text-xs">
                        <Link className="w-3 h-3" /> Lihat Kredensial
                      </a>
                    )}
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
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl my-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-foreground font-semibold">{editing ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">Foto Sertifikat</label>
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
                      <p className="text-muted-foreground text-xs">Klik untuk upload foto sertifikat</p>
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
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Nama Sertifikat (ID)</label>
                    <input type="text" value={form.titleId} onChange={e => setForm(p => ({ ...p, titleId: e.target.value }))} placeholder="Oracle Database Design" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Penerbit / Deskripsi (ID)</label>
                    <input type="text" value={form.issuerId} onChange={e => setForm(p => ({ ...p, issuerId: e.target.value }))} placeholder="Desain Basis Data" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Tanggal (ID)</label>
                    <input type="text" value={form.dateId} onChange={e => setForm(p => ({ ...p, dateId: e.target.value }))} placeholder="Mei 2026" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Certificate Name (EN)</label>
                    <input type="text" value={form.titleEn} onChange={e => setForm(p => ({ ...p, titleEn: e.target.value }))} placeholder="Oracle Database Design" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Issuer / Description (EN)</label>
                    <input type="text" value={form.issuerEn} onChange={e => setForm(p => ({ ...p, issuerEn: e.target.value }))} placeholder="Database Design" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Date (EN)</label>
                    <input type="text" value={form.dateEn} onChange={e => setForm(p => ({ ...p, dateEn: e.target.value }))} placeholder="May 2026" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Link Kredensial</label>
                <input type="url" value={form.credentialUrl} onChange={e => setForm(p => ({ ...p, credentialUrl: e.target.value }))} placeholder="https://..." className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
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
            <h3 className="text-foreground font-semibold mb-2">Hapus Sertifikat?</h3>
            <p className="text-muted-foreground text-sm mb-6">Gambar dan data sertifikat akan dihapus permanen.</p>
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
