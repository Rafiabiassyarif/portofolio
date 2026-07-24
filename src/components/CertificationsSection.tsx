import React, { useEffect, useState } from 'react';
import { Award, ArrowUpRight } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { api, API_URL } from "../lib/api";
import { motion } from 'motion/react';

export function CertificationsSection() {
  const { language } = useLanguage();
  const [dbCerts, setDbCerts] = useState<any[]>([]);

  useEffect(() => {
    api.getCertifications().then(data => {
      if (Array.isArray(data)) setDbCerts(data);
    }).catch(console.error);
  }, []);

  const CERTIFICATIONS = dbCerts.length > 0 ? dbCerts.filter((cert: any) => cert.isVisible !== false).map((cert) => {
    return {
      id: cert.id,
      title: language === 'id' ? cert.titleId || cert.title : cert.titleEn || cert.title,
      desc: language === 'id' ? cert.issuerId : cert.issuerEn,
      score: language === 'id' ? cert.dateId || cert.date : cert.dateEn || cert.date,
      link: cert.credentialUrl,
      imageUrl: cert.imageUrl,
    };
  }) : [];

  if (CERTIFICATIONS.length === 0) return null;

  return (
    <section id="certifications" className="py-24 md:py-32 relative z-20 bg-background w-full px-6 md:px-12 lg:px-24 2xl:px-32 border-t border-black/5 dark:border-white/5">
      
      {/* Title Section */}
      <div className="relative mb-20 text-center md:text-left">
        <h1 className="absolute -top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[9vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          AWARDS
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground relative z-10 flex items-center justify-center md:justify-start gap-4">
          <Award className="w-10 h-10 md:w-12 md:h-12" />
          /CERTIFICATIONS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {CERTIFICATIONS.map((card, idx) => (
          <motion.a
            key={card.id}
            href={card.link || "#"}
            target={card.link ? "_blank" : undefined}
            rel={card.link ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: (idx % 3) * 0.15 }}
            className="group block p-6 rounded-[2rem] bg-card shadow-sm hover:shadow-md transition-all border border-border"
          >
            {card.imageUrl ? (
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-white dark:bg-black">
                <img 
                  src={`${API_URL}${card.imageUrl}`} 
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] rounded-xl mb-6 bg-white dark:bg-black flex items-center justify-center border border-border">
                <Award className="w-16 h-16 text-black/20 dark:text-white/20" />
              </div>
            )}
            
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{card.title}</h3>
                <p className="text-sm font-medium text-muted-foreground">{card.desc}</p>
                <div className="mt-4 text-xs font-bold px-3 py-1 bg-background rounded-full inline-block border border-border">
                  {card.score}
                </div>
              </div>
              {card.link && (
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0 group-hover:bg-foreground group-hover:text-background transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

