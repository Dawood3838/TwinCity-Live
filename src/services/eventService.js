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
