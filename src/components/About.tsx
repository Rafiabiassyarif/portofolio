import { Section, SectionHeading } from "./Section";
import { GraduationCap, Trophy, Briefcase, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";

export function About() {
  const { content: t } = useContent();
  const { language } = useLanguage();

  return (
    <section id="about" className="py-20 sm:py-24 md:py-32 relative z-20 w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32 border-t border-black/5 dark:border-white/5 overflow-hidden">
      
      {/* Title Section */}
      <div className="relative mb-14 sm:mb-20 text-center md:text-left overflow-hidden">
        <h1 className="absolute -top-10 sm:-top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[8vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          {(t.about as any).watermark || (language === 'id' ? 'TENTANG' : 'ABOUT')}
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground relative z-10">
          {(t.about as any).title || (language === 'id' ? 'TENTANG SAYA' : 'ABOUT ME')}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full max-w-[1400px] mx-auto">
         {/* Main Intro Card */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 border border-border bg-card shadow-sm rounded-[1.25rem] sm:rounded-[1.5rem] p-6 sm:p-8 md:p-12 relative overflow-hidden"
         >
            <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4 sm:mb-6 tracking-tight text-foreground">{t.about.heading1} {t.about.heading2}</h3>
            <p className="text-muted-foreground text-sm sm:text-base md:text-xl font-medium leading-relaxed max-w-3xl">
               {t.about.description}
            </p>
         </motion.div>

         {/* Stats / Status Stack */}
         <div className="flex flex-col sm:flex-row md:flex-col gap-5 sm:gap-6">
            {/* GPA Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="bg-foreground text-background rounded-[1.25rem] sm:rounded-[1.5rem] p-6 sm:p-8 flex flex-col items-center justify-center text-center flex-1 shadow-sm"
            >
               <Trophy className="w-8 sm:w-10 h-8 sm:h-10 mb-3 sm:mb-4 opacity-80" />
               <div className="text-4xl sm:text-5xl font-black mb-1 sm:mb-2 tracking-tighter">3.75</div>
               <div className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-60">{t.about.gpa}</div>
            </motion.div>

            {/* Location / Status Card */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="border border-border bg-card shadow-sm rounded-[1.25rem] sm:rounded-[1.5rem] p-6 sm:p-8 flex flex-col justify-center flex-1"
            >
               <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-foreground" />
                  <span className="text-foreground font-bold text-sm sm:text-base">{t.about.location}</span>
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-1.5 sm:mb-2">
                     <span className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-30"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-foreground"></span>
                     </span>
                     <span className="text-foreground font-bold tracking-tight text-sm sm:text-base">{t.about.available}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">{t.about.forInternship}</p>
               </div>
            </motion.div>
         </div>

         {/* Education / Role Card */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3 border border-border bg-[#1a1a1a] text-white rounded-[1.25rem] sm:rounded-[1.5rem] p-6 sm:p-8 md:p-12 relative overflow-hidden"
         >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 relative z-10">
                <div className="flex flex-col gap-3 sm:gap-4">
                   <div className="flex items-center gap-3 sm:gap-4 border-b border-white/10 pb-3 sm:pb-4">
                      <GraduationCap className="w-6 sm:w-8 h-6 sm:h-8 opacity-80" />
                      <h4 className="text-lg sm:text-xl font-black tracking-tight">{t.about.education}</h4>
                   </div>
                   <p className="text-xl sm:text-2xl font-bold tracking-tight mt-1 sm:mt-2">{t.about.major}</p>
                   <p className="text-sm sm:text-base md:text-lg text-white/50 font-medium">Telkom University</p>
                </div>
                <div className="flex flex-col gap-3 sm:gap-4">
                   <div className="flex items-center gap-3 sm:gap-4 border-b border-white/10 pb-3 sm:pb-4">
                      <Briefcase className="w-6 sm:w-8 h-6 sm:h-8 opacity-80" />
                      <h4 className="text-lg sm:text-xl font-black tracking-tight">{t.about.experience}</h4>
                   </div>
                   <p className="text-xl sm:text-2xl font-bold tracking-tight mt-1 sm:mt-2">{t.about.role}</p>
                   <p className="text-sm sm:text-base md:text-lg text-white/50 font-medium">Ko+Lab Telkom University</p>
                </div>
             </div>
         </motion.div>
      </div>
    </section>
  );
}
