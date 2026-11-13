import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ channelUrl, logoUrl }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="logo-wrapper">
          <div className="logo-badge">
            <img
              src={logoUrl || '/logo.png'}
              alt="AMEN Logo"
              className="logo-img"
              width="38"
              height="38"
            />
          </div>
          <div className="logo-text">
            <span>AMEN</span>
            <span className="logo-plus">+</span>
            <span className="logo-tag">አሜን</span>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#home" className="nav-link active">{t('nav.home')}</a>
          <a href="#videos" className="nav-link">{t('nav.videos')}</a>
          <a href="#about" className="nav-link">{t('nav.about')}</a>
        </nav>

        <div className="header-actions">
          {/* Language Toggle Button */}
          <button
            type="button"
            className="btn-lang-toggle"
            onClick={toggleLanguage}
            aria-label={t('nav.langToggle')}
            title={t('nav.langToggle')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="lang-label">{language === 'am' ? 'English' : 'አማርኛ'}</span>
          </button>

          {channelUrl && (
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-youtube-link"
              title={t('nav.visitYoutube')}
            >
              <span>{t('nav.youtube')}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
              </svg>
            </a>
          )}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t('nav.menuToggle')}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-nav" className="mobile-nav open" aria-label="Mobile Navigation">
          <a
            href="#home"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.home')}
          </a>
          <a
            href="#videos"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.videos')}
          </a>
          <a
            href="#about"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.about')}
          </a>

          <button
            type="button"
            className="btn-lang-toggle mobile-lang-toggle"
            onClick={() => {
              toggleLanguage();
              setMobileMenuOpen(false);
            }}
            aria-label={t('nav.langToggle')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{language === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}</span>
          </button>
        </nav>
      )}
    </header>
  );
}
