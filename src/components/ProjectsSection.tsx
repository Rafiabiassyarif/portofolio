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
    <section id="projects" className="py-24 md:py-32 relative z-20 w-full px-6 md:px-12 lg:px-24 2xl:px-32">

      {/* Title Section */}
      <div className="relative mb-20 text-center md:text-left">
        <h1 className="absolute -top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[9vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          PORTFOLIO
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground relative z-10">
          SELECTED WORK
        </h2>
      </div>

      {/* Stack */}
      <div className="relative z-10 w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length > 0 ? (
          <div className="w-full max-w-3xl mx-auto h-[70vh] min-h-[500px] md:min-h-[600px] relative">
            <Stack
              cards={projects.map((project) => {
                const title = language === 'id' ? project.titleId || project.title : project.titleEn || project.title;
                const desc = language === 'id' ? project.descriptionId : project.descriptionEn;
                const imgUrl = project.imageUrl ? `${API_URL}${project.imageUrl}` : "/placeholder.png";
                const techTags = (project.tags || "").split(',').map((t: string) => t.trim()).filter(Boolean);

                return (
                  <div
                    key={project.id}
                    className="w-full h-full flex flex-col border border-border rounded-[1.5rem] bg-card shadow-sm overflow-hidden select-none transform-gpu"
                    style={project.backgroundColor ? { backgroundColor: project.backgroundColor } : {}}
                  >
                    <a href={project.demoUrl || project.liveUrl || project.githubUrl || "#"} target="_blank" rel="noopener noreferrer" draggable={false} className="block relative w-full aspect-video md:aspect-auto md:h-1/2 overflow-hidden flex items-center justify-center p-8 bg-black/10 shrink-0">
                      <img
                        src={imgUrl}
                        alt={title}
                        draggable={false}
                        className="w-full h-full object-contain transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 translate-y-4 hover:opacity-100 hover:translate-y-0 transition-all duration-300 shadow-xl text-black">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </a>
                    <div className="p-6 md:p-8 flex flex-col flex-1 bg-card">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {techTags.map((tech: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-full border border-border text-[10px] md:text-xs font-bold uppercase tracking-wider text-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl md:text-3xl font-black text-foreground mb-2 md:mb-4 tracking-tight">{title}</h3>
                      <p className="text-sm md:text-base text-muted-foreground font-medium mb-4 md:mb-8 flex-1 line-clamp-3">
                        {desc}
                      </p>
                      <div className="flex items-center gap-4 mt-auto">
                        {(project.demoUrl || project.liveUrl) && (
                          <a href={project.demoUrl || project.liveUrl} target="_blank" rel="noreferrer" draggable={false} className="text-foreground text-xs md:text-sm font-bold border-b border-foreground pb-1 hover:opacity-70 transition-opacity">
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" draggable={false} className="text-foreground text-xs md:text-sm font-bold border-b border-foreground pb-1 hover:opacity-70 transition-opacity">
                            Source Code
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
            />
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-20 font-medium">
            No projects found.
          </div>
        )}
      </div>
    </section>
  );
}

