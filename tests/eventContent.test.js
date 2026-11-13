import assert from 'node:assert/strict'
import test from 'node:test'
import { formatEventDate, getStartingPrice } from '../src/utils/eventFormatting.js'
import { normalizeEventContent } from '../src/utils/eventContent.js'

test('supplies safe fallbacks for missing event content and artwork', () => {
  const event = normalizeEventContent({ id: 'E-missing' })

  assert.equal(event.title, 'Untitled event')
  assert.equal(event.category, 'Event')
  assert.equal(event.city, 'Location details coming soon')
  assert.equal(event.venue, 'Venue details coming soon')
  assert.equal(
    event.shortDescription,
    'More information about this event will be available soon.',
  )
  assert.equal(event.description, event.shortDescription)
  assert.deepEqual(event.artwork, {
    theme: 'default',
    symbol: '✦',
    label: 'Decorative placeholder artwork for Untitled event',
  })
  assert.deepEqual(event.ticketTypes, [])
  assert.equal(event.availableTickets, null)
  assert.equal(event.ageRequirementKnown, false)
  assert.equal(event.minimumAge, null)
  assert.equal(formatEventDate(event.dateTime), 'Date and time to be announced')
  assert.equal(getStartingPrice(event), null)
})

test('distinguishes unknown availability from a known sold-out event', () => {
  const unknownAvailability = normalizeEventContent({
    ticketTypes: [{ id: 'unknown-quantity', name: 'Entry', price: 500 }],
  })
  const soldOutEvent = normalizeEventContent({
    availableTickets: 0,
    ticketTypes: [
      {
        id: 'sold-out',
        name: 'Entry',
        price: 500,
        availableQuantity: 0,
      },
    ],
  })

  assert.equal(unknownAvailability.availableTickets, null)
  assert.equal(unknownAvailability.ticketTypes[0].availableQuantity, null)
  assert.equal(soldOutEvent.availableTickets, 0)
  assert.equal(soldOutEvent.ticketTypes[0].availableQuantity, 0)
})

test('preserves known ticket totals and marks partial totals unknown', () => {
  const knownAvailability = normalizeEventContent({
    ticketTypes: [
      { id: 'one', availableQuantity: 2 },
      { id: 'two', availableQuantity: 0 },
    ],
  })
  const partialAvailability = normalizeEventContent({
    ticketTypes: [
      { id: 'one', availableQuantity: 2 },
      { id: 'two' },
    ],
  })

  assert.equal(knownAvailability.availableTickets, 2)
  assert.equal(partialAvailability.availableTickets, null)
})

test('distinguishes a specified unrestricted age from an unspecified age', () => {
  const unrestrictedEvent = normalizeEventContent({ minimumAge: null })
  const unspecifiedEvent = normalizeEventContent({})

  assert.equal(unrestrictedEvent.ageRequirementKnown, true)
  assert.equal(unrestrictedEvent.minimumAge, null)
  assert.equal(unspecifiedEvent.ageRequirementKnown, false)
  assert.equal(unspecifiedEvent.minimumAge, null)
})

test('preserves unusually long event content for wrapping in the UI', () => {
  const longTitle = 'A'.repeat(240)
  const longDescription = 'description '.repeat(180)
  const longVenue = 'venue-name-without-spaces-'.repeat(24)
  const event = normalizeEventContent({
    title: longTitle,
    shortDescription: longDescription,
    description: longDescription,
    venue: longVenue,
  })

  assert.equal(event.title, longTitle)
  assert.equal(event.shortDescription, longDescription.trim())
  assert.equal(event.description, longDescription.trim())
  assert.equal(event.venue, longVenue)
})

test('formats missing and invalid event dates with a useful fallback', () => {
  assert.equal(formatEventDate(undefined), 'Date and time to be announced')
  assert.equal(formatEventDate('not-a-date'), 'Date and time to be announced')
})
