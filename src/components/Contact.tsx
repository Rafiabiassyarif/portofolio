import React from "react";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { ArrowUpRight } from "lucide-react";

export function Contact() {
  const { content: t } = useContent();
  const { language } = useLanguage();
  const emailAddress = "rafiabiassyarif@gmail.com"; 

  return (
    <section id="contact" className="py-20 sm:py-28 md:py-40 relative z-20 w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32 border-t border-black/5 dark:border-white/5 overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center w-full relative z-10">
        <h2 className="text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[7.5vw] font-black tracking-tighter leading-[0.85] sm:leading-[0.8] mb-8 sm:mb-12 flex flex-col items-center">
          <span className="text-foreground">{(t.contact as any).headingLine1 || (language === 'id' ? 'PUNYA' : 'HAVE A')}</span>
          <span className="text-transparent italic" style={{ WebkitTextStroke: '2px var(--fg-color)' }}>{(t.contact as any).headingLine2 || (language === 'id' ? 'RENCANA' : 'PROJECT')}</span>
          <span className="text-foreground">{(t.contact as any).headingLine3 || (language === 'id' ? 'PROYEK?' : 'IN MIND?')}</span>
        </h2>
        <p className="text-sm sm:text-base md:text-xl font-medium text-muted-foreground mb-10 sm:mb-16 max-w-2xl leading-relaxed">
          {t.contact.description || (language === 'id' ? "Terbuka untuk peluang kerja purna waktu (full-time), proyek lepas (freelance), maupun kolaborasi pengembangan perangkat lunak. Mari ciptakan solusi digital yang berdampak nyata." : "Open for full-time roles, freelance opportunities, and exciting software development projects. Let's collaborate to build impactful digital solutions.")}
        </p>
        <a
          href={`mailto:${emailAddress}`}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-foreground bg-transparent px-6 sm:px-10 md:px-14 py-3.5 sm:py-5 md:py-6 text-base sm:text-xl md:text-2xl font-black uppercase tracking-widest text-foreground transition-colors hover:text-background shadow-lg"
        >
          <span className="absolute inset-0 bg-foreground translate-y-[101%] transition-transform duration-300 ease-out group-hover:translate-y-0" />
          <span className="relative z-10 flex items-center">
            {t.contact.emailMe || (language === 'id' ? "Email Saya" : "Email Me")} <ArrowUpRight className="w-5 sm:w-7 md:w-8 h-5 sm:h-7 md:h-8 ml-2.5 sm:ml-4 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
          </span>
        </a>
      </div>
      
      {/* Decorative large background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[22vw] md:text-[25vw] font-black text-foreground/5 pointer-events-none select-none whitespace-nowrap z-0 overflow-hidden">
        {(t.contact as any).watermark || (language === 'id' ? 'KONTAK' : 'CONTACT')}
      </div>
    </section>
  );
}
