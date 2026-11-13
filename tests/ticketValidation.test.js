import assert from 'node:assert/strict'
import test from 'node:test'
import { validateTicketQuantity } from '../src/utils/ticketValidation.js'

test('accepts a positive quantity within available capacity', () => {
  assert.deepEqual(validateTicketQuantity(2, 5), { valid: true, message: '' })
})

test('accepts a quantity exactly equal to available capacity', () => {
  assert.deepEqual(validateTicketQuantity(5, 5), { valid: true, message: '' })
})

test('rejects a quantity exceeding available capacity', () => {
  const result = validateTicketQuantity(6, 5)
  assert.equal(result.valid, false)
  assert.match(result.message, /Only 5 tickets remain/)
})

test('rejects zero and negative requested quantities', () => {
  assert.equal(validateTicketQuantity(0, 5).valid, false)
  assert.equal(validateTicketQuantity(-1, 5).valid, false)
})

test('rejects sold-out availability', () => {
  const result = validateTicketQuantity(1, 0)
  assert.equal(result.valid, false)
  assert.match(result.message, /sold out/)
})
