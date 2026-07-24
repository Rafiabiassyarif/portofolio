import { useEffect, useState, Component, lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { CustomCursor } from "./components/CustomCursor";
import { LoadingScreen } from "./components/LoadingScreen";
import { BackgroundElements } from "./components/BackgroundElements";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ContentProvider } from "./context/ContentContext";
import { AuthProvider } from "./context/AuthContext";

// Lazy load all below-the-fold sections
const About = lazy(() => import("./components/About").then(m => ({ default: m.About })));
const Skills = lazy(() => import("./components/Skills").then(m => ({ default: m.Skills })));
const Experience = lazy(() => import("./components/Experience").then(m => ({ default: m.Experience })));
const ProjectsSection = lazy(() => import("./components/ProjectsSection").then(m => ({ default: m.ProjectsSection })));
const CertificationsSection = lazy(() => import("./components/CertificationsSection").then(m => ({ default: m.CertificationsSection })));
const CustomSectionComponent = lazy(() => import("./components/CustomSectionComponent").then(m => ({ default: m.CustomSectionComponent })));
const Contact = lazy(() => import("./components/Contact").then(m => ({ default: m.Contact })));
const Footer = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));

// Lazy load all admin pages
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const ProtectedRoute = lazy(() => import("./pages/admin/ProtectedRoute"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const HeroPage = lazy(() => import("./pages/admin/HeroPage"));
const ExperiencesPage = lazy(() => import("./pages/admin/ExperiencesPage"));
const ProjectsPage = lazy(() => import("./pages/admin/ProjectsPage"));
const SkillsPage = lazy(() => import("./pages/admin/SkillsPage"));
const CertificationsPage = lazy(() => import("./pages/admin/CertificationsPage"));
const CustomSectionsPage = lazy(() => import("./pages/admin/CustomSectionsPage"));
const CustomFeatureDetailPage = lazy(() => import("./pages/admin/CustomFeatureDetailPage"));

// Error boundary to catch silent render errors
interface EBProps { children: ReactNode }
interface EBState { error: Error | null }
class ErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { error: null };
  static getDerivedStateFromError(error: Error): EBState { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '40px', background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#f87171' }}>⚠️ Render Error — Kirim screenshot ini ke developer</h2>
          <pre style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', overflow: 'auto', color: '#fca5a5', fontSize: '13px' }}>
            {this.state.error.message}{'\n'}{this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function SectionLoader() {
  return <div className="h-32" />;
}

function MainPortfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [customSections, setCustomSections] = useState<any[]>([]);

  useEffect(() => {
    // Fetch custom sections for main page rendering
    const fetchCustomSections = () => {
      import("./lib/api").then(({ api }) => {
        api.getCustomSections().then((data) => {
          if (Array.isArray(data)) {
            setCustomSections(data.filter((s: any) => s.isVisible).sort((a: any, b: any) => a.order - b.order));
          }
        }).catch(console.error);
      });
    };

    fetchCustomSections();
    window.addEventListener('custom-sections-updated', fetchCustomSections);

    // Skip smooth scroll if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsLoading(false);
      return;
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    
    // @ts-ignore
    window.globalLenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      window.removeEventListener('custom-sections-updated', fetchCustomSections);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-white">
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <BackgroundElements />
          <Navbar />
          <main>
            {/* Hero is loaded eagerly (above the fold) */}
            <Hero />
            {/* Everything below the fold is lazy-loaded */}
            <Suspense fallback={<SectionLoader />}>
              <About />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <Skills />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <Experience />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <ProjectsSection />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <CertificationsSection />
            </Suspense>
            {customSections.map(section => (
              <Suspense key={section.id} fallback={<SectionLoader />}>
                <CustomSectionComponent section={section} />
              </Suspense>
            ))}
            <Suspense fallback={<SectionLoader />}>
              <Contact />
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <ContentProvider>
              <AuthProvider>
                <CustomCursor />
                <Suspense fallback={null}>
                  <Routes>
                    {/* Public Portfolio */}
                    <Route path="/" element={<MainPortfolio />} />

                    {/* Hidden Admin Login — exact path /xadmin */}
                    <Route path="/xadmin" element={<AdminLoginPage />} />

                    {/* Protected Admin Dashboard — all paths under /xadmin/panel/* */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/xadmin/panel/*" element={<AdminLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="hero" element={<HeroPage />} />
                        <Route path="experiences" element={<ExperiencesPage />} />
                        <Route path="projects" element={<ProjectsPage />} />
                        <Route path="skills" element={<SkillsPage />} />
                        <Route path="certifications" element={<CertificationsPage />} />
                        <Route path="custom-sections" element={<CustomSectionsPage />} />
                        <Route path="c/:id" element={<CustomFeatureDetailPage />} />
                      </Route>
                    </Route>

                    {/* 404 fallback */}
                    <Route path="*" element={<div style={{color: 'white', padding: '50px'}}>404 Not Found</div>} />
                  </Routes>
                </Suspense>
              </AuthProvider>
            </ContentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
