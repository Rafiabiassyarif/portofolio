import { motion } from "motion/react";
import { Section, SectionHeading } from "./Section";
import * as LucideIcons from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { API_URL } from "../lib/api";

import { ArrowRight } from "lucide-react";

interface CustomSectionProps {
  section: {
    id: number;
    slug: string;
    titleId: string;
    titleEn: string;
    contentId: string;
    contentEn: string;
    icon: string | null;
  };
}

export function CustomSectionComponent({ section }: CustomSectionProps) {
  const { language } = useLanguage();
  
  const title = language === 'id' ? section.titleId : section.titleEn;
  const content = language === 'id' ? section.contentId : section.contentEn;
  
  // Try to parse content as JSON for dynamic collections
  let isCollection = false;
  let isRichText = false;
  let items: any[] = [];
  let textData: any = null;
  
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      isCollection = true;
      items = parsed;
    } else if (parsed && typeof parsed === 'object') {
      isRichText = true;
      textData = parsed;
    }
  } catch (e) {
    // legacy mode: single text block
  }
  
  // Dynamically resolve icon from Lucide if provided for section
  const IconComponent = section.icon && (LucideIcons as any)[section.icon] 
    ? (LucideIcons as any)[section.icon] 
    : null;

  return (
    <section id={section.slug} className="py-24 md:py-32 relative z-20 w-full px-6 md:px-12 lg:px-24 2xl:px-32 border-t border-black/5 dark:border-white/5">
      <div className="relative mb-20 text-center md:text-left">
        <h1 className="absolute -top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[9vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          {title.toUpperCase()}
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground relative z-10">
          {title.toUpperCase()}
        </h2>
      </div>

      {isCollection ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const itemTitle = language === 'id' ? item.titleId : item.titleEn;
            const itemSubtitle = language === 'id' ? item.subtitleId : item.subtitleEn;
            const itemDesc = language === 'id' ? item.descId : item.descEn;
            const isIconUrl = item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/') || item.icon.endsWith('.svg'));
            const ItemIcon = !isIconUrl && item.icon && (LucideIcons as any)[item.icon] ? (LucideIcons as any)[item.icon] : null;

            const cardContent = (
              <>
                {/* Decorative blob on hover */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                  {item.imageUrl && (
                    <div className="w-full h-48 md:h-52 mb-8 rounded-[1.5rem] overflow-hidden bg-black/10 shrink-0 shadow-inner">
                      <motion.img 
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        src={item.imageUrl.startsWith('http') || item.imageUrl.startsWith('data:') ? item.imageUrl : `${API_URL}${item.imageUrl}`} 
                        alt={itemTitle} 
                        className="w-full h-full object-cover origin-center" 
                      />
                    </div>
                  )}
                  {item.icon && (
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 shrink-0 shadow-sm group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-shadow duration-300"
                    >
                      {isIconUrl ? (
                        <img src={item.icon.startsWith('http') || item.icon.startsWith('data:') ? item.icon : `${API_URL}${item.icon}`} alt="icon" className="w-7 h-7 object-contain drop-shadow-sm" />
                      ) : item.icon.trim().startsWith('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: item.icon }} className="w-7 h-7 text-primary flex items-center justify-center [&>i]:text-[28px] [&>svg]:w-full [&>svg]:h-full drop-shadow-sm" />
                      ) : (
                        ItemIcon && <ItemIcon className="w-7 h-7 text-primary drop-shadow-sm" />
                      )}
                    </motion.div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {itemTitle}
                  </h3>
                  {itemSubtitle && (
                    <p className="text-xs md:text-sm font-semibold text-primary/80 mb-4 tracking-wide uppercase">{itemSubtitle}</p>
                  )}
                  <p className="text-muted-foreground leading-relaxed flex-1 text-sm md:text-base">
                    {itemDesc}
                  </p>
                </div>
              </>
            );

            const cardWrapperClass = "group relative h-full glass-panel rounded-[2rem] p-6 md:p-8 border border-border bg-card/40 hover:bg-card hover:border-primary/50 shadow-sm hover:shadow-[0_0_40px_rgba(var(--primary),0.15)] transition-all duration-500 flex flex-col cursor-pointer overflow-hidden";
            const nonLinkWrapperClass = "group relative h-full glass-panel rounded-[2rem] p-6 md:p-8 border border-border bg-card/40 hover:bg-card hover:border-primary/50 shadow-sm hover:shadow-[0_0_40px_rgba(var(--primary),0.15)] transition-all duration-500 flex flex-col overflow-hidden";

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: idx * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                {item.linkUrl ? (
                  <a href={item.linkUrl} target="_blank" rel="noreferrer" className={cardWrapperClass}>
                    {cardContent}
                  </a>
                ) : (
                  <div className={nonLinkWrapperClass}>
                    {cardContent}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : isRichText && textData ? (
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 w-full mt-10">
          {/* Animated Image Side */}
          {textData.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="w-full lg:w-1/2 relative group perspective-1000 order-2 lg:order-1"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-indigo-500/20 blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-700" />
              <div className="relative rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl glass-panel aspect-[4/3] md:aspect-video lg:aspect-[4/5] xl:aspect-[16/10] transform-gpu transition-transform duration-700 group-hover:scale-[1.02]">
                <img 
                  src={textData.imageUrl.startsWith('http') || textData.imageUrl.startsWith('data:') ? textData.imageUrl : `${API_URL}${textData.imageUrl}`} 
                  alt={title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>
          )}

          {/* Typography & Button Side */}
          <motion.div 
            initial={{ opacity: 0, x: textData.imageUrl ? 50 : 0, y: textData.imageUrl ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`flex flex-col items-start w-full order-1 lg:order-2 ${textData.imageUrl ? 'lg:w-1/2' : 'max-w-4xl mx-auto md:mx-0'}`}
          >
            {IconComponent && (
               <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-8 shadow-sm">
                 <IconComponent className="w-8 h-8 text-primary drop-shadow-sm" />
               </div>
            )}
            
            <div className="prose prose-invert max-w-none">
              {((language === 'id' ? textData.textId : textData.textEn) || "").split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="text-foreground/90 font-medium leading-relaxed text-lg md:text-xl mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {textData.linkUrl && (
              <motion.a
                href={textData.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 relative group overflow-hidden rounded-full inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg shadow-[0_0_40px_rgba(var(--primary),0.3)] hover:shadow-[0_0_60px_rgba(var(--primary),0.5)] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10">{language === 'id' ? textData.linkTextId || 'Lihat Detail' : textData.linkTextEn || 'View Details'}</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col items-start w-full max-w-4xl mx-auto md:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            {IconComponent && (
               <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-8 shadow-sm">
                 <IconComponent className="w-8 h-8 text-primary drop-shadow-sm" />
               </div>
            )}
            
            <div className="prose prose-invert max-w-none">
              {content.split('\n').map((paragraph, i) => (
                <p key={i} className="text-foreground/90 font-medium leading-relaxed text-lg md:text-xl mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
