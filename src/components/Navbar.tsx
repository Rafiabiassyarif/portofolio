import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X, ArrowRight, Globe } from "lucide-react";
import { cn } from "../lib/utils";
import { useContent } from "../context/ContentContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { scrollY } = useScroll();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { content: t } = useContent();

  const [navLinks, setNavLinks] = useState([...NAV_LINKS]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  // Use IntersectionObserver for active section — zero scroll-event overhead
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost section that's >= 50% visible
        const visible = entries
          .filter(e => e.isIntersecting && e.intersectionRatio >= 0.5)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: 0.5, rootMargin: "-50px 0px 0px 0px" }
    );

    const sections = ["home", ...navLinks.map(l => l.href.substring(1))];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navLinks]);

  useEffect(() => {
    const fetchCustomSections = () => {
      import("../lib/api").then(({ api }) => {
        api.getCustomSections().then((data) => {
          if (Array.isArray(data)) {
            const customLinks = data
              .filter((s: any) => s.isVisible)
              .sort((a: any, b: any) => a.order - b.order)
              .map((s: any) => ({
                name: s.navLabelEn,
                href: `#${s.slug}`,
                isCustom: true,
                labelId: s.navLabelId,
                labelEn: s.navLabelEn,
              }));

            const baseLinks = [...NAV_LINKS];
            const contactLink = baseLinks.pop();
            setNavLinks([...baseLinks, ...customLinks, contactLink as any]);
          }
        }).catch(console.error);
      });
    };

    fetchCustomSections();
    window.addEventListener('custom-sections-updated', fetchCustomSections);
    return () => window.removeEventListener('custom-sections-updated', fetchCustomSections);
  }, []);

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          isScrolled ? "py-4" : "py-8"
        )}
      >
        <div className="w-full px-6 md:px-12 lg:px-24 2xl:px-32">
          <div className={cn(
            "flex items-center justify-between rounded-full transition-all duration-500",
            isScrolled ? "glass-panel px-6 py-3" : "px-2"
          )}>
            {/* Left: Logo / Name */}
            <a href="#home" className="flex items-center z-50 transition-transform hover:scale-105">
              <span className="text-xl font-black tracking-tighter text-foreground uppercase">
                RAFI.
              </span>
            </a>

            {/* Desktop Nav (Center) */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link: any) => {
                const linkName = link.isCustom 
                  ? (language === 'id' ? link.labelId : link.labelEn)
                  : (t.nav[link.href.substring(1) as keyof typeof t.nav] || link.name);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-base font-semibold transition-colors hover:text-foreground",
                      activeSection === link.href.substring(1) ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {linkName}
                  </a>
                );
              })}
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button onClick={toggleLanguage} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Globe className="w-5 h-5" /></button>
              <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                {theme === "dark" ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
              </button>
              <a
                href="#contact"
                className="group h-11 inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 text-base font-bold transition-all hover:scale-105"
              >
                <span className="mr-2">Let's Talk</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-foreground p-2 rounded-full glass"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-8 text-3xl font-light tracking-tight">
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xl font-medium text-foreground mb-4 p-2 rounded-full glass"
              >
                <Globe className="w-5 h-5" />
                <span>{t.nav.switchLanguage}</span>
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xl font-medium text-foreground mb-4 p-2 rounded-full glass"
              >
                {theme === "dark" ? (
                  <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg><span>Light Mode</span></>
                ) : (
                  <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg><span>Dark Mode</span></>
                )}
              </button>
              {navLinks.map((link: any, i: number) => {
                const linkName = link.isCustom 
                  ? (language === 'id' ? link.labelId : link.labelEn)
                  : (t.nav[link.href.substring(1) as keyof typeof t.nav] || link.name);
                return (
                  <motion.a
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "transition-colors hover:text-primary",
                      activeSection === link.href.substring(1) ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {linkName}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
