export default function VideoCard({ video, onSelect }) {
  const thumbnailUrl =
    video.thumbnails?.high?.url ||
    video.thumbnails?.medium?.url ||
    video.thumbnails?.default?.url;

  const formattedDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <div
      className="video-card"
      onClick={() => onSelect(video)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(video);
      }}
      aria-label={`Play ${video.title}`}
    >
      <div className="thumbnail-wrapper">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="video-thumbnail"
            loading="lazy"
          />
        ) : (
          <div className="video-thumbnail" style={{ background: '#0F172A' }} />
        )}
        <div className="thumbnail-overlay">
          <div className="card-play-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title" title={video.title}>
          {video.title}
        </h3>
        {formattedDate && (
          <div className="card-meta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
