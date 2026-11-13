import { Link } from 'react-router-dom'

const featuredEvents = [
  {
    date: 'FRI, 24 MAY',
    category: 'LIVE MUSIC',
    title: 'The Sound of Summer',
    venue: 'Lake View Park, Islamabad',
    time: '7:30 PM onwards',
    tone: 'event-card--sunset',
    art: '♫',
    label: 'An open-air evening',
  },
  {
    date: 'SAT, 01 JUN',
    category: 'CREATIVE',
    title: 'Make Space: The Makers Market',
    venue: 'The Hive, Islamabad',
    time: '11:00 AM – 6:00 PM',
    tone: 'event-card--garden',
    art: '✳',
    label: 'A little room to create',
  },
  {
    date: 'SUN, 09 JUN',
    category: 'FOOD & CULTURE',
    title: 'Flavours of the Twin Cities',
    venue: 'Ayub National Park, Rawalpindi',
    time: '1:00 PM onwards',
    tone: 'event-card--citrus',
    art: '✺',
    label: 'Come hungry, leave happy',
  },
]

const categories = [
  ['♫', 'Concerts', 'Live sounds, loud memories'],
  ['✳', 'Workshops', 'Pick up something new'],
  ['▧', 'Exhibitions', 'Art, ideas & everything between'],
  ['◎', 'Conferences', 'Meet minds that move you'],
  ['↗', 'Sports', 'Feel every second'],
  ['✺', 'Festivals', 'Make a day of it'],
  ['✦', 'Entertainment', 'A little something different'],
]

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-glow hero-glow--one" aria-hidden="true" />
        <div className="hero-glow hero-glow--two" aria-hidden="true" />
        <div className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow eyebrow--light">
              <span className="live-dot" /> ISLAMABAD & RAWALPINDI
            </p>
            <h1>
              Make room
              <br />
              for <span>something</span>
              <br />
              unforgettable.
            </h1>
            <p className="hero-tagline">Discover events. Book your experience.</p>
            <p className="hero-description">
              From a night out to a new perspective, find the moments worth
              showing up for across the Twin Cities.
            </p>
            <div className="hero-actions">
              <Link className="button button--accent" to="/events">
                Explore events <span aria-hidden="true">↗</span>
              </Link>
              <span className="hero-footnote">
                <span aria-hidden="true">✦</span> Your city, a little more alive
              </span>
            </div>
          </div>

          <div
            className="hero-art"
            role="img"
            aria-label="Illustration of a live event at sunset"
          >
            <div className="art-sun" />
            <div className="art-orbit art-orbit--one" />
            <div className="art-orbit art-orbit--two" />
            <div className="art-mountain art-mountain--back" />
            <div className="art-mountain art-mountain--front" />
            <div className="art-stage">
              <span className="stage-light stage-light--left" />
              <span className="stage-light stage-light--right" />
              <span className="stage-roof" />
              <span className="stage-screen">
                <span>LIVE</span>
              </span>
            </div>
            <div className="art-crowd" />
            <div className="art-caption">
              <span className="caption-pulse" />
              <span>
                <strong>THE CITY IS YOURS</strong>
                <small>Make a night of it</small>
              </span>
              <span className="caption-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="art-date">
              <span>GOOD THINGS</span>
              <strong>HAPPEN<br />HERE</strong>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <span>01 — YOUR NEXT GREAT STORY</span>
          <span className="hero-bottom-line" />
          <span>33.6844° N &nbsp; 73.0479° E</span>
        </div>
      </section>

      <section className="featured-section section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE CITY, ON YOUR CALENDAR</p>
            <h2>Plans worth <span>getting dressed for.</span></h2>
          </div>
          <Link className="text-link" to="/events">
            See all events <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="event-grid">
          {featuredEvents.map((event) => (
            <article className="event-card" key={event.title}>
              <div className={`event-art ${event.tone}`} aria-hidden="true">
                <span className="event-art-label">{event.label}</span>
                <span className="event-art-symbol">{event.art}</span>
                <span className="event-date">{event.date}</span>
              </div>
              <div className="event-card-content">
                <p className="eyebrow">{event.category}</p>
                <h3>{event.title}</h3>
                <p className="event-venue">{event.venue}</p>
                <div className="event-card-meta">
                  <span>{event.time}</span>
                  <Link to="/events" aria-label={`Explore events like ${event.title}`}>
                    ↗
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="sample-note">
          Featured events are sample listings for this preview.
        </p>
      </section>

      <section className="category-section">
        <div className="section-shell">
          <div className="section-heading category-heading">
            <div>
              <p className="eyebrow eyebrow--light">FOLLOW YOUR CURIOSITY</p>
              <h2>A city of <span>many moods.</span></h2>
            </div>
            <p className="category-intro">
              Big energy or slow Sunday? Whatever you’re in the mood for, there’s
              something happening around the corner.
            </p>
          </div>
          <div className="category-grid">
            {categories.map(([icon, name, description], index) => (
              <Link className="category-card" to="/events" key={name}>
                <span className="category-number">0{index + 1}</span>
                <span className="category-icon" aria-hidden="true">{icon}</span>
                <span className="category-name">{name}</span>
                <span className="category-description">{description}</span>
                <span className="category-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-cta">
        <div className="closing-cta-inner">
          <div>
            <p className="eyebrow eyebrow--light">YOUR CITY IS CALLING</p>
            <h2>Don’t just make plans.<br /><span>Make a moment.</span></h2>
          </div>
          <Link className="button button--light" to="/events">
            Find your next event <span aria-hidden="true">↗</span>
          </Link>
          <span className="cta-star cta-star--one" aria-hidden="true">✳</span>
          <span className="cta-star cta-star--two" aria-hidden="true">✦</span>
        </div>
      </section>
    </>
  )
}

export default HomePage
