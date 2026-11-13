import { useLanguage } from '../context/LanguageContext';

export default function ChannelBar({ channel }) {
  const { t, language } = useLanguage();
  if (!channel) return null;

  const avatarUrl =
    channel.thumbnails?.medium?.url ||
    channel.thumbnails?.default?.url ||
    channel.thumbnails?.high?.url;

  const numLocale = language === 'am' ? 'am-ET' : 'en-US';

  const subscribers = channel.statistics?.subscriberCount
    ? parseInt(channel.statistics.subscriberCount, 10).toLocaleString(numLocale)
    : null;

  const videoCount = channel.statistics?.videoCount
    ? parseInt(channel.statistics.videoCount, 10).toLocaleString(numLocale)
    : null;

  return (
    <div className="channel-bar">
      <div className="container">
        <div className="channel-bar-inner">
          <div className="channel-profile">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={channel.title}
                className="channel-avatar"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="channel-details">
              <h2>
                {channel.title}
                <svg
                  className="verified-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  role="img"
                  aria-label={t('channelBar.verifiedTitle')}
                >
                  <title>{t('channelBar.verifiedTitle')}</title>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </h2>
              {channel.customUrl && (
                <span className="channel-handle">{channel.customUrl}</span>
              )}
            </div>
          </div>

          <div className="channel-stats">
            {subscribers && (
              <div className="stat-item">
                <span className="stat-value">{subscribers}</span>
                <span className="stat-label">{t('channelBar.subscribers')}</span>
              </div>
            )}
            {videoCount && (
              <div className="stat-item">
                <span className="stat-value">{videoCount}</span>
                <span className="stat-label">{t('channelBar.videos')}</span>
              </div>
            )}
            <div className="stat-item">
              <span className="stat-value">{t('channelBar.apostolic')}</span>
              <span className="stat-label">{t('channelBar.mediaMinistry')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
