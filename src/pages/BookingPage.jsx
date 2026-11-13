import { Link } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'
import { formatEventDate, formatEventPrice } from '../utils/eventFormatting.js'

function BookingPage() {
  const { selections, ticketCount, removeSelection } = useBooking()
  const subtotal = selections.reduce(
    (total, selection) => total + selection.unitPrice * selection.quantity,
    0,
  )

  return (
    <section className="booking-page section-shell">
      <header className="booking-header">
        <p className="eyebrow">MY BOOKING</p>
        <h1>
          Your <span>selection.</span>
        </h1>
        <p>
          Review the tickets you’ve picked. This is only a selection preview;
          nothing has been booked or charged.
        </p>
      </header>

      {selections.length > 0 ? (
        <div className="booking-preview">
          <p className="booking-count">
            {ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'} selected
          </p>
          <div className="booking-selection-list">
            {selections.map((selection) => (
              <article
                className="booking-selection"
                key={`${selection.eventId}:${selection.ticketTypeId}`}
              >
                <div className="booking-selection-main">
                  <p className="eyebrow">{selection.eventCity}</p>
                  <h2>
                    <Link to={`/events/${selection.eventId}`}>
                      {selection.eventTitle}
                    </Link>
                  </h2>
                  <p className="booking-selection-meta">
                    {selection.ticketTypeName} · {selection.eventVenue}
                  </p>
                  <p className="booking-selection-meta">
                    {formatEventDate(selection.eventDateTime)}
                  </p>
                  <Link
                    className="booking-edit-link"
                    to={`/events/${selection.eventId}?ticketType=${encodeURIComponent(selection.ticketTypeId)}`}
                  >
                    Change ticket selection
                  </Link>
                </div>
                <div className="booking-selection-price">
                  <p>
                    {selection.quantity} × {formatEventPrice(selection.unitPrice)}
                  </p>
                  <strong>
                    {formatEventPrice(selection.quantity * selection.unitPrice)}
                  </strong>
                  <button
                    type="button"
                    onClick={() =>
                      removeSelection(selection.eventId, selection.ticketTypeId)
                    }
                    aria-label={`Remove ${selection.ticketTypeName} for ${selection.eventTitle}`}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="booking-subtotal">
            <span>Selection subtotal</span>
            <strong>{formatEventPrice(subtotal)}</strong>
          </div>
          <p className="booking-preview-note">
            No booking is submitted on this page.
          </p>
        </div>
      ) : (
        <div className="booking-empty">
          <span className="browse-message-icon" aria-hidden="true">✦</span>
          <h2>Your next outing starts here.</h2>
          <p>You haven’t added any tickets to your selection yet.</p>
          <Link className="button button--accent" to="/events">
            Explore events <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
    </section>
  )
}

export default BookingPage
