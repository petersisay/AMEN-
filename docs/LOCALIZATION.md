# AMEN+ Bilingual Localization Architecture (i18n)

This document describes the internationalization (i18n) system implemented across AMEN+, supporting seamless switching between **Amharic (አማርኛ)** and **English**.

---

## 🌍 Overview

The primary congregation and audience for the Apostolic Church of Ethiopia speaks Amharic, while English support provides global accessibility for diaspora members, visitors, and non-Amharic speakers.

### Features
- **Instantaneous Language Toggle**: Switch languages instantly from the navigation header without reloading the page.
- **Persistent Preference**: Selected language is preserved in browser `localStorage` across user sessions.
- **Dynamic HTML Language Attribute**: Automatically synchronizes `<html lang="am">` and `<html lang="en">` for screen readers and search engines.
- **Typographic Harmonization**: Seamless pairing between `Noto Sans Ethiopic` for Ge'ez script and `Inter` for Latin script.

---

## 🏗️ Architecture & Context Structure

The localization engine is built using React Context API:

```
client/src/
├── context/
│   └── LanguageContext.jsx       # Provides language state, toggle handler & translation function (t)
└── locales/
    └── translations.js           # Structured dictionary keys for Amharic and English
```

### Context Hook Usage: `useLanguage()`

```javascript
import { useLanguage } from '../context/LanguageContext';

function MyComponent() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div>
      <h2>{t('nav.videos')}</h2>
      <button onClick={toggleLanguage}>
        {language === 'am' ? 'English' : 'አማርኛ'}
      </button>
    </div>
  );
}
```

---

## 📖 Translation Dictionary Hierarchy

Strings are organized into logical domain namespaces within `client/src/locales/translations.js`:

```javascript
export const translations = {
  am: {
    brand: {
      tagline: 'የኢትዮጵያ ሐዋርያዊት ቤተክርስቲያን ሚዲያ',
    },
    nav: {
      home: 'መነሻ',
      videos: 'ቪዲዮዎች',
      about: 'ስለ እኛ',
      officialChannel: 'ዩቲዩብ ቻናል',
    },
    search: {
      placeholder: 'ቪዲዮዎችን በርእስ ወይም በይዘት ይፈልጉ...',
      clear: 'ፍለጋውን አጽዳ',
      resultsCount: 'የተገኙ ቪዲዮዎች',
      noResultsTitle: 'ምንም የተገኘ ቪዲዮ የለም',
      noResultsDesc: 'እባክዎ የተለየ ቃል ወይም ፊደል ተጠቅመው እንደገና ይሞክሩ።',
      resetButton: 'ሁሉንም ቪዲዮዎች አሳይ',
    },
    channel: {
      subscribers: 'ተከታዮች',
      videos: 'ቪዲዮዎች',
      views: 'እይታዎች',
      verified: 'የተረጋገጠ',
    },
    // ... Additional sections: hero, videos, modal, about, footer, error
  },
  en: {
    // Mirror of 'am' structure in English
  }
};
```

---

## 🔤 Ethiopic Typography Guidelines

1. **Font Family**: Amharic characters render using `Noto Sans Ethiopic` (`400`, `600`, `700`, `800` weights).
2. **Line Height**: Ethiopic script glyphs possess extended ascenders and descenders. Text containers enforce `line-height: 1.6` to prevent glyph clipping.
3. **Word Breaking**: Word breaks follow natural Amharic word spaces rather than hyphenation.
