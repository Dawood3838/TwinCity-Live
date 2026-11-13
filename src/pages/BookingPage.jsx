import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'
import events from '../data/events.js'
import { formatEventDate, formatEventPrice } from '../utils/eventFormatting.js'
import { validateAgeEligibility } from '../utils/ageEligibility.js'
import { calculateBookingTotals } from '../utils/bookingPricing.js'

const initialAttendee = {
  fullName: '',
  email: '',
  age: '',
}

function validateFullName(fullName) {
  const parts = fullName.trim().split(/\s+/)
  const validPart = /^[\p{L}\p{M}]+(?:[-'’][\p{L}\p{M}]+)*\.?$/u

  if (!fullName.trim()) {
    return 'Enter your full name.'
  }
  if (parts.length < 2 || !parts.every((part) => validPart.test(part))) {
    return 'Enter a first and last name using letters.'
  }
  return ''
}

function validateEmail(email) {
  if (!email.trim()) {
    return 'Enter your email address.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
    return 'Enter a valid email address, such as name@example.com.'
  }
  return ''
}

function BookingPage() {
  const { selections, removeSelection } = useBooking()
  const [attendee, setAttendee] = useState(initialAttendee)
  const [fieldErrors, setFieldErrors] = useState({})
  const [bookingError, setBookingError] = useState('')
  const [reviewedSelectionKey, setReviewedSelectionKey] = useState('')

  const totals = calculateBookingTotals(selections)
  const selectedEvents = useMemo(() => {
    const selectedEventIds = new Set(selections.map((selection) => selection.eventId))
    return events.filter((event) => selectedEventIds.has(event.id))
  }, [selections])
  const ageEligibility = validateAgeEligibility(attendee.age, selectedEvents)
  const selectionKey = selections
    .map(
      (selection) =>
        `${selection.eventId}:${selection.ticketTypeId}:${selection.quantity}`,
    )
    .join('|')
  const isBookingReady =
    Boolean(selectionKey) && reviewedSelectionKey === selectionKey

  const handleAttendeeChange = (event) => {
    const { name, value } = event.target
    setAttendee((currentAttendee) => ({
      ...currentAttendee,
      [name]: value,
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
    setBookingError('')
    setReviewedSelectionKey('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextFieldErrors = {
      fullName: validateFullName(attendee.fullName),
      email: validateEmail(attendee.email),
      age: ageEligibility.valid ? '' : ageEligibility.message,
    }
    setFieldErrors(nextFieldErrors)
    setReviewedSelectionKey('')

    if (selections.length === 0 || totals.ticketCount === 0) {
      setBookingError('Add at least one ticket before reviewing your booking.')
      return
    }

    if (Object.values(nextFieldErrors).some(Boolean)) {
      setBookingError('Please correct the highlighted fields to continue.')
      return
    }

    setBookingError('')
    setReviewedSelectionKey(selectionKey)
  }

  return (
    <section className="booking-page section-shell">
      <header className="booking-header">
        <p className="eyebrow">MY BOOKING</p>
        <h1>
          Your <span>booking details.</span>
        </h1>
        <p>
          Add attendee information and review your ticket selection. This is a
          preview only; no booking is submitted and no payment is collected.
        </p>
      </header>

      {selections.length === 0 && (
        <div className="booking-empty-notice" role="status">
          <strong>Your selection is empty.</strong>
          <span>Add an event ticket before continuing to a booking review.</span>
          <Link to="/events">Explore events</Link>
        </div>
      )}

      <div className="booking-workspace">
        <div className="booking-primary-column">
          <section className="booking-attendee-panel" aria-labelledby="attendee-heading">
            <div className="booking-panel-heading">
              <p className="eyebrow">ATTENDEE INFORMATION</p>
              <h2 id="attendee-heading">Who’s going?</h2>
              <p>One attendee is recorded for this preview booking.</p>
            </div>

            <form
              id="attendee-form"
              className="booking-attendee-form"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="booking-form-field">
                <label htmlFor="attendee-name">Full name</label>
                <input
                  id="attendee-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={attendee.fullName}
                  aria-invalid={Boolean(fieldErrors.fullName)}
                  aria-describedby={
                    fieldErrors.fullName ? 'attendee-name-error' : undefined
                  }
                  onChange={handleAttendeeChange}
                />
                {fieldErrors.fullName && (
                  <p className="booking-field-error" id="attendee-name-error">
                    <span aria-hidden="true">!</span> {fieldErrors.fullName}
                  </p>
                )}
              </div>

              <div className="booking-form-field">
                <label htmlFor="attendee-email">Email address</label>
                <input
                  id="attendee-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={attendee.email}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={
                    fieldErrors.email ? 'attendee-email-error' : undefined
                  }
                  onChange={handleAttendeeChange}
                />
                {fieldErrors.email && (
                  <p className="booking-field-error" id="attendee-email-error">
                    <span aria-hidden="true">!</span> {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="booking-form-field">
                <label htmlFor="attendee-age">Age</label>
                <input
                  id="attendee-age"
                  name="age"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={attendee.age}
                  aria-invalid={Boolean(fieldErrors.age)}
                  aria-describedby={[
                    'attendee-age-help',
                    fieldErrors.age ? 'attendee-age-error' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onChange={handleAttendeeChange}
                />
                <p className="booking-field-hint" id="attendee-age-help">
                  Age requirements are based on every event in your selection.
                </p>
                {fieldErrors.age && (
                  <p className="booking-field-error" id="attendee-age-error">
                    <span aria-hidden="true">!</span> {fieldErrors.age}
                  </p>
                )}
              </div>

              <div className="booking-age-requirements">
                <h3>Age requirements for your events</h3>
                {selectedEvents.length > 0 ? (
                  <ul>
                    {selectedEvents.map((event) => (
                      <li key={event.id}>
                        <span>{event.title}</span>
                        <strong>
                          {event.minimumAge === null
                            ? 'No minimum age'
                            : `${event.minimumAge}+ required`}
                        </strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Add events to see their age requirements.</p>
                )}
              </div>

              {bookingError && (
                <p className="booking-form-feedback" role="alert">
                  <span aria-hidden="true">!</span> {bookingError}
                </p>
              )}

              {isBookingReady && (
                <div className="booking-ready-message" role="status">
                  <strong>Your booking is ready for review.</strong>
                  <span>
                    Attendee details and the current ticket selection passed
                    validation. Nothing has been submitted.
                  </span>
                </div>
              )}

              <button
                className="button button--accent booking-submit-button"
                type="submit"
              >
                Review booking <span aria-hidden="true">↗</span>
              </button>
            </form>
          </section>

          <section className="booking-ticket-panel" aria-labelledby="tickets-heading">
            <div className="booking-panel-heading">
              <p className="eyebrow">YOUR SELECTION</p>
              <h2 id="tickets-heading">Selected tickets</h2>
            </div>
            {selections.length > 0 ? (
              <div className="booking-selection-list">
                {selections.map((selection) => (
                  <article
                    className="booking-selection"
                    key={`${selection.eventId}:${selection.ticketTypeId}`}
                  >
                    <div className="booking-selection-main">
                      <p className="eyebrow">{selection.eventCity}</p>
                      <h3>
                        <Link to={`/events/${selection.eventId}`}>
                          {selection.eventTitle}
                        </Link>
                      </h3>
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
                          removeSelection(
                            selection.eventId,
                            selection.ticketTypeId,
                          )
                        }
                        aria-label={`Remove ${selection.ticketTypeName} for ${selection.eventTitle}`}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="booking-ticket-empty">
                <p>No tickets are selected yet.</p>
                <Link to="/events">Browse events</Link>
              </div>
            )}
          </section>
        </div>

        <aside className="booking-pricing-panel" aria-labelledby="pricing-heading">
          <p className="eyebrow">ORDER SUMMARY</p>
          <h2 id="pricing-heading">Price summary</h2>
          <p className="booking-summary-ticket-count">
            {totals.ticketCount}{' '}
            {totals.ticketCount === 1 ? 'ticket' : 'tickets'} selected
          </p>
          {selections.length > 0 && (
            <ul className="booking-price-lines">
              {selections.map((selection) => (
                <li
                  key={`${selection.eventId}:${selection.ticketTypeId}`}
                  className="booking-price-line"
                >
                  <span>
                    <strong>{selection.eventTitle}</strong>
                    <small>
                      {selection.ticketTypeName} · {selection.quantity} ×{' '}
                      {formatEventPrice(selection.unitPrice)}
                    </small>
                  </span>
                  <b>
                    {formatEventPrice(selection.quantity * selection.unitPrice)}
                  </b>
                </li>
              ))}
            </ul>
          )}
          <dl className="booking-totals">
            <div>
              <dt>Booking subtotal</dt>
              <dd>{formatEventPrice(totals.subtotal)}</dd>
            </div>
            <div>
              <dt>Service fee</dt>
              <dd>{formatEventPrice(totals.serviceFee)}</dd>
            </div>
            <div className="booking-final-total">
              <dt>Total</dt>
              <dd>{formatEventPrice(totals.total)}</dd>
            </div>
          </dl>
          <p className="booking-service-note">
            A single Rs 100 service fee applies to a non-empty booking.
          </p>
          <p className="booking-preview-note">
            No payment is collected at this stage.
          </p>
        </aside>
      </div>
    </section>
  )
}

export default BookingPage
