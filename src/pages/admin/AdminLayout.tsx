import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Code2, Award, FolderKanban, User, LogOut, Menu, X, ChevronRight, Globe, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/xadmin/panel/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/xadmin/panel/hero', icon: User, label: 'Hero & Profil' },
  { to: '/xadmin/panel/experiences', icon: Briefcase, label: 'Experience' },
  { to: '/xadmin/panel/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/xadmin/panel/skills', icon: Code2, label: 'Skills' },
  { to: '/xadmin/panel/certifications', icon: Award, label: 'Certifications' },
  { to: '/xadmin/panel/custom-sections', icon: Menu, label: 'Custom Sections' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [customSections, setCustomSections] = useState<any[]>([]);
  const { theme, toggleTheme } = useTheme();

  const fetchSections = () => {
    api.getCustomSections().then(data => {
      if (Array.isArray(data)) setCustomSections(data);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchSections();
    window.addEventListener('custom-sections-updated', fetchSections);
    return () => window.removeEventListener('custom-sections-updated', fetchSections);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/xadmin');
  };

  return (
    <div className="admin-cursor min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-foreground font-bold text-sm">Portfolio CMS</span>
              <div className="text-muted-foreground text-xs">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/xadmin/panel/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    : 'text-muted-foreground hover:text-muted-foreground hover:bg-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-muted-foreground group-hover:text-muted-foreground'}`} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400/60" />}
                </>
              )}
            </NavLink>
          ))}

          {/* Dynamic Custom Sections */}
          {customSections.length > 0 && (
            <div className="pt-4 mt-2 border-t border-border">
              <div className="px-4 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Custom Features
              </div>
              {customSections.map((section) => {
                const isSectionActive = location.pathname === `/xadmin/panel/c/${section.id}`;
                return (
                  <NavLink
                    key={section.id}
                    to={`/xadmin/panel/c/${section.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isSectionActive
                        ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                        : 'text-muted-foreground hover:text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <FileText className={`w-4 h-4 flex-shrink-0 ${isSectionActive ? 'text-indigo-400' : 'text-muted-foreground group-hover:text-muted-foreground'}`} />
                    <span className="flex-1">{section.titleId}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.07] transition-all group"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1" />

          <button onClick={toggleTheme} className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 hover:border-indigo-500/30 transition-all text-xs font-semibold shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Kunjungi Web</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
