import { en } from './en';
import { kk } from './kk';
import { ru } from './ru';

export type Language = 'en' | 'kk' | 'ru';

export const languages = {
  en,
  kk,
  ru,
} as const;

export type TranslationKey = keyof typeof en;

// Функция для получения перевода с поддержкой плюрализации
export const t = (key: string, language: Language, count?: number): string => {
  const keys = key.split('.');
  let value: any = languages[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if translation not found
      value = languages.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }

  if (typeof value === 'string') {
    // Handle pluralization
    if (count !== undefined && typeof count === 'number') {
      if (count === 1 && key.includes('_plural')) {
        // Remove _plural suffix for singular
        const singularKey = key.replace('_plural', '');
        return t(singularKey, language, count);
      } else if (count !== 1 && !key.includes('_plural')) {
        // Add _plural suffix for plural
        const pluralKey = `${key}_plural`;
        const pluralValue = t(pluralKey, language, count);
        if (pluralValue !== pluralKey) {
          return pluralValue.replace('{{count}}', count.toString());
        }
      }
    }
    
    // Replace placeholders
    if (count !== undefined) {
      return value.replace('{{count}}', count.toString());
    }
    
    return value;
  }

  return key;
};

// Функция для получения названия языка
export const getLanguageName = (code: Language): string => {
  return languages[code].language[code];
};

// Функция для получения всех доступных языков
export const getAvailableLanguages = (): Array<{ code: Language; name: string }> => {
  return Object.entries(languages).map(([code, lang]) => ({
    code: code as Language,
    name: lang.language[code as Language]
  }));
};

export default languages;
