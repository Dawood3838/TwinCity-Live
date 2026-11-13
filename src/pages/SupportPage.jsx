import { Link } from 'react-router-dom'

const supportTopics = [
  {
    question: 'How do I find an event?',
    answer: (
      <>
        Browse the <Link to="/events">event listings</Link>. Search by title,
        venue, city, or category, then combine those filters with a minimum and
        maximum starting ticket price. Sort the matching events by date or
        starting price.
      </>
    ),
  },
  {
    question: 'How do I select tickets?',
    answer: (
      <>
        Open an event, choose an available ticket type, and select a quantity
        within the remaining capacity. Your shared selection and ticket count
        appear in <Link to="/booking">My Booking</Link>.
      </>
    ),
  },
  {
    question: 'Why can’t I book a saved ticket?',
    answer: (
      <>
        Availability can change after a selection is saved. The booking page
        rechecks each event, ticket type, and quantity against the current
        catalogue. Use the correction link to choose an available quantity, or
        remove the unavailable selection.
      </>
    ),
  },
  {
    question: 'Why is an age requirement shown?',
    answer:
      'Some events have a minimum attendee age. A booking with multiple events must meet every selected event’s minimum age. The requirement is shown beside each selected event on the booking page.',
  },
  {
    question: 'What is the service fee?',
    answer:
      'The simulated checkout adds one Rs 100 service fee to each non-empty booking, regardless of the number of tickets. Empty bookings have no fee.',
  },
  {
    question: 'Is payment or a real ticket issued?',
    answer:
      'No. TwinCity Live is a university assignment demo with fictional event listings and simulated bookings. It has no payment gateway, backend, or real ticket issuance.',
  },
  {
    question: 'Where can I find my booking reference?',
    answer:
      'After the attendee form passes validation, the confirmation page shows a booking reference and a snapshot of the event, ticket, and price details. Opening the confirmation route without a recent completed booking shows an explanatory message instead.',
  },
]

function SupportPage() {
  return (
    <section className="support-page section-shell">
      <header className="support-header">
        <p className="eyebrow">TWINCITY LIVE SUPPORT</p>
        <h1>
          Helpful answers for <span>your next plan.</span>
        </h1>
        <p>
          Guidance for finding events, checking ticket availability, and
          completing a simulated booking.
        </p>
      </header>

      <section className="support-faq" aria-labelledby="support-faq-heading">
        <h2 id="support-faq-heading">Frequently asked questions</h2>
        {supportTopics.map(({ question, answer }) => (
          <details className="support-faq-item" key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <div className="support-actions">
        <p>
          Ready to explore? Start with the current city listings or review your
          saved tickets.
        </p>
        <div>
          <Link className="button button--accent" to="/events">
            Explore events <span aria-hidden="true">↗</span>
          </Link>
          <Link className="support-booking-link" to="/booking">
            Open My Booking
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SupportPage
