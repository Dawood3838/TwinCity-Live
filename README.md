# TwinCity Live

TwinCity Live is a fictional event discovery and simulated ticket-booking
application for Islamabad and Rawalpindi. It is a Web Programming Assignment 02
project; events and bookings are demonstrations, not real commercial listings.

## Student and submission details

- **Student name:** `[Add verified student name]`
- **Roll number:** `[Add verified roll number]`
- **Section:** `[Add verified section]`
- **GitHub repository:** <https://github.com/Dawood3838/TwinCity-Live>
- **Deployed URL:** `[Not deployed yet — add the Vercel URL after deployment]`

Do not submit the placeholders above as student details.

## Technologies

- React 19 with JavaScript and JSX
- Vite 8
- React Router DOM 7
- Authored CSS
- Node.js built-in test runner (`node:test`)

## Setup and commands

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Windows PowerShell users can run the npm commands as `npm.cmd`, for example
`npm.cmd run dev`.

Build and preview the production application:

```sh
npm run build
npm run preview
```

Run lint and automated tests:

```sh
npm run lint
npm test
node --test
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | TwinCity Live homepage |
| `/events` | Search, filter, sort, and browse the event catalogue |
| `/events/:id` | Event details and ticket selection |
| `/booking` | Shared booking, attendee form, and price summary |
| `/confirmation` | Recent simulated booking snapshot, or a no-booking message |
| `/support` | Internal booking and event FAQs |

Unknown routes and unknown event IDs show a helpful not-found state.

## Features and booking journey

Browse fictional event listings, search by title, venue, city, or category, and
combine those criteria with city, category, starting-price range, and sorting.
Open an event to view its details and select an available ticket type and
quantity. The Navbar count and booking summary use the shared BookingContext.

The controlled booking form validates attendee name, email, positive whole-number
age, and the minimum age of every selected event. On valid submission, the app
creates a readable booking reference and navigates to a confirmation snapshot.
The snapshot contains event/ticket/pricing data only; attendee personal
information is not persisted. The active selection is cleared after the snapshot
is made.

Ticket IDs and quantities are stored in localStorage. On startup, the app
revalidates event and ticket IDs and quantities against the current local
catalogue. Invalid saved selections are called out and can be changed or removed.

## Operating rules

1. **Capacity:** a ticket quantity must be a positive whole number and cannot
   exceed that ticket type's current availability. The rule is implemented by
   `validateTicketQuantity` in
   [`src/utils/ticketValidation.js`](./src/utils/ticketValidation.js).
2. **Age eligibility:** attendee age must be a positive whole number and meet
   every selected event's minimum age. The shared rule is
   [`validateAgeEligibility`](./src/utils/ageEligibility.js).
3. **Service fee:** one fixed **Rs 100** fee is added to a non-empty booking,
   independent of ticket count; an empty selection has no fee. Totals are
   derived in [`src/utils/bookingPricing.js`](./src/utils/bookingPricing.js).

## Demonstrations

### Event loading failure and retry

Open `/events?demoLoadError=1`. The first catalogue request intentionally fails.
Choose **Retry** to load the local event data.

### Changed availability

1. Select at least 3 **Workshop Seat** tickets for **Web Development Bootcamp**
   (`E004-workshop`) and visit `/booking` so that the selection is saved.
2. Reload the app at `/events?demoAvailability=E004-workshop:2`.
3. Open **My Booking**. The saved quantity exceeds the demo capacity, is excluded
   from totals, and is shown with correction and removal actions.
4. Choose **Change selection** and select 2 or fewer tickets, or remove the
   invalid selection.

Use `:0` instead of `:2` to demonstrate a sold-out type. Remove the query
parameter and reload to return to the normal local catalogue. The override is a
development/testing feature and does not modify the source event data.

## Code concept map

| Concept | Implemented in |
| --- | --- |
| Components and props | `src/components/`, including `EventCard.jsx`, `EventFilters.jsx`, and `TicketSelector.jsx` |
| State and shared context | `src/pages/EventsPage.jsx`, `src/pages/EventDetailsPage.jsx`, `src/context/BookingContext.jsx` |
| Effects and localStorage | `src/context/BookingContext.jsx` |
| Routing and route parameters | `src/App.jsx`, `src/pages/EventDetailsPage.jsx` |
| Array filtering and sorting | `src/utils/eventFiltering.js`, used by `src/pages/EventsPage.jsx` |
| Controlled forms and validation | `src/pages/BookingPage.jsx`, `src/utils/ageEligibility.js` |
| Derived pricing | `src/utils/bookingPricing.js` |
| Async loading and error handling | `src/services/eventService.js`, `src/pages/EventsPage.jsx`, `src/pages/EventDetailsPage.jsx` |
| Capacity, age, and availability rules | `src/utils/ticketValidation.js`, `src/utils/ageEligibility.js`, `src/utils/eventAvailability.js` |
| Automated business-rule tests | `tests/ticketValidation.test.js`, `tests/eventFiltering.test.js` |

## Reference investigation and project decisions

The supplied reference-site screenshots are in
[`reference_screenshots/`](./reference_screenshots/). The observations and
corresponding TwinCity Live decisions are recorded in
[`DECISIONS.md`](./DECISIONS.md). The reference images are screenshots, not
evidence of a live test performed during this implementation.

## Verification

The manual verification checklist, observed results, and any unverified cases
are recorded in [`VERIFICATION.md`](./VERIFICATION.md). The concise submission
report draft is [`REPORT.md`](./REPORT.md).

## Deployment preparation

The repository includes [`vercel.json`](./vercel.json), which rewrites SPA
routes to `index.html` so direct nested-route opens and refreshes can be served
by Vercel. Deployment has **not** been performed; it requires the student's
Vercel account and final verification of the deployed URL.

1. Import `Dawood3838/TwinCity-Live` into Vercel.
2. Use the Vite preset, build command `npm run build`, and output directory
   `dist` (the project root is the repository root).
3. Deploy, then directly open and refresh `/events/E001`, `/booking`,
   `/confirmation`, and `/support`.
4. Verify the event-browse-to-confirmation flow and assets on the public URL.
5. Replace the deployed URL placeholder at the top of this README.

## Limitations

- Events are fictional and loaded from local JavaScript data.
- Bookings are simulated; no backend, account system, payment gateway, or real
  ticket issuance is connected.
- Only ticket IDs and quantities are persisted. Attendee name, email, and age
  are not stored.
- No TwinCity Live support email address is configured. The internal
  [`/support`](./src/pages/SupportPage.jsx) page provides FAQs without linking to
  an unverified contact address.
- Student details, final application screenshots, and a public deployment URL
  still need to be supplied or completed by the student.
