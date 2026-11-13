import { getStartingPrice } from './eventFormatting.js'

export function filterAndSortEvents(
  events,
  {
    search = '',
    category = '',
    city = '',
    sort = 'date-asc',
    minPrice = null,
    maxPrice = null,
  } = {},
) {
  const query = search.trim().toLocaleLowerCase()
  const matchingEvents = events.filter((event) => {
    const matchesSearch =
      !query ||
      [event.title, event.venue, event.city, event.category].some(
        (value) =>
          typeof value === 'string' &&
          value.toLocaleLowerCase().includes(query),
      )
    const startingPrice = getStartingPrice(event)

    return (
      matchesSearch &&
      (!category || event.category === category) &&
      (!city || event.city === city) &&
      (minPrice === null ||
        (startingPrice !== null && startingPrice >= minPrice)) &&
      (maxPrice === null ||
        (startingPrice !== null && startingPrice <= maxPrice))
    )
  })

  return [...matchingEvents].sort((first, second) => {
    if (sort === 'date-desc') {
      return compareEventDates(first, second, -1)
    }
    if (sort === 'price-asc') {
      return compareEventPrices(first, second, 1)
    }
    if (sort === 'price-desc') {
      return compareEventPrices(first, second, -1)
    }
    return compareEventDates(first, second, 1)
  })
}

function compareEventDates(first, second, direction) {
  const firstDate = getEventTimestamp(first)
  const secondDate = getEventTimestamp(second)
  if (!Number.isFinite(firstDate)) {
    return Number.isFinite(secondDate) ? 1 : 0
  }
  if (!Number.isFinite(secondDate)) {
    return -1
  }
  return direction * (firstDate - secondDate)
}

function getEventTimestamp(event) {
  if (
    event?.dateTime === null ||
    event?.dateTime === undefined ||
    event?.dateTime === ''
  ) {
    return Number.NaN
  }

  const timestamp = new Date(event.dateTime).getTime()
  return Number.isFinite(timestamp) ? timestamp : Number.NaN
}

function compareEventPrices(first, second, direction) {
  const firstPrice = getStartingPrice(first)
  const secondPrice = getStartingPrice(second)
  if (firstPrice === null) {
    return secondPrice === null ? 0 : 1
  }
  if (secondPrice === null) {
    return -1
  }
  return direction * (firstPrice - secondPrice)
}
