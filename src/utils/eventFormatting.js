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
  if (dateTime === null || dateTime === undefined || dateTime === '') {
    return 'Date and time to be announced'
  }

  const date = new Date(dateTime)
  return Number.isFinite(date.getTime())
    ? eventDateFormatter.format(date)
    : 'Date and time to be announced'
}

export function formatEventPrice(price) {
  return `Rs ${eventPriceFormatter.format(price)}`
}

export function getStartingPrice(event) {
  const ticketTypes = Array.isArray(event?.ticketTypes)
    ? event.ticketTypes
    : []
  const prices = ticketTypes
    .map((ticket) => ticket?.price)
    .filter((price) => Number.isFinite(price) && price >= 0)

  return prices.length > 0 ? Math.min(...prices) : null
}
