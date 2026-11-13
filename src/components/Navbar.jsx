import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" to="/" aria-label="TwinCity Live home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>
            TwinCity <strong>Live</strong>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/events">Explore Events</NavLink>
          <NavLink to="/booking">My Booking</NavLink>
        </nav>

        <Link className="nav-cta" to="/events">
          Find your event <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  )
}

export default Navbar
