import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ChannelBar from './components/ChannelBar';
import VideoCard from './components/VideoCard';
import VideoModal from './components/VideoModal';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import { fetchChannel, fetchVideos } from './services/api';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t, language } = useLanguage();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [selectedVideo, setSelectedVideo] = useState(null);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
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
      setError(err.message || 'Unable to connect to the AMEN+ backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

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

  const numLocale = language === 'am' ? 'am-ET' : 'en-US';
  const displayCount = videos.length.toLocaleString(numLocale);
  const displayTotal = (totalResults || videos.length).toLocaleString(numLocale);

  return (
    <div className="amen-app">
      <Header channelUrl={channelUrl} logoUrl={logoUrl} />

      <main>
        {loading ? (
          <div className="state-container">
            <div className="spinner" />
            <h2 className="state-title">{t('states.loadingTitle')}</h2>
            <p className="state-desc">{t('states.loadingDesc')}</p>
          </div>
        ) : error ? (
          <div className="state-container">
            <div className="state-title" style={{ color: '#EF4444' }}>{t('states.errorTitle')}</div>
            <p className="state-desc">{error}</p>
            <button type="button" className="btn-primary" onClick={loadInitialData}>
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
                    <span className="section-subtitle">
                      {t('mediaGrid.subtitle', { count: displayCount, total: displayTotal })}
                    </span>
                  </div>
                </div>

                <div className="video-grid">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onSelect={setSelectedVideo}
                    />
                  ))}
                </div>

                {nextPageToken && (
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
