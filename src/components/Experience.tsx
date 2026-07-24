import { useEffect, useState } from "react";
import { useContent } from "../context/ContentContext";
import { api, API_URL } from "../lib/api";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";

export function Experience() {
  const { content: t } = useContent();
  const { language } = useLanguage();
  const [dbExperiences, setDbExperiences] = useState<any[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    api.getExperiences().then(data => {
      if (Array.isArray(data)) setDbExperiences(data);
    }).catch(console.error);
  }, []);

  const EXPERIENCES = dbExperiences.length > 0 ? dbExperiences.filter((exp: any) => exp.isVisible !== false).map(exp => ({
    role: language === 'id' ? exp.roleId : exp.roleEn,
    company: exp.company,
    period: language === 'id' ? exp.durationId : exp.durationEn,
    description: language === 'id' ? exp.descriptionId : exp.descriptionEn,
    imageUrl: exp.imageUrl,
  })) : [
    {
      role: t.experience.role,
      company: "Ko+Lab Telkom University",
      period: t.experience.date,
      description: "",
    }
  ];

  const allExperiences = [...EXPERIENCES];

  return (
    <section id="experience" className="py-24 md:py-32 relative z-20 w-full px-6 md:px-12 lg:px-24 2xl:px-32 border-t border-black/5 dark:border-white/5">

      {/* Title Section */}
      <div className="relative mb-20 text-center md:text-left">
        <h1 className="absolute -top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[9vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          EXPERIENCE
        </h1>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-4">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            /EXPERIENCE
          </h2>
          <span className="text-sm font-semibold text-muted-foreground">
            {allExperiences.length}+ years of experience
          </span>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-[2rem] p-8 md:p-16 text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col">
          {allExperiences.map((exp, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={idx}
                className="group relative border-b border-white/10 py-8 md:py-10 transition-colors duration-300 hover:bg-white/5 px-4 md:px-6 -mx-4 md:-mx-6 rounded-xl"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{exp.company}</h3>
                    <p className="text-white/60 mb-2">{exp.role}</p>
                    {exp.description && <p className="text-white/40 text-sm max-w-2xl">{exp.description}</p>}
                  </div>
                  <div className="text-white/50 text-sm md:text-base whitespace-nowrap">
                    {exp.period}
                  </div>
                </div>

                {/* Floating Preview (Aesthetic mockup feature) */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.8,
                    rotate: isHovered ? -5 : 0
                  }}
                  className="absolute left-[60%] top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block z-50 origin-center"
                >
                  <div className="w-48 h-32 bg-white/90 rounded-2xl shadow-2xl p-1.5 flex items-center justify-center opacity-90 border border-white/20 overflow-hidden">
                    {exp.imageUrl ? (
                      <img src={`${API_URL}${exp.imageUrl}`} alt={exp.company} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="font-bold text-xs text-black">{exp.company}</span>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
