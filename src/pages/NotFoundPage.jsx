import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="placeholder-page not-found-page section-shell">
      <p className="eyebrow">404 · WRONG TURN?</p>
      <h1>This page took <span>a detour.</span></h1>
      <p>The page you’re looking for isn’t here, but there’s plenty to discover.</p>
      <Link className="button button--accent" to="/">
        Return home <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}

export default NotFoundPage
