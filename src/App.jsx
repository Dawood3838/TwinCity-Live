import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './components/MainLayout.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import BookingPage from './pages/BookingPage.jsx'
import ConfirmationPage from './pages/ConfirmationPage.jsx'
import EventDetailsPage from './pages/EventDetailsPage.jsx'
import EventsPage from './pages/EventsPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  )
}

export default App
