import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function VideoModal({ video, onClose }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const { t, formatDate } = useLanguage();

  useEffect(() => {
    const previousActiveElement = document.activeElement;
    closeBtnRef.current?.focus();

    return () => {
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const modalEl = modalRef.current;
        if (!modalEl) return;

        const focusableElements = modalEl.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const formattedDate = formatDate(video.publishedAt, { month: 'long' });

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-video-title"
    >
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2 className="modal-header-title" id="modal-video-title">{video.title}</h2>
          <button
            type="button"
            ref={closeBtnRef}
            className="btn-close-modal"
            onClick={onClose}
            aria-label={t('modal.closeAria')}
          >
            <span aria-hidden="true">✕</span>
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
            <span>{video.channelTitle || t('modal.channelDefault')}</span>
            {formattedDate && <span>{t('modal.publishedOn', { date: formattedDate })}</span>}
          </div>

          {video.description && (
            <p className="modal-description">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
