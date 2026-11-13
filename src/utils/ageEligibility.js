export function validateAgeEligibility(age, selectedEvents) {
  const ageValue = String(age).trim()
  const numericAge = Number(ageValue)
  if (
    !/^\d+$/.test(ageValue) ||
    !Number.isSafeInteger(numericAge) ||
    numericAge <= 0
  ) {
    return {
      valid: false,
      message: 'Age must be a positive whole number.',
      minimumAge: null,
    }
  }

  const unspecifiedEvents = selectedEvents.filter(
    (event) => !hasKnownAgeRequirement(event),
  )
  if (unspecifiedEvents.length > 0) {
    const eventTitles = unspecifiedEvents
      .map((event) => event.title)
      .join(', ')
    return {
      valid: false,
      message: `Age requirement not specified for: ${eventTitles}. Eligibility cannot be verified.`,
      minimumAge: null,
    }
  }

  const ageRestrictedEvents = selectedEvents.filter(
    (event) => Number.isInteger(event.minimumAge) && event.minimumAge > 0,
  )
  const minimumAge = ageRestrictedEvents.reduce(
    (highestAge, event) => Math.max(highestAge, event.minimumAge),
    0,
  )
  const unmetRequirements = ageRestrictedEvents.filter(
    (event) => numericAge < event.minimumAge,
  )

  if (unmetRequirements.length > 0) {
    const eventRequirements = unmetRequirements
      .map((event) => `${event.title} (${event.minimumAge}+)`)
      .join(', ')
    return {
      valid: false,
      message: `You must meet the age requirement for every selected event. Your age does not meet: ${eventRequirements}.`,
      minimumAge,
    }
  }

  return {
    valid: true,
    message: '',
    minimumAge: minimumAge || null,
  }
}

function hasKnownAgeRequirement(event) {
  if (typeof event.ageRequirementKnown === 'boolean') {
    return event.ageRequirementKnown
  }

  return (
    Object.prototype.hasOwnProperty.call(event, 'minimumAge') &&
    (event.minimumAge === null ||
      (Number.isSafeInteger(event.minimumAge) && event.minimumAge > 0))
  )
}
