export function parseAvailabilityDemo(search) {
  const value = new URLSearchParams(search).get('demoAvailability')
  if (!value) {
    return null
  }

  const separator = value.lastIndexOf(':')
  if (separator <= 0) {
    return null
  }

  const ticketTypeId = value.slice(0, separator)
  const quantityValue = value.slice(separator + 1)
  if (!/^\d+$/.test(quantityValue)) {
    return null
  }

  const availableQuantity = Number(quantityValue)
  if (!Number.isSafeInteger(availableQuantity)) {
    return null
  }

  return { ticketTypeId, availableQuantity }
}

export function applyAvailabilityDemo(eventList, availabilityDemo) {
  if (!availabilityDemo) {
    return eventList
  }

  const ticketExists = eventList.some((event) =>
    event.ticketTypes.some(
      (ticket) => ticket.id === availabilityDemo.ticketTypeId,
    ),
  )
  if (!ticketExists) {
    return eventList
  }

  return eventList.map((event) => {
    const hasChangedTicket = event.ticketTypes.some(
      (ticket) => ticket.id === availabilityDemo.ticketTypeId,
    )
    if (!hasChangedTicket) {
      return event
    }

    const ticketTypes = event.ticketTypes.map((ticket) =>
      ticket.id === availabilityDemo.ticketTypeId
        ? { ...ticket, availableQuantity: availabilityDemo.availableQuantity }
        : ticket,
    )

    return {
      ...event,
      ticketTypes,
      availableTickets: ticketTypes.reduce(
        (total, ticket) => total + ticket.availableQuantity,
        0,
      ),
    }
  })
}
