function textOrFallback(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export function getTotalTicketAvailability(ticketTypes) {
  if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
    return null
  }

  let total = 0
  for (const ticketType of ticketTypes) {
    if (
      !Number.isSafeInteger(ticketType.availableQuantity) ||
      ticketType.availableQuantity < 0
    ) {
      return null
    }

    total += ticketType.availableQuantity
    if (!Number.isSafeInteger(total)) {
      return null
    }
  }

  return total
}

export function normalizeEventContent(event) {
  const source = event && typeof event === 'object' ? event : {}
  const title = textOrFallback(source.title, 'Untitled event')
  const sourceTicketTypes = Array.isArray(source.ticketTypes)
    ? source.ticketTypes.filter(
        (ticketType) => ticketType && typeof ticketType === 'object',
      )
    : []
  const ticketTypes = sourceTicketTypes.map((ticketType) => ({
    ...ticketType,
    availableQuantity:
      Number.isSafeInteger(ticketType.availableQuantity) &&
      ticketType.availableQuantity >= 0
        ? ticketType.availableQuantity
        : null,
  }))
  const description = textOrFallback(
    source.description,
    textOrFallback(
      source.shortDescription,
      'More information about this event will be available soon.',
    ),
  )
  const shortDescription = textOrFallback(
    source.shortDescription,
    description,
  )
  const sourceArtwork =
    source.artwork && typeof source.artwork === 'object' ? source.artwork : {}
  const theme = textOrFallback(sourceArtwork.theme, 'default')
  const dateValue = source.dateTime
  const hasDateValue =
    typeof dateValue === 'string' ||
    typeof dateValue === 'number' ||
    dateValue instanceof Date
  const dateTime =
    hasDateValue && Number.isFinite(new Date(dateValue).getTime())
      ? dateValue
      : null
  const hasExplicitAvailability =
    Number.isSafeInteger(source.availableTickets) &&
    source.availableTickets >= 0
  const availableTickets = hasExplicitAvailability
    ? source.availableTickets
    : getTotalTicketAvailability(ticketTypes)
  const hasMinimumAge = Object.prototype.hasOwnProperty.call(
    source,
    'minimumAge',
  )
  const validMinimumAge =
    Number.isSafeInteger(source.minimumAge) && source.minimumAge > 0
  const ageRequirementKnown =
    hasMinimumAge && (source.minimumAge === null || validMinimumAge)

  return {
    ...source,
    title,
    category: textOrFallback(source.category, 'Event'),
    city: textOrFallback(source.city, 'Location details coming soon'),
    venue: textOrFallback(source.venue, 'Venue details coming soon'),
    shortDescription,
    description,
    dateTime,
    artwork: {
      theme: /^[a-z\d-]+$/i.test(theme) ? theme : 'default',
      symbol: textOrFallback(sourceArtwork.symbol, '✦'),
      label: textOrFallback(
        sourceArtwork.label,
        `Decorative placeholder artwork for ${title}`,
      ),
    },
    ticketTypes,
    availableTickets,
    ageRequirementKnown,
    minimumAge: validMinimumAge ? source.minimumAge : null,
  }
}
