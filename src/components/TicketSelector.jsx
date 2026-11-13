import { formatEventPrice } from '../utils/eventFormatting.js'

function TicketSelector({
  event,
  ticketTypeId,
  quantity,
  quantityError,
  statusMessage,
  isUpdating,
  onTicketTypeChange,
  onQuantityChange,
  onAddSelection,
}) {
  const selectedTicket = event.ticketTypes.find(
    (ticket) => ticket.id === ticketTypeId,
  )
  const selectedQuantity = Number(quantity)
  const subtotal =
    selectedTicket && Number.isFinite(selectedQuantity) && selectedQuantity > 0
      ? selectedTicket.price * selectedQuantity
      : 0

  return (
    <aside className="ticket-selector" aria-labelledby="ticket-selector-heading">
      <div className="ticket-selector-heading">
        <p className="eyebrow">YOUR EXPERIENCE</p>
        <h2 id="ticket-selector-heading">Choose your tickets</h2>
        <p>
          {event.availableTickets.toLocaleString()} tickets remain for this
          event. Each ticket type has its own availability.
        </p>
      </div>

      {event.ticketTypes.length > 0 ? (
        <form
          className="ticket-selector-form"
          onSubmit={(submitEvent) => {
            submitEvent.preventDefault()
            onAddSelection()
          }}
        >
          <fieldset className="ticket-type-fieldset">
            <legend>Ticket type</legend>
            <div className="ticket-type-options">
              {event.ticketTypes.map((ticket) => {
                const isAvailable = ticket.availableQuantity > 0
                const isSelected = ticket.id === ticketTypeId

                return (
                  <label
                    className={[
                      'ticket-option',
                      isSelected && 'ticket-option--selected',
                      !isAvailable && 'ticket-option--unavailable',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    htmlFor={`ticket-${event.id}-${ticket.id}`}
                    key={ticket.id}
                  >
                    <input
                      id={`ticket-${event.id}-${ticket.id}`}
                      type="radio"
                      name="ticket-type"
                      value={ticket.id}
                      checked={isSelected}
                      disabled={!isAvailable}
                      onChange={() => onTicketTypeChange(ticket.id)}
                    />
                    <span className="ticket-option-copy">
                      <strong>{ticket.name}</strong>
                      <span>{formatEventPrice(ticket.price)} per ticket</span>
                      <span>
                        {isAvailable
                          ? `${ticket.availableQuantity.toLocaleString()} available`
                          : 'Sold out — unavailable'}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {selectedTicket?.availableQuantity > 0 ? (
            <>
              <div className="ticket-quantity-section">
                <div className="ticket-quantity-heading">
                  <label htmlFor="ticket-quantity">Quantity</label>
                  <span>
                    Up to {selectedTicket.availableQuantity.toLocaleString()}{' '}
                    available
                  </span>
                </div>
                <div className="ticket-quantity-control">
                  <button
                    type="button"
                    aria-label={`Decrease quantity for ${selectedTicket.name}`}
                    disabled={selectedQuantity <= 1}
                    onClick={() =>
                      onQuantityChange(String(selectedQuantity - 1))
                    }
                  >
                    −
                  </button>
                  <input
                    id="ticket-quantity"
                    type="number"
                    min="1"
                    max={selectedTicket.availableQuantity}
                    step="1"
                    value={quantity}
                    aria-invalid={Boolean(quantityError)}
                    aria-describedby={
                      quantityError
                        ? 'ticket-quantity-help ticket-quantity-error'
                        : 'ticket-quantity-help'
                    }
                    onChange={(changeEvent) =>
                      onQuantityChange(changeEvent.target.value)
                    }
                  />
                  <button
                    type="button"
                    aria-label={`Increase quantity for ${selectedTicket.name}`}
                    disabled={selectedQuantity >= selectedTicket.availableQuantity}
                    onClick={() =>
                      onQuantityChange(String(selectedQuantity + 1))
                    }
                  >
                    +
                  </button>
                </div>
                <p id="ticket-quantity-help" className="ticket-quantity-help">
                  Choose at least one ticket and no more than the remaining
                  availability.
                </p>
              </div>

              {quantityError && (
                <p
                  className="ticket-validation-message"
                  id="ticket-quantity-error"
                  role="alert"
                >
                  <span aria-hidden="true">!</span> {quantityError}
                </p>
              )}

              <div className="ticket-subtotal" aria-live="polite">
                <span>
                  Subtotal ({Number.isFinite(selectedQuantity) ? selectedQuantity : 0}{' '}
                  {selectedQuantity === 1 ? 'ticket' : 'tickets'})
                </span>
                <strong>{formatEventPrice(subtotal)}</strong>
              </div>

              <button className="button button--accent ticket-add-button" type="submit">
                {isUpdating ? 'Update booking selection' : 'Add to booking'}
                <span aria-hidden="true">↗</span>
              </button>
            </>
          ) : (
            <p className="ticket-unavailable-message" role="status">
              This ticket type is sold out and cannot be selected. Choose an
              available option if one remains.
            </p>
          )}

          {statusMessage && (
            <p className="ticket-selection-status" role="status">
              <span aria-hidden="true">✓</span> {statusMessage}
            </p>
          )}
        </form>
      ) : (
        <p className="ticket-unavailable-message">
          Ticket options are not available for this event yet.
        </p>
      )}
    </aside>
  )
}

export default TicketSelector
