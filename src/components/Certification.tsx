import { Section, SectionHeading } from "./Section";
import { motion, useScroll, useTransform } from "motion/react";
import { Award, ShieldCheck, CheckCircle2, Medal } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { useRef } from "react";

export function Certification() {
  const containerRef = useRef(null);
  const { content: t } = useContent();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);



  return (
    <Section id="certifications" className="py-24 overflow-hidden">
      <SectionHeading className="text-center mb-16">{t.certification.title}</SectionHeading>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto" ref={containerRef}>
        <motion.div
          style={{ y, rotateZ: -2 }}
          className="glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:rotate-0 transition-transform duration-500"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[radial-gradient(circle_at_center,var(--secondary-color),transparent_70%)] opacity-15 group-hover:opacity-30 transition-opacity duration-500" />
          
          <div className="flex items-start justify-between mb-12 relative z-10">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-[0_0_30px_var(--secondary-color)]">
              <Award className="w-8 h-8" />
            </div>
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
              <CheckCircle2 className="w-3 h-3 mr-1" /> {t.certification.verified}
            </span>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-foreground mb-4">{t.certification.oracleTitle}</h3>
            <p className="text-lg text-muted-foreground">{t.certification.oracleDesc}</p>
          </div>
        </motion.div>

        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-20, 20]), rotateZ: 2 }}
          className="glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:rotate-0 transition-transform duration-500"
        >
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[radial-gradient(circle_at_center,var(--primary-color),transparent_70%)] opacity-15 group-hover:opacity-30 transition-opacity duration-500" />
          
          <div className="flex items-start justify-between mb-12 relative z-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 text-primary flex items-center justify-center shadow-[0_0_30px_var(--primary-color)]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
              {t.certification.score}
            </span>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-foreground mb-4">{t.certification.eprtTitle}</h3>
            <p className="text-lg text-muted-foreground whitespace-pre-line">{t.certification.eprtDesc}</p>
          </div>
        </motion.div>

        <motion.div
          style={{ y, rotateZ: -1 }}
          className="glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:rotate-0 transition-transform duration-500 md:col-span-2 lg:col-span-1"
        >
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[radial-gradient(circle_at_center,var(--accent-color),transparent_70%)] opacity-15 group-hover:opacity-30 transition-opacity duration-500" />
          
          <div className="flex items-start justify-between mb-12 relative z-10">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-[0_0_30px_var(--accent-color)]">
              <Medal className="w-8 h-8" />
            </div>
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
              {t.certification.dateKolab}
            </span>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-foreground mb-4">{t.certification.kolabTitle}</h3>
            <p className="text-lg text-muted-foreground whitespace-pre-line">{t.certification.kolabRole}</p>
          </div>
        </motion.div>



      </div>
    </Section>
  );
}
