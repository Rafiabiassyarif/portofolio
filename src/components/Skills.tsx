import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { api } from "../lib/api";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";

interface Skill {
  id: number;
  name: string;
  icon: string | null;
  category: string;
  order: number;
  isVisible?: boolean;
}

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools'];

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const { language } = useLanguage();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  useEffect(() => {
    api.getSkills().then(data => {
      if (Array.isArray(data)) setSkills(data);
    }).catch(console.error);
  }, []);

  // Group skills by category
  const groupedSkills = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat && s.isVisible !== false).sort((a, b) => a.order - b.order);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getCategoryDesc = (cat: string) => {
    switch(cat) {
      case 'Frontend': return "Building clear and scalable interfaces for web applications.";
      case 'Backend': return "Developing robust APIs and server-side logic.";
      case 'Database': return "Designing efficient and secure data storage solutions.";
      case 'Tools': return "Utilizing modern workflows and version control.";
      default: return "";
    }
  };

  return (
    <section id="skills" className="py-24 md:py-32 relative z-20 w-full px-6 md:px-12 lg:px-24 2xl:px-32 border-t border-black/5 dark:border-white/5">
      
      {/* Title Section */}
      <div className="relative mb-20 text-center md:text-left">
        <h1 className="absolute -top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[9vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          SERVICES
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground relative z-10">
          /SERVICES & SKILLS
        </h2>
      </div>

      <div className="flex flex-col border-t border-border">
        {CATEGORIES.map((category, idx) => {
          const categorySkills = groupedSkills[category] || [];
          if (categorySkills.length === 0 && skills.length > 0) return null;
          const isHovered = hoveredCategory === category;

          return (
            <div 
              key={category}
              className="group relative border-b border-border transition-colors duration-500 overflow-hidden"
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Hover Background Fill */}
              <div 
                className={`absolute inset-0 bg-foreground transition-transform duration-500 origin-left ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between py-12 px-6">
                <div className="w-full md:w-1/2">
                  <h3 className={`text-3xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${isHovered ? 'text-background' : 'text-foreground'}`}>
                    {category.toUpperCase()}
                  </h3>
                  <p className={`text-sm md:text-base max-w-sm transition-colors duration-300 ${isHovered ? 'text-background/80' : 'text-muted-foreground'}`}>
                    {getCategoryDesc(category)}
                  </p>
                </div>

                <div className="w-full md:w-1/2 flex items-center justify-between md:justify-end mt-8 md:mt-0">
                  <div className={`hidden md:flex flex-wrap gap-2 mr-12 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                    {categorySkills.slice(0, 5).map(skill => (
                      <span key={skill.id} className="text-xs font-semibold px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight className={`w-8 h-8 transition-colors duration-300 ${isHovered ? 'text-background' : 'text-foreground'}`} />
                </div>
              </div>

              {/* Floating Image/Preview on hover (Optional, purely aesthetic) */}
              <motion.div
                initial={false}
                animate={{ 
                  opacity: isHovered ? 1 : 0, 
                  scale: isHovered ? 1 : 0.9,
                  rotate: isHovered ? 5 : 0
                }}
                className="absolute right-[20%] top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block z-20"
                style={{ transformOrigin: "center" }}
              >
                <div className="w-48 h-32 bg-white rounded-xl shadow-2xl p-4 flex flex-wrap gap-2 items-center justify-center border border-black/5">
                   {categorySkills.slice(0, 4).map(skill => (
                     <div key={skill.id} className="text-xs font-bold bg-black/5 px-2 py-1 rounded text-black">{skill.name}</div>
                   ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
