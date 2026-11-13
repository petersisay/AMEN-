import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('amen_language');
      if (saved === 'en' || saved === 'am') return saved;
    } catch {
      // Ignore localStorage errors
    }
    // Default to Amharic as requested
    return 'am';
  });

  useEffect(() => {
    try {
      localStorage.setItem('amen_language', language);
    } catch {
      // Ignore localStorage errors
    }
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'am' ? 'en' : 'am'));
  }, []);

  const t = useCallback((path, params = {}) => {
    const keys = path.split('.');
    let val = translations[language];
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        val = null;
        break;
      }
    }

    // Fallback to Amharic if not found in current language
    if (val === null || val === undefined) {
      let fallback = translations.am;
      for (const k of keys) {
        if (fallback && typeof fallback === 'object' && k in fallback) {
          fallback = fallback[k];
        } else {
          fallback = path;
          break;
        }
      }
      val = typeof fallback === 'string' ? fallback : path;
    }

    if (typeof val === 'string') {
      return Object.entries(params).reduce((str, [k, v]) => {
        return str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }, val);
    }

    return val;
  }, [language]);

  const formatDate = useCallback((dateStr, options = {}) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const locale = language === 'am' ? 'am-ET' : 'en-US';
      const defaultOptions = {
        year: 'numeric',
        month: options.month || 'short',
        day: 'numeric'
      };
      return d.toLocaleDateString(locale, { ...defaultOptions, ...options });
    } catch {
      return '';
    }
  }, [language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    formatDate,
    isAmharic: language === 'am'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
