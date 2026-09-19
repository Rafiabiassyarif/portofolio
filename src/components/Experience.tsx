import { useEffect, useState } from "react";
import { useContent } from "../context/ContentContext";
import { api, API_URL } from "../lib/api";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";
import { Briefcase, Calendar } from "lucide-react";

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
    role: language === 'id' ? (exp.roleId || exp.roleEn) : (exp.roleEn || exp.roleId),
    company: exp.company,
    period: language === 'id' ? (exp.durationId || exp.durationEn) : (exp.durationEn || exp.durationId),
    description: language === 'id' ? (exp.descriptionId || exp.descriptionEn) : (exp.descriptionEn || exp.descriptionId),
    imageUrl: exp.imageUrl,
  })) : [
    {
      role: t.experience.role,
      company: "Ko+Lab Telkom University",
      period: t.experience.date,
      description: "",
      imageUrl: null,
    }
  ];

  const allExperiences = [...EXPERIENCES];

  return (
    <section id="experience" className="py-20 sm:py-24 md:py-32 relative z-20 w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32 border-t border-black/5 dark:border-white/5 overflow-hidden">

      {/* Title Section */}
      <div className="relative mb-14 sm:mb-20 text-center md:text-left overflow-hidden">
        <h1 className="absolute -top-10 sm:-top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[8vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          {language === 'id' ? 'PENGALAMAN' : 'EXPERIENCE'}
        </h1>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground relative z-10">
            {language === 'id' ? 'PENGALAMAN' : 'EXPERIENCE'}
          </h2>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto mt-8 sm:mt-12">
        {/* Timeline line */}
        <div className="absolute left-4 sm:left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent lg:-translate-x-[0.5px]"></div>

        <div className="space-y-8 sm:space-y-12 lg:space-y-24">
          {allExperiences.map((exp, idx) => {
            const isHovered = hoveredIndex === idx;
            const isEven = idx % 2 === 0;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                key={idx} 
                className={`relative flex flex-col lg:flex-row ${isEven ? 'lg:flex-row-reverse' : ''} items-start lg:items-center gap-6 lg:gap-16`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Timeline Node */}
                <div 
                  className={`absolute left-4 sm:left-6 lg:left-1/2 w-4 sm:w-5 h-4 sm:h-5 rounded-full border-3 sm:border-4 shadow-md -translate-x-1/2 mt-7 lg:mt-0 z-10 transition-all duration-500
                    ${isHovered 
                      ? 'bg-foreground border-background scale-125 shadow-foreground/50' 
                      : 'bg-background border-foreground shadow-foreground/20'}`}
                />

                {/* Date for Desktop (opposite side of card) */}
                <div className={`hidden lg:flex flex-1 ${isEven ? 'justify-start' : 'justify-end'}`}>
                  <div className={`transition-all duration-500 ${isHovered ? 'opacity-100 scale-105' : 'opacity-60'}`}>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-wider ${isHovered ? 'bg-foreground/10 text-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1 w-full pl-9 sm:pl-14 lg:pl-0">
                  <div className={`group relative p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-card border border-border hover:border-foreground/30 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden ${isHovered ? '-translate-y-1' : ''}`}>
                    {/* Subtle background glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                    
                    <div className="relative z-10">
                      {/* Mobile & Tablet Date Badge */}
                      <span className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-secondary/70 text-secondary-foreground text-xs font-bold tracking-wider">
                        <Calendar className="w-3 h-3" />
                        {exp.period}
                      </span>
                      
                      <div className="flex flex-col gap-1 mb-3 sm:mb-4">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground group-hover:text-foreground/80 transition-colors flex items-center gap-2.5 sm:gap-3">
                           <div className="p-1.5 sm:p-2 rounded-xl bg-foreground/10 text-foreground hidden sm:block">
                            <Briefcase className="w-4 sm:w-5 h-4 sm:h-5" />
                           </div>
                           {exp.company}
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium sm:ml-11">{exp.role}</p>
                      </div>
                      
                      {exp.description && (
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground/80 leading-relaxed sm:ml-11">
                          {exp.description}
                        </p>
                      )}

                      {/* Optional Image */}
                      {exp.imageUrl && (
                        <div className="mt-4 sm:mt-6 sm:ml-11 overflow-hidden rounded-xl h-36 sm:h-44 md:h-52 border border-border/50">
                           <img src={`${API_URL}${exp.imageUrl}`} alt={exp.company} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
