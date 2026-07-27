import React, { useEffect, useState } from 'react';
import { Award, ArrowUpRight } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { api, API_URL } from "../lib/api";

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

  // Duplicate 4 times to ensure it fills the screen and loops seamlessly
  const duplicatedCerts = [...CERTIFICATIONS, ...CERTIFICATIONS, ...CERTIFICATIONS, ...CERTIFICATIONS];

  return (
    <section id="certifications" className="py-24 md:py-32 relative z-20 bg-background w-full border-t border-black/5 dark:border-white/5 overflow-hidden">
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee ${Math.max(CERTIFICATIONS.length * 15, 30)}s linear infinite;
        }
        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      {/* Title Section */}
      <div className="relative mb-20 text-center md:text-left px-6 md:px-12 lg:px-24 2xl:px-32">
        <h1 className="absolute -top-12 md:-top-20 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[12vw] md:text-[9vw] font-black text-foreground/5 select-none pointer-events-none whitespace-nowrap">
          AWARDS
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground relative z-10 flex items-center justify-center md:justify-start gap-4">
          CERTIFICATIONS
        </h2>
      </div>

      {/* Carousel Section */}
      <div 
        className="relative flex w-full marquee-container" 
        style={{ 
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', 
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' 
        }}
      >
        <div className="flex w-max animate-marquee">
          {duplicatedCerts.map((card, idx) => (
            <div key={`${card.id}-${idx}`} className="w-[85vw] sm:w-[400px] px-4 shrink-0 py-4">
              <a
                href={card.link || "#"}
                target={card.link ? "_blank" : undefined}
                rel={card.link ? "noopener noreferrer" : undefined}
                className="group block p-6 rounded-[2rem] bg-card shadow-sm hover:shadow-xl transition-all duration-500 border border-border h-full flex flex-col hover:-translate-y-2 hover:border-primary/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {card.imageUrl ? (
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-white dark:bg-black relative z-10 border border-border/50">
                    <img 
                      src={`${API_URL}${card.imageUrl}`} 
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] rounded-xl mb-6 bg-white dark:bg-black flex items-center justify-center border border-border relative z-10">
                    <Award className="w-16 h-16 text-black/20 dark:text-white/20" />
                  </div>
                )}
                
                <div className="flex justify-between items-start gap-4 relative z-10 flex-1">
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">{card.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground line-clamp-2 mb-4">{card.desc}</p>
                    <div className="mt-auto">
                      <div className="text-xs font-bold px-3 py-1 bg-background rounded-full inline-block border border-border">
                        {card.score}
                      </div>
                    </div>
                  </div>
                  {card.link && (
                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

