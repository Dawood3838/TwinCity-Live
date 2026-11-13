import { Link, useLocation } from 'react-router-dom'
import { formatEventDate, formatEventPrice } from '../utils/eventFormatting.js'

function ConfirmationPage() {
  const location = useLocation()
  const booking = location.state?.booking
  const hasBooking =
    booking &&
    typeof booking.reference === 'string' &&
    Array.isArray(booking.selections) &&
    booking.selections.length > 0 &&
    booking.totals &&
    Number.isFinite(booking.totals.total)

  if (!hasBooking) {
    return (
      <section className="confirmation-page section-shell">
        <p className="eyebrow">CONFIRMATION</p>
        <h1>No recent <span>booking found.</span></h1>
        <p>
          A booking confirmation is available only after completing a valid
          booking in this session. No payment has been taken.
        </p>
        <Link className="button button--accent" to="/events">
          Browse events <span aria-hidden="true">↗</span>
        </Link>
      </section>
    )
  }

  return (
    <section className="confirmation-page section-shell">
      <p className="eyebrow">BOOKING CONFIRMED</p>
      <h1>Your plans are <span>all set.</span></h1>
      <p>
        Your simulated booking is confirmed. No payment has been taken.
      </p>
      <div className="confirmation-reference">
        <span>Booking reference</span>
        <strong>{booking.reference}</strong>
      </div>

      <section className="confirmation-summary" aria-labelledby="confirmed-tickets-heading">
        <div className="confirmation-summary-heading">
          <div>
            <p className="eyebrow">YOUR EXPERIENCE</p>
            <h2 id="confirmed-tickets-heading">Confirmed tickets</h2>
          </div>
          <span>
            {booking.totals.ticketCount}{' '}
            {booking.totals.ticketCount === 1 ? 'ticket' : 'tickets'}
          </span>
        </div>

        <ul className="confirmation-ticket-list">
          {booking.selections.map((selection) => (
            <li
              className="confirmation-ticket"
              key={`${selection.eventId}:${selection.ticketTypeId}`}
            >
              <div>
                <h3>{selection.eventTitle}</h3>
                <p>
                  {selection.ticketTypeName} · {selection.quantity} ×{' '}
                  {formatEventPrice(selection.unitPrice)}
                </p>
                <p>
                  {selection.eventVenue} · {formatEventDate(selection.eventDateTime)}
                </p>
              </div>
              <strong>
                {formatEventPrice(selection.quantity * selection.unitPrice)}
              </strong>
            </li>
          ))}
        </ul>

        <dl className="booking-totals confirmation-totals">
          <div>
            <dt>Booking subtotal</dt>
            <dd>{formatEventPrice(booking.totals.subtotal)}</dd>
          </div>
          <div>
            <dt>Service fee</dt>
            <dd>{formatEventPrice(booking.totals.serviceFee)}</dd>
          </div>
          <div className="booking-final-total">
            <dt>Total</dt>
            <dd>{formatEventPrice(booking.totals.total)}</dd>
          </div>
        </dl>
      </section>

      <Link className="button button--accent" to="/events">
        Browse more events <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}

export default ConfirmationPage
