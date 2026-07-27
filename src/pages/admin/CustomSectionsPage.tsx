import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, LayoutGrid, Type } from 'lucide-react';
import { api, API_URL } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface CustomSection {
  id: number;
  slug: string;
  navLabelId: string;
  navLabelEn: string;
  titleId: string;
  titleEn: string;
  contentId: string;
  contentEn: string;
  icon: string | null;
  order: number;
  isVisible: boolean;
}

interface GridItem {
  id: string;
  titleId: string;
  titleEn: string;
  subtitleId: string;
  subtitleEn: string;
  descId: string;
  descEn: string;
  icon: string;
  imageUrl: string;
  linkUrl: string;
}

const emptyForm = {
  slug: '',
  navLabelId: '',
  navLabelEn: '',
  titleId: '',
  titleEn: '',
  contentId: '',
  contentEn: '',
  icon: '',
  order: 0,
  isVisible: true
};

export default function CustomSectionsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<CustomSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CustomSection | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formLanguage, setFormLanguage] = useState<'id'|'en'>('id');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [sectionType, setSectionType] = useState<'text' | 'grid'>('text');
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await api.getCustomSections();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (editId && items.length > 0) {
      const itemToEdit = items.find(item => item.id.toString() === editId);
      if (itemToEdit) {
        openEdit(itemToEdit);
      }
    }
  }, [editId, items]);

  const openCreate = () => { 
    setEditing(null); 
    setForm(emptyForm); 
    setSectionType('text');
    setGridItems([]);
    setModalOpen(true); 
  };

  const openEdit = (item: CustomSection) => {
    setEditing(item);
    setForm({
      slug: item.slug,
      navLabelId: item.navLabelId,
      navLabelEn: item.navLabelEn,
      titleId: item.titleId,
      titleEn: item.titleEn,
      contentId: item.contentId,
      contentEn: item.contentEn,
      icon: item.icon || '',
      order: item.order,
      isVisible: item.isVisible
    });
    
    try {
      const parsed = JSON.parse(item.contentId);
      if (Array.isArray(parsed)) {
        setSectionType('grid');
        setGridItems(parsed);
      } else {
        setSectionType('text');
        setGridItems([]);
      }
    } catch {
      setSectionType('text');
      setGridItems([]);
    }
    
    setModalOpen(true);
  };

  const addGridItem = () => {
    setGridItems(prev => [...prev, {
      id: Date.now().toString(),
      titleId: '', titleEn: '',
      subtitleId: '', subtitleEn: '',
      descId: '', descEn: '',
      icon: '', imageUrl: '', linkUrl: ''
    }]);
  };

  const updateGridItem = (id: string, field: keyof GridItem, value: string) => {
    setGridItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeGridItem = (id: string) => {
    setGridItems(prev => prev.filter(item => item.id !== id));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('image', file);
    setUploadingImage(itemId);
    try {
      const res = await api.uploadImage(fd, token!);
      updateGridItem(itemId, 'imageUrl', res.imageUrl);
    } catch (err) {
      alert('Gagal mengunggah foto');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const dataToSave = { ...form };
    if (sectionType === 'grid') {
      const jsonStr = JSON.stringify(gridItems);
      dataToSave.contentId = jsonStr;
      dataToSave.contentEn = jsonStr;
    }

    try {
      if (editing) {
        await api.updateCustomSection(editing.id, dataToSave, token!);
      } else {
        await api.createCustomSection(dataToSave, token!);
      }
      await fetchData();
      setModalOpen(false);
      window.dispatchEvent(new Event('custom-sections-updated'));
      if (editId) setSearchParams({});
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteCustomSection(id, token!);
    setDeleteId(null);
    await fetchData();
    window.dispatchEvent(new Event('custom-sections-updated'));
  };

  const toggleVisibility = async (item: CustomSection) => {
    await api.updateCustomSection(item.id, { isVisible: !item.isVisible }, token!);
    await fetchData();
    window.dispatchEvent(new Event('custom-sections-updated'));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Custom Sections</h1>
          <p className="text-muted-foreground text-sm mt-1">Buat menu navigasi & konten baru secara bebas.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground text-sm font-semibold transition-all hover:scale-[1.02]">
          <Plus className="w-4 h-4" /> Tambah Bagian
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Memuat data...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 admin-table-container border border-dashed border-border rounded-2xl">
          <div className="text-4xl mb-3">🧩</div>
          <p className="text-muted-foreground text-sm">Belum ada custom section.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className={`admin-table-container p-5 transition-all group ${!item.isVisible ? 'opacity-50 border-dashed' : 'hover:border-border'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-foreground font-semibold text-lg truncate">{item.titleId} / {item.titleEn}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground font-mono tracking-wider uppercase">#{item.slug}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-md text-xs bg-indigo-500/10 text-indigo-400 font-medium">Nav: {item.navLabelId} / {item.navLabelEn}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                    {item.contentId.startsWith('[') ? '[Daftar Kartu Grid]' : (item.contentId.startsWith('{') ? '[Konten Teks & Media]' : item.contentId)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => toggleVisibility(item)} className={`p-2 rounded-lg transition-all ${item.isVisible ? 'text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-muted-foreground hover:text-muted-foreground hover:bg-muted'}`} title={item.isVisible ? 'Sembunyikan' : 'Tampilkan'}>
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
          <div className="admin-form-container border border-border rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
              <h2 className="text-foreground font-semibold">{editing ? 'Edit Section' : 'Tambah Section'}</h2>
              <button type="button" onClick={() => { setModalOpen(false); if (editId) setSearchParams({}); }} className="text-muted-foreground hover:text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col overflow-hidden h-full">
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase block mb-1.5">Slug (Tanpa Spasi)</label>
                    <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value.replace(/\s+/g, '-').toLowerCase() }))} placeholder="misal: layanan-saya" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:border-indigo-500/50 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase block mb-1.5">Icon Judul (Nama Lucide ATAU Link URL, Opsional)</label>
                    <input type="text" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="misal: Star, Code, atau https://.../icon.svg" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:border-indigo-500/50 outline-none transition-all" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between border-b border-border pb-4">
                  {/* Content Type Toggle */}
                  <div className="flex bg-muted p-1 rounded-xl w-fit border border-border">
                    <button
                      type="button"
                      onClick={() => setSectionType('text')}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${sectionType === 'text' ? 'bg-indigo-600 text-foreground' : 'text-muted-foreground hover:text-muted-foreground'}`}
                    >
                      <Type className="w-4 h-4" />
                      Teks Paragraf
                    </button>
                    <button
                      type="button"
                      onClick={() => setSectionType('grid')}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${sectionType === 'grid' ? 'bg-indigo-600 text-foreground' : 'text-muted-foreground hover:text-muted-foreground'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Daftar Kartu (Grid)
                    </button>
                  </div>

                  {/* Language Toggle */}
                  <div className="flex bg-muted p-1 rounded-xl w-fit border border-border">
                    <button
                      type="button"
                      onClick={() => setFormLanguage('id')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${formLanguage === 'id' ? 'bg-indigo-600 text-foreground' : 'text-muted-foreground hover:text-muted-foreground'}`}
                    >
                      Indonesian
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormLanguage('en')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${formLanguage === 'en' ? 'bg-indigo-600 text-foreground' : 'text-muted-foreground hover:text-muted-foreground'}`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Shared Inputs (Nav & Title) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase block mb-1.5">Label Navigasi ({formLanguage.toUpperCase()})</label>
                    <input type="text" value={formLanguage === 'id' ? form.navLabelId : form.navLabelEn} onChange={e => setForm(p => ({ ...p, [formLanguage === 'id' ? 'navLabelId' : 'navLabelEn']: e.target.value }))} placeholder="Layanan" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:border-indigo-500/50 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase block mb-1.5">Judul Section ({formLanguage.toUpperCase()})</label>
                    <input type="text" value={formLanguage === 'id' ? form.titleId : form.titleEn} onChange={e => setForm(p => ({ ...p, [formLanguage === 'id' ? 'titleId' : 'titleEn']: e.target.value }))} placeholder="Layanan Saya" required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:border-indigo-500/50 outline-none transition-all" />
                  </div>
                </div>

                {/* Conditional Content Input */}
                {sectionType === 'text' ? (
                  <div className="bg-muted border border-dashed border-border rounded-xl p-6 text-center">
                    <p className="text-muted-foreground text-sm">
                      Untuk mengedit konten mode <strong>Teks Bebas</strong> beserta foto & link tautan, silakan <strong>simpan bagian ini terlebih dahulu</strong>, lalu buka dari menu <strong className="text-indigo-400">Custom Features</strong> di sidebar sebelah kiri.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-muted-foreground uppercase block">Data Kartu (Grid)</label>
                      <button type="button" onClick={addGridItem} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 text-xs font-semibold transition-colors">
                        <Plus className="w-3 h-3" /> Tambah Kartu
                      </button>
                    </div>
                    
                    {gridItems.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted">
                        <p className="text-muted-foreground text-sm">Belum ada kartu. Klik "Tambah Kartu" untuk mulai.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {gridItems.map((gItem, index) => (
                          <div key={gItem.id} className="p-4 rounded-xl border border-border bg-muted relative group">
                            <button type="button" onClick={() => removeGridItem(gItem.id)} className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <h4 className="text-muted-foreground text-xs font-semibold mb-3">Kartu #{index + 1}</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="text-[10px] text-muted-foreground uppercase block mb-1">Judul ({formLanguage.toUpperCase()})</label>
                                <input type="text" value={formLanguage === 'id' ? gItem.titleId : gItem.titleEn} onChange={e => updateGridItem(gItem.id, formLanguage === 'id' ? 'titleId' : 'titleEn', e.target.value)} required className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-xs focus:border-indigo-500/50 outline-none" />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground uppercase block mb-1">Subjudul ({formLanguage.toUpperCase()})</label>
                                <input type="text" value={formLanguage === 'id' ? gItem.subtitleId : gItem.subtitleEn} onChange={e => updateGridItem(gItem.id, formLanguage === 'id' ? 'subtitleId' : 'subtitleEn', e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-xs focus:border-indigo-500/50 outline-none" />
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <label className="text-[10px] text-muted-foreground uppercase block mb-1">Deskripsi ({formLanguage.toUpperCase()})</label>
                              <textarea value={formLanguage === 'id' ? gItem.descId : gItem.descEn} onChange={e => updateGridItem(gItem.id, formLanguage === 'id' ? 'descId' : 'descEn', e.target.value)} required rows={2} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-xs focus:border-indigo-500/50 outline-none resize-none" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="text-[10px] text-muted-foreground uppercase block mb-1">Link URL Card (Opsional)</label>
                                <input type="text" value={gItem.linkUrl || ''} onChange={e => updateGridItem(gItem.id, 'linkUrl', e.target.value)} placeholder="https://..." className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-xs focus:border-indigo-500/50 outline-none" />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground uppercase block mb-1">Gambar / Foto (Opsional)</label>
                                <div className="flex items-center gap-2 h-[34px]">
                                  <label className={`flex-shrink-0 cursor-pointer flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-foreground px-3 h-full rounded-lg text-xs font-semibold transition-colors ${uploadingImage === gItem.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {uploadingImage === gItem.id ? 'Loading...' : 'Upload Foto'}
                                    <input type="file" accept="image/*" className="hidden" disabled={uploadingImage === gItem.id} onChange={(e) => handleImageUpload(e, gItem.id)} />
                                  </label>
                                  {gItem.imageUrl ? (
                                    <div className="flex items-center gap-2 flex-1">
                                      <div className="h-full w-12 rounded overflow-hidden bg-muted flex-shrink-0 border border-border">
                                        <img src={gItem.imageUrl.startsWith('http') || gItem.imageUrl.startsWith('data:') ? gItem.imageUrl : `${API_URL}${gItem.imageUrl}`} alt="preview" className="w-full h-full object-cover" />
                                      </div>
                                      <button type="button" onClick={() => updateGridItem(gItem.id, 'imageUrl', '')} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-xs truncate">Belum ada foto</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-muted-foreground uppercase block mb-1">Icon Kartu (Nama Lucide ATAU Link URL)</label>
                              <input type="text" value={gItem.icon} onChange={e => updateGridItem(gItem.id, 'icon', e.target.value)} placeholder="misal: Code, Layout, atau https://.../icon.svg" className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-xs focus:border-indigo-500/50 outline-none" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border flex gap-3 flex-shrink-0 bg-card">
                <button type="button" onClick={() => { setModalOpen(false); if (editId) setSearchParams({}); }} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:text-muted-foreground hover:bg-muted transition-all">Batal</button>
                <button type="submit" disabled={saving || (sectionType === 'grid' && gridItems.length === 0)} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? <div className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="admin-form-container border border-border rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="text-foreground font-semibold mb-2">Hapus Section?</h3>
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
