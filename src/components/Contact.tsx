import React from "react";
import { useContent } from "../context/ContentContext";
import { ArrowUpRight } from "lucide-react";

export function Contact() {
  const { content: t } = useContent();
  const emailAddress = "rafiabiassyarif@gmail.com"; 

  return (
    <section id="contact" className="py-32 md:py-48 relative z-20 w-full px-6 md:px-12 lg:px-24 2xl:px-32 border-t border-black/5 dark:border-white/5 overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center w-full relative z-10">
        <h2 className="text-[15vw] md:text-[10vw] font-black tracking-tighter leading-[0.8] mb-12 flex flex-col items-center">
          <span className="text-foreground">HAVE A</span>
          <span className="text-transparent italic" style={{ WebkitTextStroke: '2px var(--fg-color)' }}>PROJECT</span>
          <span className="text-foreground">IN MIND?</span>
        </h2>
        <p className="text-lg md:text-2xl font-medium text-muted-foreground mb-16 max-w-3xl leading-relaxed">
          {t.contact.description || "Open for full-time roles, freelance opportunities, and exciting software development projects. Let's collaborate to build impactful digital solutions."}
        </p>
        <a
          href={`mailto:${emailAddress}`}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-foreground bg-transparent px-10 py-5 md:px-14 md:py-6 text-xl md:text-2xl font-black uppercase tracking-widest text-foreground transition-colors hover:text-background"
        >
          <span className="absolute inset-0 bg-foreground translate-y-[101%] transition-transform duration-300 ease-out group-hover:translate-y-0" />
          <span className="relative z-10 flex items-center">
            {t.contact.emailMe || "Email Me"} <ArrowUpRight className="w-8 h-8 ml-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" />
          </span>
        </a>
      </div>
      
      {/* Decorative large background text (optional but adds to brutalist feel) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-foreground/5 pointer-events-none select-none whitespace-nowrap z-0">
        CONTACT
      </div>
    </section>
  );
}
