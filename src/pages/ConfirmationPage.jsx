import { Link } from 'react-router-dom'

function ConfirmationPage() {
  return (
    <section className="placeholder-page section-shell">
      <p className="eyebrow">CONFIRMATION</p>
      <h1>A little more <span>soon.</span></h1>
      <p>
        This page is ready for a future booking confirmation flow. No bookings
        or payments are processed in this preview.
      </p>
      <Link className="button button--accent" to="/">
        Back to home <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}

export default ConfirmationPage
