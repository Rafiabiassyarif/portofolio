import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Save, Upload, Briefcase, Eye, EyeOff, Sparkles } from 'lucide-react';
import { api, API_URL } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { autoTranslateDate } from '../../utils/bilingualHelper';
import { PeriodDatePicker } from '../../components/admin/PeriodDatePicker';

interface Experience {
  id: number;
  roleId: string;
  roleEn: string;
  company: string;
  durationId: string;
  durationEn: string;
  descriptionId: string;
  descriptionEn: string;
  imageUrl: string | null;
  order: number;
  isVisible: boolean;
}

const emptyForm = {
  roleId: '',
  roleEn: '',
  company: '',
  durationId: '',
  durationEn: '',
  descriptionId: '',
  descriptionEn: '',
  order: 0,
};

export default function ExperiencesPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const data = await api.getExperiences();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { 
    setEditing(null); setForm(emptyForm); 
    setFile(null); setImagePreview(null); setRemoveImage(false);
    setModalOpen(true); 
  };
  const openEdit = (item: Experience) => { 
    setEditing(item); 
    setForm({ roleId: item.roleId, roleEn: item.roleEn, company: item.company, durationId: item.durationId, durationEn: item.durationEn, descriptionId: item.descriptionId, descriptionEn: item.descriptionEn, order: item.order }); 
    setFile(null); setImagePreview(item.imageUrl ? `${API_URL}${item.imageUrl}` : null); setRemoveImage(false);
    setModalOpen(true); 
  };

  const handleIdChange = (field: 'roleId' | 'durationId' | 'descriptionId', value: string) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'roleId') {
        if (!prev.roleEn || prev.roleEn === prev.roleId) updated.roleEn = value;
      } else if (field === 'durationId') {
        if (!prev.durationEn || prev.durationEn === prev.durationId || prev.durationEn === autoTranslateDate(prev.durationId)) {
          updated.durationEn = autoTranslateDate(value);
        }
      } else if (field === 'descriptionId') {
        if (!prev.descriptionEn || prev.descriptionEn === prev.descriptionId) updated.descriptionEn = value;
      }
      return updated;
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        roleId: form.roleId?.trim() || form.roleEn?.trim() || '',
        roleEn: form.roleEn?.trim() || form.roleId?.trim() || '',
        durationId: form.durationId?.trim() || form.durationEn?.trim() || '',
        durationEn: form.durationEn?.trim() || autoTranslateDate(form.durationId) || form.durationId?.trim() || '',
        descriptionId: form.descriptionId?.trim() || form.descriptionEn?.trim() || '',
        descriptionEn: form.descriptionEn?.trim() || form.descriptionId?.trim() || '',
      };
      const formData = new FormData();
      Object.entries(payload).forEach(([key, val]) => formData.append(key, String(val)));
      if (file) formData.append('image', file);
      if (removeImage) formData.append('removeImage', 'true');

      if (editing) {
        await api.updateExperience(editing.id, formData as any, token!);
      } else {
        await api.createExperience(formData as any, token!);
      }
      await fetchData();
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteExperience(id, token!);
    setDeleteId(null);
    await fetchData();
  };

  const handleToggleVisibility = async (item: Experience) => {
    const fd = new FormData();
    fd.append('isVisible', (!item.isVisible).toString());
    await api.updateExperience(item.id, fd as any, token!);
    await fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Experience</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola riwayat pengalaman kerja Anda.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground text-sm font-semibold transition-all hover:scale-[1.02]">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Memuat data...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-muted border border-dashed border-border rounded-2xl">
          <div className="text-4xl mb-3">💼</div>
          <p className="text-muted-foreground text-sm">Belum ada data experience. Tambahkan yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className={`bg-card border ${item.isVisible ? 'border-border' : 'border-dashed border-border opacity-50'} rounded-2xl p-5 transition-all group`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-semibold text-base truncate">{item.roleId} / {item.roleEn}</h3>
                  <p className="text-indigo-400/80 text-sm">{item.company}</p>
                  <p className="text-muted-foreground text-xs mt-1">{item.durationId}</p>
                  {item.descriptionId && <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{item.descriptionId}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleToggleVisibility(item)} className="p-2 rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                    {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
              <h2 className="text-foreground font-semibold">{editing ? 'Edit Experience' : 'Tambah Experience'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-muted-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Image Upload */}
              <div>
                <label className="text-xs text-muted-foreground uppercase block mb-1.5">Foto Perusahaan / Logo</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative aspect-video rounded-xl border-2 border-dashed border-border hover:border-indigo-500/40 overflow-hidden cursor-pointer bg-muted transition-colors group/img flex items-center justify-center"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full group/preview">
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-foreground text-xs rounded-lg transition-colors">
                          Hapus Foto
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-6 h-6 text-white/20 mx-auto mb-2 group-hover/img:text-indigo-400 transition-colors" />
                      <p className="text-muted-foreground text-xs">Klik untuk upload foto</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5 font-semibold">Nama Perusahaan</label>
                  <input type="text" value={form.company as string} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="PT. Contoh Indonesia" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                </div>
                
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5 font-semibold">Posisi</label>
                  <input type="text" value={form.roleId} onChange={e => handleIdChange('roleId', e.target.value)} placeholder="Pengembang Frontend" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" />
                </div>
                <div className="col-span-2">
                  <PeriodDatePicker
                    label="Periode"
                    valueId={form.durationId}
                    valueEn={form.durationEn}
                    onChange={(idVal, enVal) => {
                      setForm(p => ({ ...p, durationId: idVal, durationEn: enVal }));
                    }}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5 font-semibold">Deskripsi</label>
                  <textarea value={form.descriptionId} onChange={e => handleIdChange('descriptionId', e.target.value)} placeholder="Tanggung jawab dan pencapaian..." rows={4} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none" />
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

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="text-foreground font-semibold mb-2">Hapus Experience?</h3>
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
