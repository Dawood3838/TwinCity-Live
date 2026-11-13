export function validateTicketQuantity(requestedQuantity, availableQuantity) {
  if (!Number.isInteger(availableQuantity) || availableQuantity < 0) {
    return {
      valid: false,
      message: 'Ticket availability could not be verified.',
    }
  }

  if (availableQuantity === 0) {
    return {
      valid: false,
      message: 'This ticket type is sold out and cannot be selected.',
    }
  }

  if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
    return {
      valid: false,
      message: 'Enter a whole number of at least one ticket.',
    }
  }

  if (requestedQuantity > availableQuantity) {
    return {
      valid: false,
      message: `Only ${availableQuantity} ${availableQuantity === 1 ? 'ticket remains' : 'tickets remain'} for this ticket type.`,
    }
  }

  return { valid: true, message: '' }
}
