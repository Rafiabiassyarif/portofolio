import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Github, Instagram, Linkedin, Dribbble } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { api, API_URL } from "../lib/api";
import { useLanguage } from "../context/LanguageContext";

export function Hero() {
  const { content: t } = useContent();
  const { language } = useLanguage();
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    api.getHero().then(data => {
      if (data) setHeroData(data);
    }).catch(console.error);
  }, []);

  const name = heroData?.name || "";
  const nameParts = name.split(' ').filter(Boolean);
  const firstPart = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(' ').toUpperCase();
  const secondPart = nameParts.slice(Math.ceil(nameParts.length / 2)).join(' ').toUpperCase();

  const nameLength = name.length;
  const mobileFontSize = nameLength > 24 
    ? "text-[5vw]" 
    : nameLength > 18 
      ? "text-[6vw]" 
      : nameLength > 14 
        ? "text-[6.8vw]" 
        : nameLength > 10 
          ? "text-[8vw]" 
          : "text-[9.5vw]";

  const greeting = language === 'id'
    ? (heroData?.greetingId || heroData?.greetingEn || "")
    : (heroData?.greetingEn || heroData?.greetingId || "");

  const headline = language === 'id'
    ? (heroData?.titleId || heroData?.titleEn || "")
    : (heroData?.titleEn || heroData?.titleId || "");

  const description = language === 'id'
    ? (heroData?.descriptionId || heroData?.descriptionEn || "")
    : (heroData?.descriptionEn || heroData?.descriptionId || "");

  const rawResume = heroData?.resumeUrl?.trim() || "";
  const isLocalhostLink = rawResume.includes("localhost") || rawResume.includes("127.0.0.1");
  const resumeLink = (rawResume && !isLocalhostLink)
    ? (rawResume.startsWith('/uploads/') 
        ? `${API_URL}${rawResume}` 
        : (rawResume.startsWith('http://') || rawResume.startsWith('https://') 
            ? rawResume 
            : `https://${rawResume}`))
    : "";

  const profileImg = heroData?.profileImgUrl ? `${API_URL}${heroData.profileImgUrl}` : null;

  const SOCIALS = [
    { name: "Instagram", icon: <Instagram className="w-4 h-4" />, url: heroData?.instagramUrl || "https://www.instagram.com/rfiabi?igsh=YTJmZWRyd2xuY2Yw&utm_source=qr" },
    { name: "LinkedIn", icon: <Linkedin className="w-4 h-4" />, url: heroData?.linkedinUrl || "https://www.linkedin.com/in/rafi-abi-assyarif-06b851333" },
    { name: "Github", icon: <Github className="w-4 h-4" />, url: heroData?.githubUrl || "https://github.com/Rafiabiassyarif" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-12 overflow-hidden w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32">

      {/* ================= MOBILE HERO (< lg) ================= */}
      <div className="lg:hidden flex flex-col items-center text-center w-full max-w-lg mx-auto z-10 pt-2 pb-6">
        
        {/* 1. Name Branding Header */}
        {name && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center items-center mb-3"
          >
            <h1 className="text-2xl sm:text-3xl font-black tracking-normal flex items-center justify-center gap-2 leading-none whitespace-nowrap">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: '1px var(--fg-color)' }}
              >
                {firstPart}
              </span>
              <span className="text-foreground">
                {secondPart}
              </span>
            </h1>
          </motion.div>
        )}

        {/* 2. Greeting & Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-3 px-2"
        >
          {greeting && (
            <p className="text-xs text-foreground/80 font-semibold uppercase tracking-widest mb-1">
              {greeting}
            </p>
          )}
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug">
            {headline}
          </h2>
        </motion.div>

        {/* 3. Portrait Photo */}
        {profileImg && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative my-1 flex justify-center items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent rounded-full blur-2xl -z-10 scale-90" />
            <img
              src={profileImg}
              alt={name}
              className="w-40 sm:w-48 h-auto max-h-[240px] sm:max-h-[280px] object-contain object-bottom grayscale hover:grayscale-0 transition-all duration-500 drop-shadow-xl"
            />
          </motion.div>
        )}

        {/* 4. Bio Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed my-2.5 px-3"
        >
          {description}
        </motion.p>

        {/* 5. CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-2.5 w-full max-w-xs mx-auto my-2"
        >
          <a
            href="#contact"
            className="flex-1 inline-flex items-center justify-center rounded-full bg-foreground text-background px-4 py-2.5 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            {(t.hero as any).collaborate || (language === 'id' ? "Mari berkolaborasi" : "Let's collaborate")}
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </a>
          {resumeLink && (
            <a
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center rounded-full bg-background border-2 border-foreground text-foreground px-4 py-2.5 text-xs font-bold hover:scale-105 active:scale-95 transition-all"
            >
              {(t.hero as any).viewCv || (language === 'id' ? "Lihat CV" : "View CV")}
            </a>
          )}
        </motion.div>

        {/* 6. Social Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 w-full max-w-sm mx-auto mt-2"
        >
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background/90 backdrop-blur-md border border-border rounded-full text-[11px] sm:text-xs font-semibold text-foreground hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              {social.icon} <span>{social.name}</span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* ================= DESKTOP HERO (lg and above) ================= */}
      {/* Huge Background Text (Layer 1: Behind Image) */}
      {name && (
        <div className="hidden lg:flex absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-full px-2 justify-center items-center pointer-events-none select-none z-0 overflow-hidden">
          <motion.h1
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[8.5vw] xl:text-[8vw] font-black tracking-tighter flex items-center justify-center gap-4 leading-none whitespace-nowrap"
          >
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '2px var(--fg-color)' }}
            >
              {firstPart}
            </span>
            <span className="text-foreground">
              {secondPart}
            </span>
          </motion.h1>
        </div>
      )}

      {/* Main Container Layer (Layer 2: Image & Content) */}
      <div className="hidden lg:flex relative w-full h-full flex-col justify-end z-10 pt-[20vh]">

        {/* Person Portrait (Centered Bottom) */}
        {profileImg && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-20 lg:translate-y-28 z-10 w-full max-w-[380px] xl:max-w-[420px] pointer-events-auto">
            <motion.img
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={profileImg}
              alt={name}
              className="w-full h-auto object-cover object-bottom grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
            />
          </div>
        )}

        {/* Floating Content Overlays */}
        <div className="w-full max-w-7xl mx-auto flex flex-row justify-between items-end pb-16 z-30 relative pointer-events-none">

          {/* Left Side: Bio & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-[36%] text-left mt-auto pointer-events-auto"
          >
            {greeting && (
              <p className="text-base text-foreground/80 font-medium mb-2 uppercase tracking-widest">{greeting}</p>
            )}
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">{headline}</h2>
            <p className="text-base text-muted-foreground mb-8 max-w-md leading-relaxed">
              {description}
            </p>
            <div className="flex items-center gap-4">
              <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold transition-transform hover:scale-105 shadow-md">
                {(t.hero as any).collaborate || (language === 'id' ? "Mari berkolaborasi" : "Let's collaborate")} <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </a>
              {resumeLink && (
                <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-background border-2 border-foreground text-foreground px-6 py-3 text-sm font-semibold transition-transform hover:scale-105">
                  {(t.hero as any).viewCv || (language === 'id' ? "Lihat CV" : "View CV")}
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Side: Social Pills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-[36%] flex flex-col items-end gap-4 mt-auto pointer-events-auto"
          >
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-7 py-3 bg-background/90 backdrop-blur-md border border-border rounded-full text-base font-semibold text-foreground hover:scale-105 hover:shadow-md transition-all min-w-[180px] justify-start"
              >
                {social.icon} <span className="flex-1 text-left">{social.name}</span>
              </a>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Huge Foreground Text (Layer 3: Outline on top of Image) */}
      {name && (
        <div className="hidden lg:flex absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-full px-2 justify-center items-center pointer-events-none select-none z-20 overflow-hidden">
          <motion.h1
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[8.5vw] xl:text-[8vw] font-black tracking-tighter flex items-center justify-center gap-4 leading-none whitespace-nowrap"
          >
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '2px var(--fg-color)' }}
            >
              {firstPart}
            </span>
            <span className="opacity-0">
              {secondPart}
            </span>
          </motion.h1>
        </div>
      )}
    </section>
  );
}
