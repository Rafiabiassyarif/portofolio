import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id'); // Default to ID based on current text

  useEffect(() => {
    const savedLang = localStorage.getItem('portfolio_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('portfolio_language', lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const newLang = prev === 'en' ? 'id' : 'en';
      localStorage.setItem('portfolio_language', newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
