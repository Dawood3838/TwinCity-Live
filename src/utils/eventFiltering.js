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
      [event.title, event.venue, event.city, event.category].some((value) =>
        value.toLocaleLowerCase().includes(query),
      )
    const startingPrice = getStartingPrice(event)

    return (
      matchesSearch &&
      (!category || event.category === category) &&
      (!city || event.city === city) &&
      (minPrice === null || startingPrice >= minPrice) &&
      (maxPrice === null || startingPrice <= maxPrice)
    )
  })

  return [...matchingEvents].sort((first, second) => {
    if (sort === 'date-desc') {
      return new Date(second.dateTime) - new Date(first.dateTime)
    }
    if (sort === 'price-asc') {
      return getStartingPrice(first) - getStartingPrice(second)
    }
    if (sort === 'price-desc') {
      return getStartingPrice(second) - getStartingPrice(first)
    }
    return new Date(first.dateTime) - new Date(second.dateTime)
  })
}
