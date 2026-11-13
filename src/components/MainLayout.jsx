import { Outlet } from 'react-router-dom'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

function MainLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
