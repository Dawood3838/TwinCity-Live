import events from '../data/events.js'
import { applyAvailabilityDemo } from '../utils/eventAvailability.js'

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

      resolve(applyAvailabilityDemo(events, availabilityDemo))
    }, 450)
  })
}

export function loadEventById(id, options) {
  return loadEvents(options).then((events) =>
    events.find((event) => event.id === id) ?? null,
  )
}
