import { useCallback, useEffect, useMemo, useState } from 'react'
import events from '../data/events.js'
import { applyAvailabilityDemo, parseAvailabilityDemo } from '../utils/eventAvailability.js'
import { validateTicketQuantity } from '../utils/ticketValidation.js'
import { BookingContext } from './BookingContextValue.js'

const STORAGE_KEY = 'twincity-live-booking'

function readStoredSelectionRecords() {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue === null) {
      return { records: [], messages: [] }
    }

    const parsedValue = JSON.parse(storedValue)
    if (
      !parsedValue ||
      parsedValue.version !== 1 ||
      !Array.isArray(parsedValue.selections)
    ) {
      return {
        records: [],
        messages: [
          'Saved booking data was not in a recognized format and has been cleared.',
        ],
      }
    }

    const records = []
    const messages = []
    const seenKeys = new Set()
    parsedValue.selections.forEach((selection, index) => {
      if (
        !selection ||
        typeof selection.eventId !== 'string' ||
        typeof selection.ticketTypeId !== 'string' ||
        typeof selection.quantity !== 'number' ||
        !Number.isFinite(selection.quantity)
      ) {
        messages.push(
          `Saved ticket selection ${index + 1} had incomplete data and could not be restored.`,
        )
        return
      }

      const key = `${selection.eventId}:${selection.ticketTypeId}`
      if (seenKeys.has(key)) {
        messages.push(
          `Duplicate saved ticket selection for ${selection.eventId} was ignored.`,
        )
        return
      }

      seenKeys.add(key)
      records.push({
        eventId: selection.eventId,
        ticketTypeId: selection.ticketTypeId,
        quantity: selection.quantity,
      })
    })

    return { records, messages }
  } catch (error) {
    console.error('Unable to read the saved booking from localStorage.', error)
    return {
      records: [],
      messages: [
        'Saved booking data could not be read and has been cleared. Please select tickets again.',
      ],
    }
  }
}

function revalidateSelectionRecords(records, eventCatalog) {
  const selections = []
  const invalidSelections = []

  records.forEach((record) => {
    const event = eventCatalog.find((item) => item.id === record.eventId)
    const ticket = event?.ticketTypes.find(
      (item) => item.id === record.ticketTypeId,
    )

    let validation
    let reason
    if (!event) {
      reason = `Event ${record.eventId} is no longer available.`
    } else if (!ticket) {
      reason = `Ticket type ${record.ticketTypeId} is no longer available for this event.`
    } else {
      validation = validateTicketQuantity(
        record.quantity,
        ticket.availableQuantity,
      )
      reason = validation.message
    }

    if (reason) {
      invalidSelections.push({
        ...record,
        key: `${record.eventId}:${record.ticketTypeId}`,
        eventTitle: event?.title ?? `Unavailable event (${record.eventId})`,
        ticketTypeName:
          ticket?.name ?? `Unavailable ticket (${record.ticketTypeId})`,
        reason,
        canEdit: Boolean(event),
      })
      return
    }

    selections.push({
      eventId: event.id,
      eventTitle: event.title,
      eventCity: event.city,
      eventVenue: event.venue,
      eventDateTime: event.dateTime,
      ticketTypeId: ticket.id,
      ticketTypeName: ticket.name,
      unitPrice: ticket.price,
      quantity: record.quantity,
      availableQuantity: ticket.availableQuantity,
    })
  })

  return { selections, invalidSelections }
}

export function BookingProvider({ children }) {
  const [initialStoredState] = useState(readStoredSelectionRecords)
  const [selectionRecords, setSelectionRecords] = useState(
    initialStoredState.records,
  )
  const [storageMessages, setStorageMessages] = useState(
    initialStoredState.messages,
  )
  const [availabilityDemo] = useState(() =>
    parseAvailabilityDemo(window.location.search),
  )
  const eventCatalog = useMemo(
    () => applyAvailabilityDemo(events, availabilityDemo),
    [availabilityDemo],
  )
  const { selections, invalidSelections } = useMemo(
    () => revalidateSelectionRecords(selectionRecords, eventCatalog),
    [eventCatalog, selectionRecords],
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, selections: selectionRecords }),
      )
    } catch (error) {
      console.error('Unable to save the booking to localStorage.', error)
    }
  }, [selectionRecords])

  const addOrUpdateSelection = useCallback(
    (selection) => {
      const event = eventCatalog.find((item) => item.id === selection.eventId)
      const ticket = event?.ticketTypes.find(
        (item) => item.id === selection.ticketTypeId,
      )
      if (!ticket) {
        return {
          valid: false,
          message: 'This event ticket is no longer available.',
        }
      }

      const validation = validateTicketQuantity(
        selection.quantity,
        ticket.availableQuantity,
      )
      if (!validation.valid) {
        return validation
      }

      const record = {
        eventId: event.id,
        ticketTypeId: ticket.id,
        quantity: selection.quantity,
      }
      setSelectionRecords((currentRecords) => {
        const alreadySelected = currentRecords.some(
          (currentRecord) =>
            currentRecord.eventId === record.eventId &&
            currentRecord.ticketTypeId === record.ticketTypeId,
        )
        if (!alreadySelected) {
          return [...currentRecords, record]
        }

        return currentRecords.map((currentRecord) =>
          currentRecord.eventId === record.eventId &&
          currentRecord.ticketTypeId === record.ticketTypeId
            ? record
            : currentRecord,
        )
      })
      setStorageMessages([])
      return validation
    },
    [eventCatalog],
  )

  const removeSelection = useCallback((eventId, ticketTypeId) => {
    setSelectionRecords((currentRecords) =>
      currentRecords.filter(
        (record) =>
          record.eventId !== eventId || record.ticketTypeId !== ticketTypeId,
      ),
    )
    setStorageMessages([])
  }, [])

  const clearSelections = useCallback(() => {
    setSelectionRecords([])
    setStorageMessages([])
  }, [])

  const ticketCount = useMemo(
    () => selections.reduce((total, selection) => total + selection.quantity, 0),
    [selections],
  )
  const availabilityDemoMessage = availabilityDemo
    ? `Demo availability is active: ${availabilityDemo.ticketTypeId} has ${availabilityDemo.availableQuantity} available.`
    : ''

  const value = useMemo(
    () => ({
      selections,
      invalidSelections,
      storageMessages,
      eventCatalog,
      availabilityDemo,
      availabilityDemoMessage,
      ticketCount,
      addOrUpdateSelection,
      removeSelection,
      clearSelections,
    }),
    [
      addOrUpdateSelection,
      availabilityDemo,
      availabilityDemoMessage,
      clearSelections,
      eventCatalog,
      invalidSelections,
      removeSelection,
      selections,
      storageMessages,
      ticketCount,
    ],
  )

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  )
}
