import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <Link className="brand footer-brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>
            TwinCity <strong>Live</strong>
          </span>
        </Link>
        <p>Good plans bring us together. Islamabad · Rawalpindi</p>
        <Link className="footer-support-link" to="/support">
          Support
        </Link>
        <span className="footer-note">Made for moments that move you.</span>
      </div>
    </footer>
  )
}

export default Footer
