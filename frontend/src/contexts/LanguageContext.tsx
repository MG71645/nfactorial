import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, t, getAvailableLanguages } from '../locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, count?: number) => string;
  availableLanguages: Array<{ code: Language; name: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Определяем язык по умолчанию
  const getDefaultLanguage = (): Language => {
    // Проверяем сохраненный язык
    const saved = localStorage.getItem('language') as Language;
    if (saved && ['en', 'kk', 'ru'].includes(saved)) {
      return saved;
    }

    // Определяем язык браузера
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('kk') || browserLang.startsWith('kz')) {
      return 'kk';
    }
    if (browserLang.startsWith('ru')) {
      return 'ru';
    }
    
    // По умолчанию английский
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getDefaultLanguage);
  const availableLanguages = getAvailableLanguages();

  // Функция для установки языка
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Обновляем атрибут lang у html элемента
    document.documentElement.lang = lang;
    
    // Обновляем направление текста для казахского языка
    if (lang === 'kk') {
      document.documentElement.dir = 'ltr';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  // Функция для получения перевода
  const translate = (key: string, count?: number): string => {
    return t(key, language, count);
  };

  // Инициализация при загрузке
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'kk', 'ru'].includes(savedLang)) {
      setLanguage(savedLang);
    } else {
      setLanguage(getDefaultLanguage());
    }
  }, []);

  // Обновляем атрибут lang при изменении языка
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translate,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
