import events from '../data/events.js'

export function loadEvents({ simulateFailure = false } = {}) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (simulateFailure) {
        reject(new Error('Demo loading failure: the local event catalog could not be loaded.'))
        return
      }

      resolve(events)
    }, 450)
  })
}

export function loadEventById(id, options) {
  return loadEvents(options).then((events) =>
    events.find((event) => event.id === id) ?? null,
  )
}
