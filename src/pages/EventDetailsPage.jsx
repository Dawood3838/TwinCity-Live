import { Link, useParams } from 'react-router-dom'

function EventDetailsPage() {
  const { id } = useParams()

  return (
    <section className="placeholder-page section-shell">
      <p className="eyebrow">EVENT DETAILS</p>
      <h1>The details are <span>coming soon.</span></h1>
      <p>
        Event <strong>{id}</strong> will have its own page once the event
        calendar is ready.
      </p>
      <Link className="button button--accent" to="/events">
        Explore events <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}

export default EventDetailsPage
