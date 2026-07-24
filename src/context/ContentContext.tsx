import React, { createContext, useContext, useState } from 'react';
import { translations as defaultTranslations } from '../utils/translations';
import { useLanguage } from './LanguageContext';

export type TranslationData = typeof defaultTranslations.en;

interface ContentContextType {
  content: TranslationData;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [isLoading] = useState(false);

  const content = defaultTranslations[language];

  return (
    <ContentContext.Provider value={{ content, isLoading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
