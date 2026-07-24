import React, { useEffect, useState } from 'react';
import { Users, FolderKanban, Briefcase, Award, Code2, TrendingUp, ArrowRight, LayoutTemplate } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { api } from '../../lib/api';

const StatCard = ({ icon: Icon, label, value, color, to }: any) => (
  <NavLink to={to} className="block">
    <div className={`bg-card border border-border rounded-2xl p-6 hover:border-border hover:bg-card transition-all duration-300 group cursor-pointer`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all" />
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  </NavLink>
);

export default function DashboardPage() {
  const [counts, setCounts] = useState({ projects: 0, experiences: 0, skills: 0, certifications: 0, customSections: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [projects, experiences, skills, certifications, customSections] = await Promise.all([
          api.getProjects(),
          api.getExperiences(),
          api.getSkills(),
          api.getCertifications(),
          api.getCustomSections(),
        ]);
        setCounts({
          projects: Array.isArray(projects) ? projects.length : 0,
          experiences: Array.isArray(experiences) ? experiences.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          certifications: Array.isArray(certifications) ? certifications.length : 0,
          customSections: Array.isArray(customSections) ? customSections.length : 0,
        });
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const stats = [
    { icon: FolderKanban, label: 'Total Projects', value: loading ? '...' : counts.projects, color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20', to: '/xadmin/panel/projects' },
    { icon: Briefcase, label: 'Pengalaman Kerja', value: loading ? '...' : counts.experiences, color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', to: '/xadmin/panel/experiences' },
    { icon: Code2, label: 'Total Skills', value: loading ? '...' : counts.skills, color: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20', to: '/xadmin/panel/skills' },
    { icon: Award, label: 'Sertifikasi', value: loading ? '...' : counts.certifications, color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', to: '/xadmin/panel/certifications' },
    { icon: LayoutTemplate, label: 'Custom Sections', value: loading ? '...' : counts.customSections, color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', to: '/xadmin/panel/custom-sections' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Selamat datang! Kelola semua konten portofolio Anda dari sini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick Guide */}
      <div className="bg-muted border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h2 className="text-foreground font-semibold">Panduan Cepat</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { label: '1. Custom Sections', desc: 'Buat bagian konten tak terbatas sesuai kebutuhan web Anda secara kustom', icon: '🧩' },
            { label: '2. Hero & Profil', desc: 'Perbarui teks utama, nama, tautan sosial, dan foto profil', icon: '🧑' },
            { label: '3. Projects', desc: 'Tambah, edit, atau hapus project beserta gambar dan link-nya', icon: '📁' },
            { label: '4. Certifications', desc: 'Kelola sertifikat dengan upload foto sertifikat langsung', icon: '🏅' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-muted border border-border">
              <span className="text-xl mt-0.5">{item.icon}</span>
              <div>
                <div className="text-muted-foreground text-sm font-semibold">{item.label}</div>
                <div className="text-muted-foreground text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
