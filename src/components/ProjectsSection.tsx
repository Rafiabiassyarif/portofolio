import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { api, API_URL } from "../lib/api";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";

import Stack from "./Stack";

export function ProjectsSection() {
  const { content: t } = useContent();
  const { language } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all projects
    api.getProjects().then(data => {
      if (Array.isArray(data)) {
        const visible = data.filter((p: any) => p.isVisible !== false);
        const sorted = visible.sort((a: any, b: any) => (a.order || 99) - (b.order || 99));
        setProjects(sorted);
      }
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  return (
    <section id="projects" className="py-20 sm:py-24 md:py-32 relative z-20 w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32 overflow-hidden border-t border-black/5 dark:border-white/5">

      {/* Title Section */}
      <div className="relative mb-14 sm:mb-20 text-center md:text-left overflow-hidden">
        <h1 className="absolute -top-10 sm:-top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[8vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          {language === 'id' ? 'PORTOFOLIO' : 'PORTFOLIO'}
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground relative z-10">
          {language === 'id' ? 'KARYA PILIHAN' : 'SELECTED WORK'}
        </h2>
      </div>

      {/* Stack */}
      <div className="relative z-10 w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length > 0 ? (
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-full h-[62vh] sm:h-[68vh] md:h-[72vh] min-h-[440px] sm:min-h-[500px] md:min-h-[560px] relative">
              <Stack
                cards={projects.map((project) => {
                  const title = language === 'id' 
                    ? (project.titleId || project.title || project.titleEn) 
                    : (project.titleEn || project.title || project.titleId);
                  const desc = language === 'id' 
                    ? (project.descriptionId || project.descriptionEn) 
                    : (project.descriptionEn || project.descriptionId);
                  const imgUrl = project.imageUrl ? `${API_URL}${project.imageUrl}` : "/placeholder.png";
                  const techTags = (project.tags || "").split(',').map((t: string) => t.trim()).filter(Boolean);

                  return (
                    <div
                      key={project.id}
                      className="w-full h-full flex flex-col border border-border rounded-[1.25rem] sm:rounded-[1.5rem] bg-card shadow-sm overflow-hidden select-none transform-gpu"
                      style={project.backgroundColor ? { backgroundColor: project.backgroundColor } : {}}
                    >
                      <a href={project.demoUrl || project.liveUrl || project.githubUrl || "#"} target="_blank" rel="noopener noreferrer" draggable={false} className="block relative w-full h-40 sm:h-48 md:h-1/2 overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/10 shrink-0">
                        <img
                          src={imgUrl}
                          alt={title}
                          draggable={false}
                          className="w-full h-full object-contain transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl text-black">
                          <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                      </a>
                      <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-1 bg-card">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          {techTags.slice(0, 4).map((tech: string, i: number) => (
                            <span key={i} className="px-2.5 py-0.5 sm:py-1 rounded-full border border-border text-[9px] sm:text-xs font-bold uppercase tracking-wider text-foreground">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-foreground mb-1.5 sm:mb-3 tracking-tight line-clamp-1">{title}</h3>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium mb-3 sm:mb-6 flex-1 line-clamp-2 sm:line-clamp-3">
                          {desc}
                        </p>
                        <div className="flex items-center gap-4 mt-auto pt-2 border-t border-border/50">
                          {(project.demoUrl || project.liveUrl) && (
                            <a href={project.demoUrl || project.liveUrl} target="_blank" rel="noreferrer" draggable={false} className="text-foreground text-xs sm:text-sm font-bold border-b border-foreground pb-0.5 hover:opacity-70 transition-opacity">
                              {(t.projects as any).liveDemo || (language === 'id' ? 'Demo Langsung' : 'Live Demo')}
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" draggable={false} className="text-foreground text-xs sm:text-sm font-bold border-b border-foreground pb-0.5 hover:opacity-70 transition-opacity">
                              {(t.projects as any).sourceCode || (language === 'id' ? 'Kode Sumber' : 'Source Code')}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                randomRotation={true}
                sensitivity={100}
                sendToBackOnClick={true}
                mobileClickOnly={true}
                mobileBreakpoint={768}
              />
            </div>

            {/* Mobile / Tablet Gesture Hint */}
            <p className="text-center text-xs text-muted-foreground mt-4 sm:mt-6 flex items-center justify-center gap-1.5 opacity-80 select-none">
              <span>👆</span>
              <span>{language === 'id' ? 'Ketuk atau geser kartu untuk melihat proyek berikutnya' : 'Tap or drag card to view next project'}</span>
            </p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-20 font-medium">
            {(t.projects as any).noProjects || (language === 'id' ? 'Tidak ada proyek ditemukan.' : 'No projects found.')}
          </div>
        )}
      </div>
    </section>
  );
}

