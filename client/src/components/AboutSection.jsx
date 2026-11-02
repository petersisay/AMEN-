export default function AboutSection({ channel, channelUrl }) {
  if (!channel) return null;

  const telegramUrl = 'https://t.me/AmenApostolicMedia';

  // Helper to detect URLs in the description and render them as interactive links
  const renderDescription = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const isTelegram = part.toLowerCase().includes('t.me');
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={isTelegram ? 'inline-link-badge' : 'text-link'}
          >
            {isTelegram && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            )}
            <span>{part}</span>
          </a>
        );
      }
      return part;
    });
  };

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-card">
          <div className="about-info">
            <h2>ስለ {channel.title}</h2>

            <div className="about-description">
              {channel.description ? (
                renderDescription(channel.description)
              ) : (
                <p>
                  አሜን ሚዲያ የኢትዮጵያ ሐዋርያዊት ቤተክርስቲያን የወንጌል ማሰራጫ፣ ትምህርቶች እና መዝሙራት የሚቀርቡበት ይፋዊ መድረክ ነው።
                </p>
              )}
            </div>

            <div className="about-features">
              <div className="about-feature-item">
                <h4>
                  <span>📖</span>
                  <span>የቃሉ ትምህርቶችና ስብከቶች</span>
                </h4>
                <p>
                  በመንፈሳዊ አባቶችና አገልጋዮች የሚቀርቡ መጽሐፍ ቅዱሳዊና ሐዋርያዊ ትምህርቶች።
                </p>
              </div>

              <div className="about-feature-item">
                <h4>
                  <span>🎵</span>
                  <span>ሐዋርያዊ ዝማሬዎች</span>
                </h4>
                <p>
                  መንፈስን የሚያድሱ የማኅበርና የጥምር መዘምራን መንፈሳዊ መዝሙራት።
                </p>
              </div>

              <div className="about-feature-item">
                <h4>
                  <span>🌍</span>
                  <span>የዲጂታል ሚዲያ አገልግሎት</span>
                </h4>
                <p>
                  በዩቲዩብ እና ቴሌግራም አማካኝነት በዓለም ዙሪያ ላሉ ምዕመናን ወቅታዊ መልእክቶችን ማድረስ።
                </p>
              </div>
            </div>
          </div>

          <div className="about-callout">
            <h3>ተከታተሉን</h3>
            <p>
              አዳዲስ ትምህርቶችን፣ የስብከት ክፍሎችን እና ዝማሬዎችን ለማግኘት ይፋዊ ማኅበራዊ ገጾቻችንን ይቀላቀሉ።
            </p>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-telegram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              <span>በ Telegram ይቀላቀሉ</span>
            </a>

            {channelUrl && (
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                <span>በ YouTube ሰብስክራይብ ያድርጉ</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
