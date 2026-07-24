import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Pastikan form selalu ada di layar meski di-scroll
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(form);
      if (res.token) {
        login(res.token);
        navigate('/xadmin/panel/dashboard');
      } else {
        setError(res.message || 'Login gagal. Cek kembali kredensial Anda.');
      }
    } catch {
      setError('Gagal terhubung ke server. Pastikan backend aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md mx-4 bg-muted backdrop-blur-2xl border border-border rounded-[2rem] p-8 md:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs text-muted-foreground mb-4 font-medium tracking-widest uppercase">
            <span>✦</span> Admin Portal
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Selamat Datang</h1>
          <p className="text-slate-400 text-sm">Akses terbatas hanya untuk pengelola portofolio.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-foreground text-sm focus:outline-none focus:border-blue-500/50 focus:bg-muted transition-all"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full bg-card border border-border rounded-xl pl-4 pr-12 py-3.5 text-foreground text-sm focus:outline-none focus:border-blue-500/50 focus:bg-muted transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground transition-colors p-1 cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-foreground font-semibold py-4 rounded-xl shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_10px_25px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Shield className="w-5 h-5" />
            )}
            {loading ? 'Memverifikasi...' : 'Otorisasi Akses'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-8 font-medium">
          © {new Date().getFullYear()} Protected System.
        </p>
      </div>
    </div>
  );
}
