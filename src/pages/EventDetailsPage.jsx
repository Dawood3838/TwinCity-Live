import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import TicketSelector from '../components/TicketSelector.jsx'
import { useBooking } from '../context/BookingContext.jsx'
import { loadEventById } from '../services/eventService.js'
import { formatEventDate } from '../utils/eventFormatting.js'
import { validateTicketQuantity } from '../utils/ticketValidation.js'

function EventDetailsPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { selections, addOrUpdateSelection } = useBooking()
  const [event, setEvent] = useState(null)
  const [loadStatus, setLoadStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [ticketTypeId, setTicketTypeId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [quantityError, setQuantityError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const requestedTicketTypeId = searchParams.get('ticketType')
  const demoFailureRequested = searchParams.get('demoLoadError') === '1'

  useEffect(() => {
    let isCurrentRequest = true
    setLoadStatus('loading')
    setLoadError('')
    setEvent(null)

    loadEventById(id, {
      simulateFailure: demoFailureRequested && retryCount === 0,
    })
      .then((loadedEvent) => {
        if (isCurrentRequest) {
          setEvent(loadedEvent)
          setTicketTypeId(
            loadedEvent?.ticketTypes.find((ticket) => ticket.availableQuantity > 0)
              ?.id ??
              loadedEvent?.ticketTypes[0]?.id ??
              '',
          )
          setQuantity('1')
          setQuantityError('')
          setStatusMessage('')
          setLoadStatus(loadedEvent ? 'success' : 'not-found')
        }
      })
      .catch((error) => {
        if (isCurrentRequest) {
          setLoadError(error.message)
          setLoadStatus('error')
        }
      })

    return () => {
      isCurrentRequest = false
    }
  }, [demoFailureRequested, id, retryCount])

  const selectedTicket = event?.ticketTypes.find(
    (ticket) => ticket.id === ticketTypeId,
  )
  const existingSelection = selections.find(
    (selection) =>
      selection.eventId === event?.id &&
      selection.ticketTypeId === selectedTicket?.id,
  )

  useEffect(() => {
    if (existingSelection) {
      setQuantity(String(existingSelection.quantity))
    }
  }, [existingSelection])

  useEffect(() => {
    if (!event || !requestedTicketTypeId) {
      return
    }

    const requestedTicket = event.ticketTypes.find(
      (ticket) =>
        ticket.id === requestedTicketTypeId && ticket.availableQuantity > 0,
    )
    if (requestedTicket) {
      setTicketTypeId(requestedTicket.id)
    }
  }, [event, requestedTicketTypeId])

  const changeTicketType = (nextTicketTypeId) => {
    const nextSelection = selections.find(
      (selection) =>
        selection.eventId === event.id &&
        selection.ticketTypeId === nextTicketTypeId,
    )
    setTicketTypeId(nextTicketTypeId)
    setQuantity(String(nextSelection?.quantity ?? 1))
    setQuantityError('')
    setStatusMessage('')
  }

  const changeQuantity = (nextQuantity) => {
    setQuantity(nextQuantity)
    setStatusMessage('')
    const validation = selectedTicket
      ? validateTicketQuantity(
          Number(nextQuantity),
          selectedTicket.availableQuantity,
        )
      : { valid: false, message: 'Choose an available ticket type.' }
    setQuantityError(validation.valid ? '' : validation.message)
  }

  const addSelection = () => {
    if (!event || !selectedTicket) {
      setQuantityError('Choose an available ticket type.')
      return
    }

    const validation = validateTicketQuantity(
      Number(quantity),
      selectedTicket.availableQuantity,
    )
    if (!validation.valid) {
      setQuantityError(validation.message)
      setStatusMessage('')
      return
    }

    const result = addOrUpdateSelection({
      eventId: event.id,
      eventTitle: event.title,
      eventCity: event.city,
      eventVenue: event.venue,
      eventDateTime: event.dateTime,
      ticketTypeId: selectedTicket.id,
      ticketTypeName: selectedTicket.name,
      unitPrice: selectedTicket.price,
      quantity: Number(quantity),
      availableQuantity: selectedTicket.availableQuantity,
    })

    if (!result.valid) {
      setQuantityError(result.message)
      setStatusMessage('')
      return
    }

    setQuantityError('')
    setStatusMessage(
      existingSelection
        ? 'Your ticket selection has been updated in My Booking.'
        : 'Your tickets have been added to My Booking.',
    )
  }

  const retryLoading = () => {
    setLoadStatus('loading')
    setRetryCount((currentCount) => currentCount + 1)
  }

  if (loadStatus === 'loading') {
    return (
      <section className="event-page-state section-shell" aria-live="polite">
        <p className="eyebrow">EVENT DETAILS</p>
        <h1>Loading event details…</h1>
      </section>
    )
  }

  if (loadStatus === 'error') {
    return (
      <section className="event-page-state section-shell" role="alert">
        <p className="eyebrow">EVENT DETAILS</p>
        <h1>We couldn’t load this event.</h1>
        <p>{loadError || 'Please try again in a moment.'}</p>
        <button className="button button--accent" type="button" onClick={retryLoading}>
          Retry <span aria-hidden="true">↻</span>
        </button>
        <Link className="event-details-back" to="/events">
          ← Back to events
        </Link>
      </section>
    )
  }

  if (loadStatus === 'not-found') {
    return (
      <section className="event-page-state section-shell">
        <p className="eyebrow">EVENT NOT FOUND</p>
        <h1>We couldn’t find that event.</h1>
        <p>
          It may have moved or the event ID may be incorrect. Browse the current
          event list to find something else.
        </p>
        <Link className="button button--accent" to="/events">
          Browse events <span aria-hidden="true">↗</span>
        </Link>
      </section>
    )
  }

  return (
    <section className="event-details-page section-shell">
      <Link className="event-details-back" to="/events">
        <span aria-hidden="true">←</span> All events
      </Link>

      <div
        className={`event-details-art browse-event-art browse-event-art--${event.artwork.theme}`}
        role="img"
        aria-label={event.artwork.label}
      >
        <span className="browse-event-symbol" aria-hidden="true">
          {event.artwork.symbol}
        </span>
        <span className="browse-event-category">{event.category}</span>
        <span className="event-details-art-caption">TWINCITY LIVE · {event.city.toUpperCase()}</span>
      </div>

      <div className="event-details-layout">
        <article className="event-detail-information">
          <p className="eyebrow">{event.category.toUpperCase()} · {event.city.toUpperCase()}</p>
          <h1>{event.title}</h1>
          <p className="event-detail-lead">{event.shortDescription}</p>
          <p className="event-detail-description">{event.description}</p>

          <dl className="event-detail-facts">
            <div>
              <dt>Date &amp; time</dt>
              <dd>
                <time dateTime={event.dateTime}>
                  {formatEventDate(event.dateTime)}
                </time>
              </dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{event.venue}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>{event.city}</dd>
            </div>
            <div>
              <dt>Remaining availability</dt>
              <dd>{event.availableTickets.toLocaleString()} tickets</dd>
            </div>
            <div>
              <dt>Age guidance</dt>
              <dd>
                {event.minimumAge === null
                  ? 'All ages welcome'
                  : `Ages ${event.minimumAge}+`}
              </dd>
            </div>
          </dl>
        </article>

        <TicketSelector
          event={event}
          ticketTypeId={ticketTypeId}
          quantity={quantity}
          quantityError={quantityError}
          statusMessage={statusMessage}
          isUpdating={Boolean(existingSelection)}
          onTicketTypeChange={changeTicketType}
          onQuantityChange={changeQuantity}
          onAddSelection={addSelection}
        />
      </div>
    </section>
  )
}

export default EventDetailsPage
