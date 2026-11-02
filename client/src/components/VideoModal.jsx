import { useEffect } from 'react';

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const formattedDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-header-title">{video.title}</h2>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            aria-label="Close video player"
          >
            ✕
          </button>
        </div>

        <div className="modal-video-wrapper">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            className="modal-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="modal-body">
          <div className="modal-meta-row">
            <span>{video.channelTitle || 'አሜን - AMEN'}</span>
            {formattedDate && <span>Published on {formattedDate}</span>}
          </div>

          {video.description && (
            <p className="modal-description">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
