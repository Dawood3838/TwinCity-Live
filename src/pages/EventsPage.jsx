import { useEffect, useMemo, useState } from 'react'
import EventCard from '../components/EventCard.jsx'
import EventFilters from '../components/EventFilters.jsx'
import { loadEvents } from '../services/eventService.js'
import { getStartingPrice } from '../utils/eventFormatting.js'

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
  const [events, setEvents] = useState([])
  const [loadStatus, setLoadStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [sort, setSort] = useState('date-asc')
  const demoFailureRequested =
    new URLSearchParams(window.location.search).get('demoLoadError') === '1'

  useEffect(() => {
    let isCurrentRequest = true
    setLoadStatus('loading')
    setLoadError('')

    loadEvents({
      simulateFailure: demoFailureRequested && retryCount === 0,
    })
      .then((loadedEvents) => {
        if (isCurrentRequest) {
          setEvents(loadedEvents)
          setLoadStatus('success')
        }
      })
      .catch((error) => {
        if (isCurrentRequest) {
          setLoadError(error.message)
          setLoadStatus('error')
        }
      })

    return () => {
      isCurrentRequest = false
    }
  }, [demoFailureRequested, retryCount])

  const categories = useMemo(
    () => [...new Set(events.map((event) => event.category))].sort(),
    [events],
  )
  const cities = useMemo(
    () => [...new Set(events.map((event) => event.city))].sort(),
    [events],
  )
  const filteredEvents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    const matches = events.filter((event) => {
      const matchesSearch =
        !query ||
        [event.title, event.venue, event.city, event.category].some((value) =>
          value.toLocaleLowerCase().includes(query),
        )

      return (
        matchesSearch &&
        (!category || event.category === category) &&
        (!city || event.city === city)
      )
    })

    return [...matches].sort((first, second) => {
      if (sort === 'date-desc') {
        return new Date(second.dateTime) - new Date(first.dateTime)
      }
      if (sort === 'price-asc') {
        return getStartingPrice(first) - getStartingPrice(second)
      }
      if (sort === 'price-desc') {
        return getStartingPrice(second) - getStartingPrice(first)
      }
      return new Date(first.dateTime) - new Date(second.dateTime)
    })
  }, [category, city, events, search, sort])

  const hasActiveFilters =
    Boolean(search.trim() || category || city || sort !== 'date-asc')
  const resetFilters = () => {
    setSearch('')
    setCategory('')
    setCity('')
    setSort('date-asc')
  }
  const retryLoading = () => {
    setLoadStatus('loading')
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

      {loadStatus !== 'error' && (
        <EventFilters
          search={search}
          category={category}
          city={city}
          sort={sort}
          categories={categories}
          cities={cities}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onCityChange={setCity}
          onSortChange={setSort}
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

      {loadStatus === 'success' && events.length === 0 && (
        <section className="browse-message">
          <span className="browse-message-icon" aria-hidden="true">✦</span>
          <h2>The event calendar is taking shape.</h2>
          <p>There aren’t any events to show just yet. Check back soon.</p>
        </section>
      )}

      {loadStatus === 'success' && events.length > 0 && (
        <section className="browse-state" aria-live="polite">
          <p className="browse-result-count">
            {filteredEvents.length === events.length
              ? `Showing all ${events.length} events`
              : `${filteredEvents.length} of ${events.length} events`}
          </p>
          {filteredEvents.length > 0 ? (
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
