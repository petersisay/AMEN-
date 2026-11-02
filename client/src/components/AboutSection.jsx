export default function AboutSection({ channel, channelUrl }) {
  if (!channel) return null;

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-card">
          <div className="about-info">
            <h2>ስለ {channel.title}</h2>
            {channel.description ? (
              <p className="about-description">{channel.description}</p>
            ) : (
              <p className="about-description">
                አሜን ሚዲያ የኢትዮጵያ ሐዋርያዊት ቤተክርስቲያን የወንጌል ማሰራጫ፣ ትምህርቶች እና መዝሙራት የሚቀርቡበት ይፋዊ መድረክ ነው።
              </p>
            )}
          </div>

          <div className="about-callout">
            <h3>ተከታተሉን</h3>
            <p>
              አዳዲስ ትምህርቶችን፣ የስብከት ክፍሎችን እና ዝማሬዎችን ለማግኘት የዩቲዩብ ቻናላችንን ሰብስክራይብ ያድርጉ።
            </p>
            {channelUrl && (
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                በ YouTube ሰብስክራይብ ያድርጉ
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
