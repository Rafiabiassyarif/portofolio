import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, User, Link as LinkIcon } from 'lucide-react';
import { api, API_URL } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function HeroPage() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    greetingId: 'Halo, saya',
    greetingEn: 'Hi there, I am',
    name: '',
    titleId: '',
    titleEn: '',
    descriptionId: '',
    descriptionEn: '',
    resumeUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    githubUrl: ''
  });
  const [formLanguage, setFormLanguage] = useState<'id'|'en'>('id');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [removeProfileImg, setRemoveProfileImg] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getHero().then(data => {
      if (data && !data.message) {
        setForm({
          greetingId: data.greetingId || 'Halo, saya',
          greetingEn: data.greetingEn || 'Hi there, I am',
          name: data.name || '',
          titleId: data.titleId || '',
          titleEn: data.titleEn || '',
          descriptionId: data.descriptionId || '',
          descriptionEn: data.descriptionEn || '',
          resumeUrl: data.resumeUrl || '',
          instagramUrl: data.instagramUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          githubUrl: data.githubUrl || '',
        });
        setCurrentImage(data.profileImgUrl ? `${API_URL}${data.profileImgUrl}` : null);
      }
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveProfileImg(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setCurrentImage(null);
    setRemoveProfileImg(true);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imageFile) fd.append('profileImg', imageFile);
      if (removeProfileImg) fd.append('removeProfileImg', 'true');
      const res = await api.updateHero(fd, token!);
      if (res.id) {
        setSuccess('Data hero berhasil disimpan!');
        setCurrentImage(res.profileImgUrl ? `${API_URL}${res.profileImgUrl}` : currentImage);
        setImageFile(null);
        setImagePreview(null);
      } else {
        setError(res.message || 'Gagal menyimpan.');
      }
    } catch {
      setError('Terjadi kesalahan. Pastikan backend berjalan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hero & Profil</h1>
        <p className="text-muted-foreground text-sm mt-1">Edit teks utama dan foto profil di halaman depan portofolio.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-6">
        {/* Profile Image */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-3">Foto Profil</label>
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted flex-shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : currentImage ? (
                <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white/20" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-muted-foreground text-sm hover:bg-muted hover:text-foreground transition-all"
                >
                  <Upload className="w-4 h-4" />
                  {imageFile ? imageFile.name : 'Upload Foto Baru'}
                </button>
                {(imagePreview || currentImage) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-all"
                  >
                    Hapus
                  </button>
                )}
              </div>
              <p className="text-white/25 text-xs mt-2">Format: JPG, PNG, WEBP · Maks 5MB</p>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Rafi Abi Assyarif"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          <div className="md:col-span-2">
            {/* Language Toggle */}
            <div className="flex bg-muted p-1 rounded-xl w-fit border border-border mb-2">
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
          </div>

          {formLanguage === 'id' ? (
            <>
              <div className="md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Kalimat Pembuka (ID)</label>
                <input
                  type="text"
                  value={form.greetingId}
                  onChange={e => setForm(p => ({ ...p, greetingId: e.target.value }))}
                  placeholder="Halo, saya"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Jabatan (ID)</label>
                <input
                  type="text"
                  value={form.titleId}
                  onChange={e => setForm(p => ({ ...p, titleId: e.target.value }))}
                  placeholder="Pengembang Fullstack"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Deskripsi (ID)</label>
                <textarea
                  value={form.descriptionId}
                  onChange={e => setForm(p => ({ ...p, descriptionId: e.target.value }))}
                  placeholder="Tulis deskripsi singkat dalam Bahasa Indonesia..."
                  rows={4}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                />
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Greeting (EN)</label>
                <input
                  type="text"
                  value={form.greetingEn}
                  onChange={e => setForm(p => ({ ...p, greetingEn: e.target.value }))}
                  placeholder="Hi there, I am"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Title (EN)</label>
                <input
                  type="text"
                  value={form.titleEn}
                  onChange={e => setForm(p => ({ ...p, titleEn: e.target.value }))}
                  placeholder="Fullstack Developer"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Description (EN)</label>
                <textarea
                  value={form.descriptionEn}
                  onChange={e => setForm(p => ({ ...p, descriptionEn: e.target.value }))}
                  placeholder="Write a short description in English..."
                  rows={4}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Link Resume / CV</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                value={form.resumeUrl}
                onChange={e => setForm(p => ({ ...p, resumeUrl: e.target.value }))}
                placeholder="https://drive.google.com/..."
                className="w-full bg-muted border border-border rounded-xl pl-11 pr-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mt-4 mb-3 border-b border-border pb-2">Tautan Media Sosial</h3>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Instagram URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={form.instagramUrl}
                    onChange={e => setForm(p => ({ ...p, instagramUrl: e.target.value }))}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-muted border border-border rounded-xl pl-11 pr-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">LinkedIn URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={form.linkedinUrl}
                    onChange={e => setForm(p => ({ ...p, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-muted border border-border rounded-xl pl-11 pr-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Github URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))}
                    placeholder="https://github.com/..."
                    className="w-full bg-muted border border-border rounded-xl pl-11 pr-4 py-3 text-foreground text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
        {success && <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">✓ {success}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-foreground font-semibold text-sm transition-all hover:scale-[1.02]"
        >
          {saving ? <div className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}
