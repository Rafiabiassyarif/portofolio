import { Section, SectionHeading } from "./Section";
import { GraduationCap, Trophy, Briefcase, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useContent } from "../context/ContentContext";

export function About() {
  const { content: t } = useContent();



  return (
    <section id="about" className="py-24 md:py-32 relative z-20 w-full px-6 md:px-12 lg:px-24 2xl:px-32 border-t border-black/5 dark:border-white/5">
      
      {/* Title Section */}
      <div className="relative mb-20 text-center md:text-left">
        <h1 className="absolute -top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[9vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          ABOUT
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground relative z-10">
          /ABOUT ME
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1400px] mx-auto">
         {/* Main Intro Card */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 border border-border bg-card shadow-sm rounded-[1rem] p-8 md:p-12 relative overflow-hidden"
         >
            <h3 className="text-2xl md:text-4xl font-bold mb-6 tracking-tight text-foreground">{t.about.heading1} {t.about.heading2}</h3>
            <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
               {t.about.description}
            </p>
         </motion.div>

         {/* Stats / Status Stack */}
         <div className="flex flex-col gap-6">
            {/* GPA Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="bg-foreground text-background rounded-[1rem] p-8 flex flex-col items-center justify-center text-center flex-1"
            >
               <Trophy className="w-10 h-10 mb-4 opacity-80" />
               <div className="text-5xl font-black mb-2 tracking-tighter">3.75</div>
               <div className="text-sm font-bold uppercase tracking-widest opacity-60">{t.about.gpa}</div>
            </motion.div>

            {/* Location / Status Card */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="border border-border bg-card shadow-sm rounded-[1rem] p-8 flex flex-col justify-center flex-1"
            >
               <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-foreground" />
                  <span className="text-foreground font-bold">{t.about.location}</span>
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-30"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-foreground"></span>
                     </span>
                     <span className="text-foreground font-bold tracking-tight">{t.about.available}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{t.about.forInternship}</p>
               </div>
            </motion.div>
         </div>

         {/* Education / Role Card */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3 border border-border bg-[#1a1a1a] text-white rounded-[1rem] p-8 md:p-12 relative overflow-hidden"
         >
             <div className="grid md:grid-cols-2 gap-12 relative z-10">
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                      <GraduationCap className="w-8 h-8 opacity-80" />
                      <h4 className="text-xl font-black tracking-tight">{t.about.education}</h4>
                   </div>
                   <p className="text-2xl font-bold tracking-tight mt-2">{t.about.major}</p>
                   <p className="text-lg text-white/50 font-medium">Telkom University</p>
                </div>
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                      <Briefcase className="w-8 h-8 opacity-80" />
                      <h4 className="text-xl font-black tracking-tight">{t.about.experience}</h4>
                   </div>
                   <p className="text-2xl font-bold tracking-tight mt-2">{t.about.role}</p>
                   <p className="text-lg text-white/50 font-medium">Ko+Lab Telkom University</p>
                </div>
             </div>
         </motion.div>
      </div>
    </section>
  );
}
