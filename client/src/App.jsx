import { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ChannelBar from './components/ChannelBar';
import VideoCard from './components/VideoCard';
import VideoModal from './components/VideoModal';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import SplashLoader from './components/SplashLoader';
import { fetchChannel, fetchVideos, getCachedInitialData } from './services/api';
import { useLanguage } from './context/LanguageContext';
import { filterVideos } from './utils/search';

export default function App() {
  const { t, language } = useLanguage();

  // Instant SWR cache initialization for fast initial opening
  const cachedInitial = useMemo(() => getCachedInitialData(), []);

  const [channel, setChannel] = useState(() => cachedInitial?.channel || null);
  const [videos, setVideos] = useState(() => cachedInitial?.videosData?.videos || []);
  const [nextPageToken, setNextPageToken] = useState(() => cachedInitial?.videosData?.nextPageToken || null);
  const [totalResults, setTotalResults] = useState(
    () => cachedInitial?.videosData?.pageInfo?.totalResults || cachedInitial?.videosData?.videos?.length || 0
  );

  // Approximate search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Animated brand logo preloader
  const [showSplash, setShowSplash] = useState(true);

  const [loading, setLoading] = useState(() => !cachedInitial);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [selectedVideo, setSelectedVideo] = useState(null);

  const loadInitialData = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(null);
    try {
      const [channelData, videosData] = await Promise.all([
        fetchChannel(),
        fetchVideos({ maxResults: 20 })
      ]);

      setChannel(channelData);
      setVideos(videosData.videos);
      setNextPageToken(videosData.nextPageToken);
      setTotalResults(videosData.pageInfo?.totalResults || videosData.videos.length);
    } catch (err) {
      console.error('Error loading AMEN+ data:', err);
      // Only set error on the screen if we don't have cached data to show
      if (!isBackground) {
        setError(err.message || 'Unable to connect to the AMEN+ backend.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If cached data was available, run fetch silently in background (Stale-While-Revalidate)
    const hasCache = Boolean(cachedInitial);
    loadInitialData(hasCache);
  }, [loadInitialData, cachedInitial]);

  const handleRetry = useCallback(() => {
    setError(null);
    setShowSplash(true);
    loadInitialData(false);
  }, [loadInitialData]);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const isDataReady = Boolean(channel && videos && videos.length > 0 && !error);

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore) return;

    setLoadingMore(true);
    try {
      const data = await fetchVideos({ pageToken: nextPageToken, maxResults: 10 });
      setVideos((prevVideos) => {
        const existingIds = new Set(prevVideos.map((v) => v.id));
        const newUnique = data.videos.filter((v) => !existingIds.has(v.id));
        return [...prevVideos, ...newUnique];
      });
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      console.error('Error loading more videos:', err);
      alert(t('states.loadMoreError', { error: err.message }));
    } finally {
      setLoadingMore(false);
    }
  };

  const channelUrl = channel?.customUrl
    ? `https://www.youtube.com/${channel.customUrl}`
    : channel?.id
    ? `https://www.youtube.com/channel/${channel.id}`
    : 'https://www.youtube.com/@amenapostolicmedia';

  const logoUrl =
    channel?.thumbnails?.medium?.url ||
    channel?.thumbnails?.default?.url ||
    '/logo.png';

  const featuredVideo = videos[0] || null;

  const filteredVideos = useMemo(() => {
    return filterVideos(videos, searchQuery);
  }, [videos, searchQuery]);

  const isSearching = Boolean(searchQuery.trim());
  const numLocale = language === 'am' ? 'am-ET' : 'en-US';
  const displayCount = filteredVideos.length.toLocaleString(numLocale);
  const displayTotal = (totalResults || videos.length).toLocaleString(numLocale);

  const subtitleText = isSearching
    ? t('mediaGrid.searchCount', { count: displayCount, query: searchQuery.trim() })
    : t('mediaGrid.subtitle', { count: displayCount, total: displayTotal });

  return (
    <div className="amen-app">
      {showSplash && (
        <SplashLoader
          logoUrl={logoUrl}
          isReady={isDataReady}
          onComplete={handleSplashComplete}
        />
      )}

      <Header channelUrl={channelUrl} logoUrl={logoUrl} />

      <main>
        {loading ? (
          <div className="skeleton-container container" aria-busy="true" aria-label={t('states.loadingTitle')}>
            <div className="skeleton-hero shimmer" />
            <div className="skeleton-channel-bar shimmer" />
            <div className="skeleton-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card shimmer" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="state-container">
            <div className="state-title" style={{ color: '#EF4444' }}>{t('states.errorTitle')}</div>
            <p className="state-desc">{error}</p>
            <button type="button" className="btn-primary" onClick={handleRetry}>
              {t('states.retryBtn')}
            </button>
          </div>
        ) : (
          <>
            {featuredVideo && (
              <Hero video={featuredVideo} onWatch={setSelectedVideo} />
            )}

            <ChannelBar channel={channel} />

            <section className="videos-section" id="videos">
              <div className="container">
                <div className="section-header">
                  <div className="section-title-wrap">
                    <h2 className="section-title">{t('mediaGrid.title')}</h2>
                    <span className="section-subtitle">{subtitleText}</span>
                  </div>

                  <div className="video-search-wrap">
                    <div className="search-input-group">
                      <svg
                        className="search-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        className="search-input"
                        placeholder={t('mediaGrid.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label={t('mediaGrid.searchAria')}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          className="search-clear-btn"
                          onClick={() => setSearchQuery('')}
                          aria-label={t('mediaGrid.clearSearch')}
                          title={t('mediaGrid.clearSearch')}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {filteredVideos.length > 0 ? (
                  <div className="video-grid">
                    {filteredVideos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onSelect={setSelectedVideo}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="search-empty-state">
                    <div className="search-empty-icon-wrap">
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--accent-gold)"
                        strokeWidth="1.75"
                        aria-hidden="true"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                    <h3 className="search-empty-title">{t('mediaGrid.noResultsTitle')}</h3>
                    <p className="search-empty-desc">
                      {t('mediaGrid.noResultsDesc', { query: searchQuery })}
                    </p>
                    <button
                      type="button"
                      className="btn-reset-search"
                      onClick={() => setSearchQuery('')}
                    >
                      {t('mediaGrid.resetSearch')}
                    </button>
                  </div>
                )}

                {nextPageToken && !isSearching && (
                  <div className="load-more-wrapper">
                    <button
                      type="button"
                      className="btn-load-more"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', margin: 0, borderWidth: '2px' }} />
                          <span>{t('mediaGrid.loadingMore')}</span>
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                          <span>{t('mediaGrid.loadMore')}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </section>

            <AboutSection channel={channel} channelUrl={channelUrl} />
          </>
        )}
      </main>

      <Footer channelUrl={channelUrl} logoUrl={logoUrl} />

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
