export const BOOKING_SERVICE_FEE = 100

export function calculateBookingTotals(selections) {
  const ticketCount = selections.reduce(
    (total, selection) => total + selection.quantity,
    0,
  )
  const subtotal = selections.reduce(
    (total, selection) => total + selection.unitPrice * selection.quantity,
    0,
  )
  const serviceFee = ticketCount > 0 ? BOOKING_SERVICE_FEE : 0

  return {
    ticketCount,
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
  }
}
