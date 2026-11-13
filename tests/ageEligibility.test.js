import assert from 'node:assert/strict'
import test from 'node:test'
import { validateAgeEligibility } from '../src/utils/ageEligibility.js'
import { normalizeEventContent } from '../src/utils/eventContent.js'

test('does not treat an unspecified age requirement as unrestricted', () => {
  const event = normalizeEventContent({
    id: 'unknown-age',
    title: 'Age details pending',
  })
  const result = validateAgeEligibility('21', [event])

  assert.equal(result.valid, false)
  assert.match(result.message, /Age requirement not specified/)
})

test('accepts a known event with no minimum age', () => {
  const event = normalizeEventContent({
    id: 'all-ages',
    title: 'All ages event',
    minimumAge: null,
  })

  assert.deepEqual(validateAgeEligibility('21', [event]), {
    valid: true,
    message: '',
    minimumAge: null,
  })
})

test('continues enforcing a known minimum age', () => {
  const event = normalizeEventContent({
    id: 'age-restricted',
    title: 'Age-restricted event',
    minimumAge: 16,
  })

  assert.equal(validateAgeEligibility('16', [event]).valid, true)
  assert.equal(validateAgeEligibility('15', [event]).valid, false)
})
