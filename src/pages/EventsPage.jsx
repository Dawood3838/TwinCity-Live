import { useEffect, useMemo, useState } from 'react'
import EventCard from '../components/EventCard.jsx'
import EventFilters from '../components/EventFilters.jsx'
import { useBooking } from '../context/useBooking.js'
import { loadEvents } from '../services/eventService.js'
import { filterAndSortEvents } from '../utils/eventFiltering.js'
import { getEventListingState } from '../utils/eventListingState.js'

const EMPTY_EVENTS = []

function EventLoadingState() {
  return (
    <div className="browse-event-grid" aria-label="Loading events" aria-busy="true">
      {[1, 2, 3].map((item) => (
        <div className="browse-skeleton-card" key={item}>
          <span className="browse-skeleton-art" />
          <span className="browse-skeleton-line browse-skeleton-line--short" />
          <span className="browse-skeleton-line" />
          <span className="browse-skeleton-line browse-skeleton-line--medium" />
        </div>
      ))}
    </div>
  )
}

function EventsPage() {
  const { availabilityDemo, availabilityDemoMessage } = useBooking()
  const [loadResult, setLoadResult] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [sort, setSort] = useState('date-asc')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const demoFailureRequested =
    new URLSearchParams(window.location.search).get('demoLoadError') === '1'
  const requestKey = `${retryCount}:${demoFailureRequested}:${availabilityDemo?.ticketTypeId ?? ''}:${availabilityDemo?.availableQuantity ?? ''}`

  useEffect(() => {
    let isCurrentRequest = true

    loadEvents({
      simulateFailure: demoFailureRequested && retryCount === 0,
      availabilityDemo,
    })
      .then((loadedEvents) => {
        if (isCurrentRequest) {
          setLoadResult({
            requestKey,
            status: 'success',
            events: loadedEvents,
          })
        }
      })
      .catch((error) => {
        if (isCurrentRequest) {
          setLoadResult({
            requestKey,
            status: 'error',
            error: error.message,
          })
        }
      })

    return () => {
      isCurrentRequest = false
    }
  }, [availabilityDemo, demoFailureRequested, requestKey, retryCount])

  const currentLoadResult =
    loadResult?.requestKey === requestKey ? loadResult : null
  const events = currentLoadResult?.events ?? EMPTY_EVENTS
  const loadStatus = currentLoadResult?.status ?? 'loading'
  const loadError = currentLoadResult?.error ?? ''
  const numericMinimum = minPrice === '' ? null : Number(minPrice)
  const numericMaximum = maxPrice === '' ? null : Number(maxPrice)
  const priceRangeError =
    (numericMinimum !== null &&
      (!Number.isFinite(numericMinimum) || numericMinimum < 0)) ||
    (numericMaximum !== null &&
      (!Number.isFinite(numericMaximum) || numericMaximum < 0))
      ? 'Enter a valid price of Rs 0 or more.'
      : numericMinimum !== null &&
          numericMaximum !== null &&
          numericMinimum > numericMaximum
        ? 'Minimum price must not exceed maximum price.'
        : ''

  const categories = useMemo(
    () => [...new Set(events.map((event) => event.category))].sort(),
    [events],
  )
  const cities = useMemo(
    () => [...new Set(events.map((event) => event.city))].sort(),
    [events],
  )
  const filteredEvents = useMemo(() => {
    if (priceRangeError) {
      return []
    }

    return filterAndSortEvents(events, {
      search,
      category,
      city,
      sort,
      minPrice: numericMinimum,
      maxPrice: numericMaximum,
    })
  }, [
    category,
    city,
    events,
    numericMaximum,
    numericMinimum,
    priceRangeError,
    search,
    sort,
  ])
  const eventListingState = getEventListingState(events, filteredEvents)

  const hasActiveFilters =
    Boolean(
      search.trim() ||
        category ||
        city ||
        minPrice ||
        maxPrice ||
        sort !== 'date-asc',
    )
  const resetFilters = () => {
    setSearch('')
    setCategory('')
    setCity('')
    setSort('date-asc')
    setMinPrice('')
    setMaxPrice('')
  }
  const retryLoading = () => {
    setRetryCount((currentCount) => currentCount + 1)
  }

  return (
    <section className="browse-page section-shell">
      <header className="browse-header">
        <p className="eyebrow">YOUR NEXT GOOD PLAN</p>
        <h1>
          Find your <span>kind of event.</span>
        </h1>
        <p className="browse-intro">
          Browse what’s happening across Islamabad and Rawalpindi, and find a
          reason to get out there.
        </p>
      </header>

      {availabilityDemoMessage && (
        <p className="booking-demo-notice" role="status">
          Testing demo: {availabilityDemoMessage}
        </p>
      )}

      {loadStatus !== 'error' && (
        <EventFilters
          search={search}
          category={category}
          city={city}
          sort={sort}
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRangeError={priceRangeError}
          categories={categories}
          cities={cities}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onCityChange={setCity}
          onSortChange={setSort}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onReset={resetFilters}
        />
      )}

      {loadStatus === 'loading' && (
        <section className="browse-state" aria-live="polite">
          <p className="browse-result-count">Loading the city calendar…</p>
          <EventLoadingState />
        </section>
      )}

      {loadStatus === 'error' && (
        <section className="browse-message browse-message--error" role="alert">
          <span className="browse-message-icon" aria-hidden="true">!</span>
          <h2>We couldn’t load the events.</h2>
          <p>{loadError || 'Please try again in a moment.'}</p>
          <button className="button button--accent" type="button" onClick={retryLoading}>
            Retry <span aria-hidden="true">↻</span>
          </button>
        </section>
      )}

      {loadStatus === 'success' && eventListingState === 'empty-catalogue' && (
        <section className="browse-message">
          <span className="browse-message-icon" aria-hidden="true">✦</span>
          <h2>The event calendar is taking shape.</h2>
          <p>There aren’t any events to show just yet. Check back soon.</p>
        </section>
      )}

      {loadStatus === 'success' && eventListingState !== 'empty-catalogue' && (
        <section className="browse-state" aria-live="polite">
          <p className="browse-result-count">
            {filteredEvents.length === events.length
              ? `Showing all ${events.length} events`
              : `${filteredEvents.length} of ${events.length} events`}
          </p>
          {eventListingState === 'results' ? (
            <div className="browse-event-grid">
              {filteredEvents.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </div>
          ) : (
            <div className="browse-message browse-message--empty">
              <span className="browse-message-icon" aria-hidden="true">⌕</span>
              <h2>No events match those filters.</h2>
              <p>Try a different search or reset your filters to see everything.</p>
              <button
                className="button button--accent"
                type="button"
                onClick={resetFilters}
              >
                Clear search and filters <span aria-hidden="true">↻</span>
              </button>
            </div>
          )}
        </section>
      )}
    </section>
  )
}

export default EventsPage
