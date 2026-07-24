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

  const greeting = language === 'id'
    ? (heroData?.greetingId || "")
    : (heroData?.greetingEn || heroData?.greetingId || "");

  const headline = language === 'id'
    ? (heroData?.titleId || "")
    : (heroData?.titleEn || heroData?.titleId || "");

  const description = language === 'id'
    ? (heroData?.descriptionId || "")
    : (heroData?.descriptionEn || heroData?.descriptionId || "");

  const resumeLink = heroData?.resumeUrl || "";

  const profileImg = heroData?.profileImgUrl ? `${API_URL}${heroData.profileImgUrl}` : null;

  const SOCIALS = [
    { name: "Instagram", icon: <Instagram className="w-4 h-4" />, url: heroData?.instagramUrl || "https://www.instagram.com/rfiabi?igsh=YTJmZWRyd2xuY2Yw&utm_source=qr" },
    { name: "LinkedIn", icon: <Linkedin className="w-4 h-4" />, url: heroData?.linkedinUrl || "https://www.linkedin.com/in/rafi-abi-assyarif-06b851333" },
    { name: "Github", icon: <Github className="w-4 h-4" />, url: heroData?.githubUrl || "https://github.com/Rafiabiassyarif" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden w-full px-6 md:px-12 lg:px-24 2xl:px-32">

      {/* Huge Background Text (Layer 1: Behind Image) */}
      {name && (
        <div className="absolute top-[18%] md:top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-2 flex justify-center items-center pointer-events-none select-none z-0 overflow-visible">
          <motion.h1
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[18vw] sm:text-[14vw] md:text-[11vw] lg:text-[9.5vw] font-black tracking-tighter flex items-center justify-center gap-2 md:gap-4 leading-none whitespace-nowrap"
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

      {/* Main Container Layer (Layer 2: Image) */}
      <div className="relative w-full h-full flex flex-col justify-end z-10 pt-[20vh]">

        {/* Person Portrait (Centered Bottom) */}
        {profileImg && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-16 md:translate-y-24 lg:translate-y-32 z-10 w-full max-w-[280px] md:max-w-[380px] lg:max-w-[420px]">
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
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end md:items-start pb-12 md:pb-20 z-30 relative pointer-events-none">

          {/* Left Side: Bio & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-[35%] mb-10 md:mb-0 text-left mt-auto md:mt-0 pointer-events-auto"
          >
            {greeting && (
              <p className="text-sm md:text-lg text-foreground/80 font-medium mb-2 uppercase tracking-widest">{greeting}</p>
            )}
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">{headline}</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-sm leading-relaxed">
              {description}
            </p>
            <div className="flex items-center gap-4">
              <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold transition-transform hover:scale-105">
                {language === 'id' ? "Mari berkolaborasi" : "Let's collaborate"} <ArrowUpRight className="w-4 h-4 ml-2" />
              </a>
              {resumeLink && (
                <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-background border-2 border-foreground text-foreground px-6 py-3 text-sm font-semibold transition-transform hover:scale-105">
                  {language === 'id' ? "Lihat CV" : "View CV"}
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Side: Social Pills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full md:w-[35%] flex flex-col items-start md:items-end gap-4 mt-auto md:mt-0 pointer-events-auto"
          >
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-8 py-3 bg-background border border-border rounded-full text-base font-semibold text-foreground hover:scale-105 hover:shadow-sm transition-all min-w-[180px] justify-center md:justify-start"
              >
                {social.icon} <span className="flex-1 text-left">{social.name}</span>
              </a>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Huge Foreground Text (Layer 3: Outline on top of Image) */}
      {name && (
        <div className="absolute top-[18%] md:top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-2 flex justify-center items-center pointer-events-none select-none z-20 overflow-visible">
          <motion.h1
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[18vw] sm:text-[14vw] md:text-[11vw] lg:text-[9.5vw] font-black tracking-tighter flex items-center justify-center gap-2 md:gap-4 leading-none whitespace-nowrap"
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
