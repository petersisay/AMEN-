export default function Footer({ channelUrl }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="logo-wrapper" style={{ fontSize: '1.1rem' }}>
            <span className="logo-badge" style={{ width: '1.8rem', height: '1.8rem', fontSize: '0.9rem' }}>✝</span>
            <span>AMEN<span className="logo-plus">+</span></span>
          </div>
          <span className="footer-copy">
            © {currentYear} አሜን (AMEN) Media Ministry. All rights reserved.
          </span>
        </div>

        <div className="footer-links">
          <a href="#home" className="footer-link">Home</a>
          <a href="#videos" className="footer-link">Videos</a>
          <a href="#about" className="footer-link">About</a>
          {channelUrl && (
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Official YouTube Channel
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
