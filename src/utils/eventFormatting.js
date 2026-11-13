const eventDateFormatter = new Intl.DateTimeFormat('en-PK', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Asia/Karachi',
})

const eventPriceFormatter = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0,
})

export function formatEventDate(dateTime) {
  return eventDateFormatter.format(new Date(dateTime))
}

export function formatEventPrice(price) {
  return `Rs ${eventPriceFormatter.format(price)}`
}

export function getStartingPrice(event) {
  return event.ticketTypes.reduce(
    (lowestPrice, ticket) => Math.min(lowestPrice, ticket.price),
    Number.POSITIVE_INFINITY,
  )
}
