import assert from 'node:assert/strict'
import test from 'node:test'
import events from '../src/data/events.js'
import { filterAndSortEvents } from '../src/utils/eventFiltering.js'

test('filters inclusively by event starting price', () => {
  const result = filterAndSortEvents(events, {
    minPrice: 1800,
    maxPrice: 1800,
  })

  assert.deepEqual(result.map((event) => event.id), ['E004'])
})

test('combines the price range with search, category, city, and sorting', () => {
  const result = filterAndSortEvents(events, {
    search: 'workshop',
    category: 'Workshop',
    city: 'Islamabad',
    minPrice: 1000,
    maxPrice: 2000,
    sort: 'price-desc',
  })

  assert.deepEqual(result.map((event) => event.id), ['E010'])
})

test('price sorting applies after the inclusive range', () => {
  const result = filterAndSortEvents(events, {
    minPrice: 500,
    maxPrice: 1800,
    category: 'Workshop',
    sort: 'price-desc',
  })

  assert.deepEqual(result.map((event) => event.id), ['E004', 'E010'])
})

test('handles events with missing searchable and pricing fields', () => {
  const eventsWithoutOptionalFields = [{ id: 'E-empty' }]

  assert.deepEqual(
    filterAndSortEvents(eventsWithoutOptionalFields).map((event) => event.id),
    ['E-empty'],
  )
  assert.deepEqual(
    filterAndSortEvents(eventsWithoutOptionalFields, { search: 'unavailable' }),
    [],
  )
  assert.deepEqual(
    filterAndSortEvents(eventsWithoutOptionalFields, { minPrice: 1 }),
    [],
  )
})
