import { useLanguage } from '../context/LanguageContext';

export default function Footer({ channelUrl, logoUrl }) {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="logo-wrapper" style={{ fontSize: '1.1rem' }}>
            <div className="logo-badge" style={{ width: '1.85rem', height: '1.85rem' }}>
              <img src={logoUrl || '/logo.png'} alt="AMEN Logo" className="logo-img" />
            </div>
            <span>AMEN<span className="logo-plus">+</span></span>
          </div>
          <span className="footer-copy">
            {t('footer.copyright', { year: currentYear })}
          </span>
        </div>

        <div className="footer-links">
          <a href="#home" className="footer-link">{t('nav.home')}</a>
          <a href="#videos" className="footer-link">{t('nav.videos')}</a>
          <a href="#about" className="footer-link">{t('nav.about')}</a>
          {channelUrl && (
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {t('footer.officialYoutube')}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
