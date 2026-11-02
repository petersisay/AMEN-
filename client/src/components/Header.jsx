import { useState } from 'react';

export default function Header({ channelUrl, logoUrl }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="logo-wrapper">
          <div className="logo-badge">
            <img src={logoUrl || '/logo.png'} alt="AMEN Logo" className="logo-img" />
          </div>
          <div className="logo-text">
            <span>AMEN</span>
            <span className="logo-plus">+</span>
            <span className="logo-tag">አሜን</span>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#videos" className="nav-link">Videos</a>
          <a href="#about" className="nav-link">About</a>
        </nav>

        <div className="header-actions">
          {channelUrl && (
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-youtube-link"
            >
              <span>YouTube</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
              </svg>
            </a>
          )}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav open">
          <a
            href="#home"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#videos"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Videos
          </a>
          <a
            href="#about"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
        </div>
      )}
    </header>
  );
}
