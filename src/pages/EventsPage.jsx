import { Link } from 'react-router-dom'

function EventsPage() {
  return (
    <section className="placeholder-page section-shell">
      <p className="eyebrow">EXPLORE THE TWIN CITIES</p>
      <h1>Something good is <span>on its way.</span></h1>
      <p>
        We’re getting the event calendar ready. Check back soon to discover
        concerts, workshops, exhibitions, and more in Islamabad and Rawalpindi.
      </p>
      <Link className="button button--accent" to="/">
        Back to home <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}

export default EventsPage
