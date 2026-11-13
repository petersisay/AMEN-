import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SplashLoader({
  logoUrl,
  isReady,
  onComplete,
}) {
  const { t, language } = useLanguage();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Guarantee at least 900ms for a smooth, cinematic entrance without flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  // When YouTube videos and API have successfully arrived and min time has passed, smooth exit
  useEffect(() => {
    if (isReady && minTimeElapsed && !isExiting) {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 500); // matches the 500ms CSS transition
      return () => clearTimeout(exitTimer);
    }
  }, [isReady, minTimeElapsed, isExiting]);

  return (
    <div
      className={`splash-loader-overlay ${isExiting ? 'splash-exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={t('states.loadingTitle')}
    >
      <div className="splash-ambient-bg" />

      <div className="splash-content">
        {/* Animated Rings & Halo */}
        <div className="splash-logo-container">
          <div className="splash-aura-pulse" />
          <div className="splash-aura-pulse delay-1" />
          <div className="splash-ring-outer" />
          <div className="splash-ring-middle" />

          {/* Central Logo Badge */}
          <div className="splash-logo-badge">
            <img
              src={logoUrl || '/logo.png'}
              alt="AMEN+ Logo"
              className="splash-logo-img"
              width="96"
              height="96"
            />
            <div className="splash-shimmer-sweep" />
          </div>
        </div>

        {/* Brand Title */}
        <div className="splash-brand-wrap">
          <h1 className="splash-title">
            <span className="splash-amen">AMEN</span>
            <span className="splash-plus">+</span>
          </h1>
          <span className="splash-amharic-tag">አሜን</span>
        </div>

        <p className="splash-subtitle">
          {language === 'am'
            ? 'የኢትዮጵያ ሐዋርያዊት ቤተክርስቲያን ሚዲያ'
            : 'Ethiopian Apostolic Church Media'}
        </p>

        {/* Dynamic Progress Indicator */}
        <div className="splash-progress-track">
          <div className="splash-progress-bar" />
        </div>

        {/* Loading Message */}
        <div className="splash-status">
          <span className="splash-status-text">
            {t('states.loadingTitle')}
          </span>
          <span className="splash-dots">
            <span className="dot dot-1">.</span>
            <span className="dot dot-2">.</span>
            <span className="dot dot-3">.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
