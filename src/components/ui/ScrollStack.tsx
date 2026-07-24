import React from "react";
import { motion } from "motion/react";
import { Github, ArrowUpRight, FolderGit2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useContent } from "../../context/ContentContext";
import { API_URL } from "../../lib/api";

interface Project {
  id?: number | string;
  title: string;
  descriptionId: string;
  descriptionEn: string;
  githubUrl: string;
  demoUrl: string;
  tags: string;
  imageUrl: string;
  order?: number;
}

interface ScrollStackProps {
  projects: Project[];
}

export function ScrollStack({ projects }: ScrollStackProps) {
  const { language } = useLanguage();
  const { content: t } = useContent();

  if (!projects || projects.length === 0) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col gap-4 lg:gap-8 pb-32 pt-10">
      {projects.map((project, index) => {
        const tags = project.tags ? project.tags.split(',').map(t => t.trim()) : [];
        const imageSrc = project.imageUrl && project.imageUrl !== "/logo.png" ? `${API_URL}${project.imageUrl}` : null;
        const description = language === 'id' ? project.descriptionId : project.descriptionEn;

        // Sticky stacking effect: each card stops slightly lower than the one before it
        const stickyTop = `calc(6rem + ${index * 1.5}rem)`;
        const zIndex = index + 1; // Later cards stack on top of earlier cards

        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            key={project.id || project.title}
            className="sticky w-full rounded-[2.5rem] glass-panel border border-foreground/10 overflow-hidden shadow-2xl flex flex-col md:flex-row bg-card/95 will-change-transform"
            style={{ 
              top: stickyTop, 
              zIndex: zIndex,
              minHeight: "450px" 
            }}
          >
            {/* Image Section */}
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-[#050B14] relative border-b md:border-b-0 md:border-r border-foreground/10 overflow-hidden flex items-center justify-center p-8 lg:p-12">
              {imageSrc ? (
                <img src={imageSrc} alt={project.title} className="w-full h-full object-contain drop-shadow-[0_0_20px_var(--primary-color)] transition-transform duration-700 hover:scale-105" />
              ) : (
                <FolderGit2 className="w-24 h-24 text-muted-foreground/30" />
              )}
              {/* Subtle mesh background */}
              <div className="absolute inset-0 bg-[linear-gradient(var(--color-foreground)_1px,transparent_1px),linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-[0.02] pointer-events-none" />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between relative bg-background/50">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">{project.title}</h3>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                  {description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-8">
                  {tags.map((tech) => (
                    <span key={tech} className="px-4 py-1.5 text-xs lg:text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 pt-8 border-t border-foreground/10">
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full sm:flex-1 text-center py-3.5 rounded-full bg-foreground text-background font-semibold hover:scale-105 transition-transform flex justify-center items-center gap-2"
                  >
                    {t.projects.livePreview} <ArrowUpRight className="w-5 h-5" />
                  </a>
                )}
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 text-center py-3.5 rounded-full glass hover:bg-foreground/10 transition-colors text-foreground font-medium flex justify-center items-center gap-2 border border-foreground/20 hover:border-foreground/40"
                  >
                    <Github className="w-5 h-5" /> {t.projects.source}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
