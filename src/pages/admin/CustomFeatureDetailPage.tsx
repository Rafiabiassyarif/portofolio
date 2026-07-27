import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Save, ArrowLeft } from 'lucide-react';
import { api, API_URL } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface CustomSectionItem {
  id: string;
  titleId: string;
  titleEn: string;
  subtitleId: string;
  subtitleEn: string;
  descId: string;
  descEn: string;
  icon?: string;
  imageUrl?: string;
  linkUrl?: string;
}

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

const emptyForm: CustomSectionItem = {
  id: '',
  titleId: '',
  titleEn: '',
  subtitleId: '',
  subtitleEn: '',
  descId: '',
  descEn: '',
  icon: '',
  imageUrl: '',
  linkUrl: '',
};

export default function CustomFeatureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [section, setSection] = useState<CustomSection | null>(null);
  const [items, setItems] = useState<CustomSectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CustomSectionItem | null>(null);
  const [form, setForm] = useState<CustomSectionItem>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [isTextMode, setIsTextMode] = useState(false);
  const [textContentId, setTextContentId] = useState("");
  const [textContentEn, setTextContentEn] = useState("");
  const [textImageUrl, setTextImageUrl] = useState("");
  const [textLinkUrl, setTextLinkUrl] = useState("");
  const [textLinkTextId, setTextLinkTextId] = useState("");
  const [textLinkTextEn, setTextLinkTextEn] = useState("");
  const [uploadingTextImage, setUploadingTextImage] = useState(false);

  const fetchSectionData = async () => {
    try {
      const data = await api.getCustomSections();
      if (Array.isArray(data)) {
        const currentSection = data.find(s => s.id === Number(id));
        if (currentSection) {
          setSection(currentSection);
          
          // Parse JSON items from contentId
          try {
            const parsed = JSON.parse(currentSection.contentId);
            if (Array.isArray(parsed)) {
              setItems(parsed);
              setIsTextMode(false);
            } else if (parsed && typeof parsed === 'object') {
              setItems([]);
              setIsTextMode(true);
              setTextContentId(parsed.textId || "");
              setTextContentEn(parsed.textEn || "");
              setTextImageUrl(parsed.imageUrl || "");
              setTextLinkUrl(parsed.linkUrl || "");
              setTextLinkTextId(parsed.linkTextId || "");
              setTextLinkTextEn(parsed.linkTextEn || "");
            } else {
              setItems([]);
              setIsTextMode(true);
              setTextContentId(currentSection.contentId);
              setTextContentEn(currentSection.contentEn);
            }
          } catch {
            setItems([]);
            setIsTextMode(true);
            setTextContentId(currentSection.contentId);
            setTextContentEn(currentSection.contentEn);
          }
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionData();
  }, [id]);

  const openCreate = () => { 
    setEditing(null); 
    setForm({ ...emptyForm, id: Date.now().toString() }); 
    setModalOpen(true); 
  };
  
  const openEdit = (item: CustomSectionItem) => { 
    setEditing(item); 
    setForm({ ...item }); 
    setModalOpen(true); 
  };

  const saveToServer = async (newItems: CustomSectionItem[]) => {
    if (!section) return;
    const jsonString = JSON.stringify(newItems);
    await api.updateCustomSection(section.id, { 
      contentId: jsonString, 
      contentEn: jsonString 
    }, token!);
    
    // Dispatch event so frontend layout could theoretically know, though not strictly needed here
    window.dispatchEvent(new Event('custom-sections-updated'));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let newItems = [...items];
      if (editing) {
        newItems = newItems.map(item => item.id === editing.id ? form : item);
      } else {
        newItems.push(form);
      }
      
      await saveToServer(newItems);
      setItems(newItems);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    await saveToServer(newItems);
    setItems(newItems);
    setDeleteId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.uploadImage(fd, token!);
      if (res.imageUrl) {
        setForm(p => ({ ...p, imageUrl: res.imageUrl }));
      }
    } catch {
      alert('Gagal mengunggah foto.');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setForm(p => ({ ...p, imageUrl: '' }));
  };

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Memuat data...</div>;
  }

  if (!section) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Section tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{section.titleId}</h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-500/10 text-indigo-400 font-mono tracking-wider uppercase border border-indigo-500/20">
                Custom Feature
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {isTextMode ? 'Edit teks untuk section ini.' : 'Kelola daftar item untuk section ini.'}
            </p>
          </div>
        </div>
        {!isTextMode && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground text-sm font-semibold transition-all hover:scale-[1.02]">
            <Plus className="w-4 h-4" /> Tambah Item
          </button>
        )}
      </div>

      {isTextMode ? (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Teks (Indonesian)</label>
              <textarea
                value={textContentId}
                onChange={(e) => setTextContentId(e.target.value)}
                rows={8}
                placeholder="Masukkan deskripsi teks..."
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:border-indigo-500/50 outline-none transition-all resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Teks (English)</label>
              <textarea
                value={textContentEn}
                onChange={(e) => setTextContentEn(e.target.value)}
                rows={8}
                placeholder="Enter text description..."
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:border-indigo-500/50 outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Link Tautan (Opsional)</label>
              <input
                type="text"
                value={textLinkUrl}
                onChange={(e) => setTextLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Gambar (Opsional)</label>
              <div className="flex items-center gap-3">
                <label className={`cursor-pointer px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground text-sm font-semibold transition-all ${uploadingTextImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {uploadingTextImage ? 'Loading...' : 'Upload Foto'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploadingTextImage} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingTextImage(true);
                    try {
                      const fd = new FormData(); fd.append('image', file);
                      const res = await api.uploadImage(fd, token!);
                      if (res.imageUrl) setTextImageUrl(res.imageUrl);
                    } catch {
                      alert('Gagal mengunggah foto.');
                    } finally {
                      setUploadingTextImage(false);
                    }
                  }} />
                </label>
                {textImageUrl && (
                  <div className="flex items-center gap-2">
                    <img src={textImageUrl.startsWith('http') || textImageUrl.startsWith('data:') ? textImageUrl : `${API_URL}${textImageUrl}`} alt="preview" className="h-12 w-12 rounded-lg object-cover border border-border" />
                    <button type="button" onClick={() => setTextImageUrl('')} className="text-red-400 hover:text-red-300 text-sm">Hapus</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Label Tombol Link (Indonesian)</label>
              <input
                type="text"
                value={textLinkTextId}
                onChange={(e) => setTextLinkTextId(e.target.value)}
                placeholder="Pelajari Lebih Lanjut"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Label Tombol Link (English)</label>
              <input
                type="text"
                value={textLinkTextEn}
                onChange={(e) => setTextLinkTextEn(e.target.value)}
                placeholder="Learn More"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={async () => {
              setSaving(true);
              try {
                const textData = JSON.stringify({
                  textId: textContentId,
                  textEn: textContentEn,
                  imageUrl: textImageUrl,
                  linkUrl: textLinkUrl,
                  linkTextId: textLinkTextId,
                  linkTextEn: textLinkTextEn,
                });
                await api.updateCustomSection(section.id, {
                  contentId: textData,
                  contentEn: textData,
                }, token!);
                window.dispatchEvent(new Event('custom-sections-updated'));
                alert('Teks berhasil disimpan!');
              } catch (e) {
                alert('Gagal menyimpan teks.');
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground font-semibold transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Menyimpan...' : 'Simpan Teks'}
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-muted border border-dashed border-border rounded-2xl">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-muted-foreground text-sm">Belum ada item ditambahkan ke {section.titleId}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-card border border-border rounded-2xl p-5 hover:border-border transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-semibold text-base truncate">{item.titleId} / {item.titleEn}</h3>
                  {(item.subtitleId || item.subtitleEn) && (
                    <p className="text-indigo-400/80 text-sm">{item.subtitleId}</p>
                  )}
                  {item.descId && (
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{item.descId}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
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
              <h2 className="text-foreground font-semibold">{editing ? 'Edit Item' : 'Tambah Item'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-muted-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'titleId', label: 'Judul Utama (ID)', placeholder: 'Contoh Judul' },
                  { key: 'titleEn', label: 'Judul Utama (EN)', placeholder: 'Example Title' },
                  { key: 'subtitleId', label: 'Subjudul (ID - Opsional)', placeholder: 'Keterangan Singkat' },
                  { key: 'subtitleEn', label: 'Subjudul (EN - Opsional)', placeholder: 'Short Info' },
                  { key: 'icon', label: 'Nama Ikon Lucide atau Link URL (Opsional)', placeholder: 'misal: Star, Code, atau https://.../icon.svg' },
                  { key: 'linkUrl', label: 'URL Tautan (Opsional)', placeholder: 'https://...' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className={(key === 'icon' || key === 'linkUrl') ? 'col-span-2' : ''}>
                    <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">{label}</label>
                    <input 
                      type="text" 
                      value={form[key as keyof typeof form] as string} 
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} 
                      placeholder={placeholder} 
                      required={key.startsWith('title')} 
                      className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all" 
                    />
                  </div>
                ))}
                
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Foto (Opsional)</label>
                  <div className="flex items-center gap-4">
                    {form.imageUrl ? (
                      <div className="relative w-24 h-24 rounded-xl border border-border overflow-hidden bg-muted">
                        <img src={`${API_URL}${form.imageUrl}`} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-xl border border-dashed border-border flex items-center justify-center bg-muted text-muted-foreground">
                        No Photo
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-xl text-sm hover:bg-muted/80 transition-colors">
                        {uploadingImage ? 'Mengunggah...' : 'Pilih Foto'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                      </label>
                      <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">Format: JPG, PNG, WEBP</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Deskripsi Panjang (ID)</label>
                  <textarea value={form.descId} onChange={e => setForm(p => ({ ...p, descId: e.target.value }))} placeholder="Isi detail item..." rows={4} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Deskripsi Panjang (EN)</label>
                  <textarea value={form.descEn} onChange={e => setForm(p => ({ ...p, descEn: e.target.value }))} placeholder="Item details..." rows={4} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-border mt-4 pt-4">
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
            <h3 className="text-foreground font-semibold mb-2">Hapus Item?</h3>
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
