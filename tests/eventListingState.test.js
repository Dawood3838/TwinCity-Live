import assert from 'node:assert/strict'
import test from 'node:test'
import { getEventListingState } from '../src/utils/eventListingState.js'

test('distinguishes an empty event catalogue from no matching results', () => {
  assert.equal(getEventListingState([], []), 'empty-catalogue')
  assert.equal(getEventListingState([{ id: 'E001' }], []), 'no-matches')
})

test('identifies results when the active filters match events', () => {
  assert.equal(
    getEventListingState([{ id: 'E001' }], [{ id: 'E001' }]),
    'results',
  )
})
