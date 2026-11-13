import events from '../data/events.js'
import { applyAvailabilityDemo } from '../utils/eventAvailability.js'
import { normalizeEventContent } from '../utils/eventContent.js'

export function loadEvents({
  simulateFailure = false,
  availabilityDemo = null,
} = {}) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (simulateFailure) {
        reject(new Error('Demo loading failure: the local event catalog could not be loaded.'))
        return
      }

      const eventCatalog = events.map(normalizeEventContent)
      resolve(applyAvailabilityDemo(eventCatalog, availabilityDemo))
    }, 450)
  })
}

export function loadEventById(id, options) {
  return loadEvents(options).then((events) =>
    events.find((event) => event.id === id) ?? null,
  )
}
