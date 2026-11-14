

# TwinCity Live

TwinCity Live is a fictional event discovery and ticket-booking application for Islamabad and Rawalpindi. It was developed as part of Web Programming Assignment 02. Users can browse events, explore ticket options, and go through a simulated booking process.

All events and bookings are for demonstration purposes only. The application does not sell real tickets.

## Student and project details

- **Student:** Muhammad Dawood
- **Roll number:** i240045
- **Section:** CY-A
- **GitHub repository:** [Dawood3838/TwinCity-Live](https://github.com/Dawood3838/TwinCity-Live)
- **Live application:** [TwinCity Live](https://twin-city-live-five.vercel.app/)

## Technologies used

- React 19 (JavaScript and JSX)
- Vite 8
- React Router DOM 7
- CSS
- Node.js built-in test runner (`node:test`)

## Getting started

To run the project locally, first clone the repository and move into the project folder:

```sh
git clone https://github.com/Dawood3838/TwinCity-Live.git
cd TwinCity-Live
```

Install the dependencies and start the development server:

```sh
npm install
npm run dev
```

Vite will provide a local URL in the terminal where the application can be opened.

**Windows PowerShell note:** If PowerShell blocks the `npm` command, use `npm.cmd` instead. For example, run `npm.cmd run dev`.

### Other useful commands

Build the application for production:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

Run the linter and automated tests:

```sh
npm run lint
npm test
```

The tests use Node's built-in test runner. They can also be run directly with:

```sh
node --test
```

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage with featured events and categories |
| `/events` | Browse, search, filter, and sort events |
| `/events/:id` | View event details and select tickets |
| `/booking` | Review the booking, enter attendee details, and view the price summary |
| `/confirmation` | View the latest simulated booking confirmation |
| `/support` | Find answers to common event and booking questions |

Unknown routes and invalid event IDs display a helpful not-found message.

## Main features

The application contains 12 fictional events based in Islamabad and Rawalpindi. Users can browse the catalogue and search by event title, venue, city, or category. Search can be combined with category, city, and starting-price filters, as well as sorting.

Opening an event displays its details and available ticket types. Users can select ticket quantities and review their selection through the shared booking state. The Navbar booking count and booking summary stay in sync through `BookingContext`.

The booking form collects the attendee's name, email, and age. It validates the entered information and checks the age requirements of the selected events before allowing submission. Once the form is valid, the application generates a booking reference and displays a confirmation page.

The confirmation page keeps a snapshot of the booking details, including the selected events, tickets, and prices. Attendee personal information is not included in that snapshot, and the active selection is cleared after confirmation.

Ticket IDs and quantities are saved in `localStorage`. When the application starts, saved selections are checked against the current event catalogue. If an event or ticket is no longer available, the affected selection is identified so the user can correct or remove it.

The application also handles loading failures, empty catalogues, search results with no matches, missing event content, and invalid routes.

## Business rules

The booking process follows three main rules:

1. **Ticket capacity:** The selected quantity must be a positive whole number and cannot exceed the remaining availability of that ticket type. Selecting exactly the remaining quantity is allowed. This rule is implemented in [`src/utils/ticketValidation.js`](./src/utils/ticketValidation.js) through `validateTicketQuantity`.

2. **Age eligibility:** The attendee must meet the minimum age requirement of every selected event. Age must be a positive whole number. An attendee who does not meet an event's age requirement cannot proceed with that booking. The shared validation function is `validateAgeEligibility` in [`src/utils/ageEligibility.js`](./src/utils/ageEligibility.js).

3. **Service fee:** A fixed service fee of **Rs. 100** is added once to every non-empty booking, regardless of the number of tickets. An empty selection has no service fee. The calculation is handled in [`src/utils/bookingPricing.js`](./src/utils/bookingPricing.js).

## Testing demonstrations

The following URLs can be used to demonstrate specific application behaviours.

### 1. Event loading failure and retry

Open:

```text
/events?demoLoadError=1
```

This makes the initial event catalogue request fail intentionally. The application displays an error state with a **Retry** option. Select Retry to load the local event data.

### 2. Changed ticket availability

This demonstration checks what happens when a saved booking contains more tickets than are currently available.

1. Find **Web Development Bootcamp** (`E004`).
2. Select at least 3 **Workshop Seat** tickets.
3. Visit `/booking` so the selection is saved.
4. Reload the application using this URL:

   ```text
   /events?demoAvailability=E004-workshop:2
   ```

5. Open **My Booking**. The saved quantity now exceeds the demonstration availability.
6. The invalid selection is excluded from the totals and displayed with options to change or remove it.
7. Select **Change selection** to choose 2 or fewer tickets, or remove the invalid selection.

To demonstrate a sold-out ticket type, replace `:2` with `:0`:

```text
/events?demoAvailability=E004-workshop:0
```

Remove the query parameter and reload the application to return to the normal catalogue. These query parameters are only for testing; they do not change the original event data.

## Code concept map

The following table shows where the main Web Programming concepts are used in the project.

| Concept | Implemented in |
| --- | --- |
| Components and props | `src/components/`, including `EventCard.jsx`, `EventFilters.jsx`, and `TicketSelector.jsx` |
| State and shared context | `src/pages/EventsPage.jsx`, `src/pages/EventDetailsPage.jsx`, `src/context/BookingContext.jsx` |
| Effects and localStorage | `src/context/BookingContext.jsx` |
| Routing and route parameters | `src/App.jsx`, `src/pages/EventDetailsPage.jsx` |
| Array filtering and sorting | `src/utils/eventFiltering.js`, used by `src/pages/EventsPage.jsx` |
| Event content fallbacks | `src/utils/eventContent.js`, used by `src/services/eventService.js` and `src/context/BookingContext.jsx` |
| Empty catalogue and no-match states | `src/utils/eventListingState.js`, used by `src/pages/EventsPage.jsx` |
| Controlled forms and validation | `src/pages/BookingPage.jsx`, `src/utils/ageEligibility.js` |
| Derived pricing | `src/utils/bookingPricing.js` |
| Async loading and error handling | `src/services/eventService.js`, `src/pages/EventsPage.jsx`, `src/pages/EventDetailsPage.jsx` |
| Capacity, age, and availability rules | `src/utils/ticketValidation.js`, `src/utils/ageEligibility.js`, `src/utils/eventAvailability.js` |
| Automated tests | `tests/ticketValidation.test.js`, `tests/ageEligibility.test.js`, `tests/eventFiltering.test.js`, `tests/eventContent.test.js`, `tests/eventListingState.test.js` |

## Reference investigation and design decisions

Screenshots collected during the reference-site investigation are available in [`reference_screenshots/`](./reference_screenshots/).

The problems observed on those websites, along with the design decisions made for TwinCity Live, are documented in [`DECISIONS.md`](./DECISIONS.md). The screenshots are included as reference evidence; they are not presented as results of live tests performed during development.

## Verification

The project was checked using the automated test suite, linting, and a production build. The recorded test run passed all **20 tests**.

The manual verification checklist, expected behaviour, observed results, and cases that still need attention are documented in [`VERIFICATION.md`](./VERIFICATION.md).

The assignment report draft is available in [`REPORT.md`](./REPORT.md).

## Deployment

The application is deployed on Vercel:

**[https://twin-city-live-five.vercel.app/](https://twin-city-live-five.vercel.app/)**

The repository includes [`vercel.json`](./vercel.json) to rewrite application routes to `index.html`. This allows the React application to handle direct navigation to nested routes instead of relying only on navigation from the homepage.

## Limitations

- All event listings are fictional and come from local JavaScript data.
- Bookings are simulated. There is no connected backend, user account system, payment gateway, or real ticket issuance.
- Only ticket IDs and quantities are saved in `localStorage`. Attendee names, email addresses, and ages are not persisted.
- No support email address is configured. Users can find general help through the application's internal `/support` page.
- The availability and loading-failure query parameters are demonstration features, not live inventory controls.

