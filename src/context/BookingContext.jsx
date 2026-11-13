import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { validateTicketQuantity } from '../utils/ticketValidation.js'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [selections, setSelections] = useState([])

  const addOrUpdateSelection = useCallback((selection) => {
    const validation = validateTicketQuantity(
      selection.quantity,
      selection.availableQuantity,
    )
    if (!validation.valid) {
      return validation
    }

    const bookingSelection = {
      eventId: selection.eventId,
      eventTitle: selection.eventTitle,
      eventCity: selection.eventCity,
      eventVenue: selection.eventVenue,
      eventDateTime: selection.eventDateTime,
      ticketTypeId: selection.ticketTypeId,
      ticketTypeName: selection.ticketTypeName,
      unitPrice: selection.unitPrice,
      quantity: selection.quantity,
    }
    setSelections((currentSelections) => {
      const alreadySelected = currentSelections.some(
        (currentSelection) =>
          currentSelection.eventId === bookingSelection.eventId &&
          currentSelection.ticketTypeId === bookingSelection.ticketTypeId,
      )

      if (!alreadySelected) {
        return [...currentSelections, bookingSelection]
      }

      return currentSelections.map((currentSelection) =>
        currentSelection.eventId === bookingSelection.eventId &&
        currentSelection.ticketTypeId === bookingSelection.ticketTypeId
          ? bookingSelection
          : currentSelection,
      )
    })

    return validation
  }, [])

  const removeSelection = useCallback((eventId, ticketTypeId) => {
    setSelections((currentSelections) =>
      currentSelections.filter(
        (selection) =>
          selection.eventId !== eventId ||
          selection.ticketTypeId !== ticketTypeId,
      ),
    )
  }, [])

  const ticketCount = useMemo(
    () => selections.reduce((total, selection) => total + selection.quantity, 0),
    [selections],
  )

  const value = useMemo(
    () => ({
      selections,
      ticketCount,
      addOrUpdateSelection,
      removeSelection,
    }),
    [addOrUpdateSelection, removeSelection, selections, ticketCount],
  )

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider.')
  }
  return context
}
