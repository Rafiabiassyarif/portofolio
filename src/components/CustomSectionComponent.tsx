import { motion } from "motion/react";
import { Section, SectionHeading } from "./Section";
import * as LucideIcons from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

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
  let items: any[] = [];
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      isCollection = true;
      items = parsed;
    }
  } catch (e) {
    // legacy mode: single text block
  }
  
  // Dynamically resolve icon from Lucide if provided for section
  const IconComponent = section.icon && (LucideIcons as any)[section.icon] 
    ? (LucideIcons as any)[section.icon] 
    : null;

  return (
    <Section id={section.slug} className="py-24 md:py-32 relative z-20 w-full px-6 md:px-12 lg:px-24 2xl:px-32">
      <div className="relative mb-20 text-center md:text-left">
        <h1 className="absolute -top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[9vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          {title.toUpperCase()}
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground relative z-10">
          /{title.toUpperCase()}
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
                {item.imageUrl && (
                  <div className="w-full h-40 md:h-48 mb-6 rounded-2xl overflow-hidden bg-black/10 border border-white/5 shrink-0">
                    <img src={item.imageUrl} alt={itemTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                {item.icon && (
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all shrink-0">
                    {isIconUrl ? (
                      <img src={item.icon} alt="icon" className="w-6 h-6 object-contain" />
                    ) : (
                      ItemIcon && <ItemIcon className="w-6 h-6 text-primary" />
                    )}
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {itemTitle}
                </h3>
                {itemSubtitle && (
                  <p className="text-sm font-medium text-primary mb-4">{itemSubtitle}</p>
                )}
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {itemDesc}
                </p>
              </>
            );

            const cardWrapperClass = "group relative h-full glass-panel rounded-3xl p-6 lg:p-8 border border-border bg-card/40 hover:bg-card hover:border-primary/30 hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] transition-all flex flex-col cursor-pointer";
            const nonLinkWrapperClass = "group relative h-full glass-panel rounded-3xl p-6 lg:p-8 border border-border bg-card/40 hover:bg-card hover:border-primary/30 hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] transition-all flex flex-col";

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
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
      ) : (
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-8 lg:p-12 border border-border bg-card/40 hover:bg-card transition-colors shadow-xl w-full max-w-5xl"
          >
            {IconComponent && (
               <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                 <IconComponent className="w-8 h-8 text-primary" />
               </div>
            )}
            
            <div className="max-w-none text-left">
              {content.split('\n').map((paragraph, i) => (
                <p key={i} className="text-foreground/80 font-medium leading-relaxed text-lg mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </Section>
  );
}
