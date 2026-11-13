import { Link } from 'react-router-dom'
import {
  formatEventDate,
  formatEventPrice,
  getStartingPrice,
} from '../utils/eventFormatting.js'

function EventCard({ event }) {
  const startingPrice = getStartingPrice(event)

  return (
    <article className="browse-event-card">
      <div
        className={`browse-event-art browse-event-art--${event.artwork.theme}`}
        role="img"
        aria-label={event.artwork.label}
      >
        <span className="browse-event-symbol" aria-hidden="true">
          {event.artwork.symbol}
        </span>
        <span className="browse-event-category">{event.category}</span>
      </div>
      <div className="browse-event-content">
        <p className="browse-event-location">
          <span aria-hidden="true">⌖</span> {event.city}
        </p>
        <h2>{event.title}</h2>
        <p className="browse-event-description">{event.shortDescription}</p>
        <p className="browse-event-venue">{event.venue}</p>
        <time className="browse-event-date" dateTime={event.dateTime}>
          {formatEventDate(event.dateTime)}
        </time>
        <div className="browse-event-bottom">
          <div className="browse-event-price">
            <span>Starting from</span>
            <strong>
              {startingPrice === null
                ? 'Price unavailable'
                : formatEventPrice(startingPrice)}
            </strong>
          </div>
          <span className="browse-event-availability">
            {event.availableTickets === null
              ? 'Availability unavailable'
              : `${event.availableTickets.toLocaleString()} available`}
          </span>
        </div>
        <Link className="browse-event-action" to={`/events/${event.id}`}>
          View event <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  )
}

export default EventCard
