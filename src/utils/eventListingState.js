export function getEventListingState(events, filteredEvents) {
  if (events.length === 0) {
    return 'empty-catalogue'
  }

  if (filteredEvents.length === 0) {
    return 'no-matches'
  }

  return 'results'
}
