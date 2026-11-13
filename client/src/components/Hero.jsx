import { useLanguage } from '../context/LanguageContext';

export default function Hero({ video, onWatch }) {
  const { t, formatDate } = useLanguage();
  if (!video) return null;

  const thumbnailUrl =
    video.thumbnails?.maxres?.url ||
    video.thumbnails?.high?.url ||
    video.thumbnails?.medium?.url ||
    video.thumbnails?.default?.url;

  const formattedDate = formatDate(video.publishedAt);

  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-card">
          <div
            className="hero-media-wrapper"
            onClick={() => onWatch(video)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onWatch(video);
            }}
            aria-label={t('hero.watchAria', { title: video.title })}
          >
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt={video.title}
                className="hero-image"
                loading="eager"
              />
            )}
            <div className="hero-play-overlay">
              <div className="play-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="hero-content">
            <span className="badge-featured">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {t('hero.latestRelease')}
            </span>

            <h1 className="hero-title">{video.title}</h1>

            <div className="hero-meta">
              <span>{video.channelTitle || t('hero.channelDefault')}</span>
              {formattedDate && (
                <>
                  <span className="hero-meta-dot" />
                  <span>{formattedDate}</span>
                </>
              )}
            </div>

            {video.description && (
              <p className="hero-description">{video.description}</p>
            )}

            <div className="hero-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => onWatch(video)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {t('hero.watchNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
