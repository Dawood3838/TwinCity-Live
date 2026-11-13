import { Link } from 'react-router-dom'

function BookingPage() {
  return (
    <section className="placeholder-page section-shell">
      <p className="eyebrow">MY BOOKING</p>
      <h1>Your next outing <span>starts here.</span></h1>
      <p>
        Booking details will appear here in a later update. For now, explore the
        kinds of events coming to the Twin Cities.
      </p>
      <Link className="button button--accent" to="/events">
        Explore events <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}

export default BookingPage
