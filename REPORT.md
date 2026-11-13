# Assignment 02 — TwinCity Live

## Student and project details

- **Student name:** `[Add verified student name]`
- **Roll number:** `[Add verified roll number]`
- **Section:** `[Add verified section]`
- **Project:** TwinCity Live
- **Repository:** <https://github.com/Dawood3838/TwinCity-Live>
- **Deployed URL:** `[Pending Vercel deployment]`

## Business profile

TwinCity Live is a fictional event discovery and simulated booking platform for
students, families, and young professionals in Islamabad and Rawalpindi. Its
tagline is “Discover events. Book your experience.” The local catalogue covers
concerts, workshops, exhibitions, conferences, sports, festivals, and
entertainment.

## Three operating rules

1. Ticket quantity must be a positive whole number and cannot exceed current
   ticket-type availability.
2. The attendee must meet the minimum age of every event in the booking.
3. A non-empty booking has one fixed Rs 100 service fee; an empty selection has
   no fee.

## Reference website investigation

The three reference sites and evidence filenames are documented in
[`DECISIONS.md`](./DECISIONS.md):

- Ticketo checkout validation — `ticketo-checkout-validation.png`.
- Tixstan price filtering — `tixstan-price-filter-not-working.png`, with
  `tixstan-empty-navigation-results.png` as companion filter-state evidence.
- Ticketistan Support navigation — `ticketistan-support-navigation.png`.

The images are supplied static screenshots; no live third-party site testing is
claimed. The Ticketistan screenshot shows an external email-app handoff. This
is treated as a context-switch concern, not proof that the email feature is
broken.

## Design and implementation decisions

TwinCity Live keeps its existing navy, neutral, and coral identity. The
investigation led to inline attendee errors with first-invalid-field focus,
an inclusive minimum/maximum starting-price filter, and an internal Support
FAQ page. Full alternatives, trade-offs, evidence limits, and source locations
are in [`DECISIONS.md`](./DECISIONS.md).

## Application screenshots

No application screenshots were created for this draft. Add genuine captures
before submission:

1. `[Insert homepage and event catalogue screenshots.]`
2. `[Insert event details and price-filter screenshots.]`
3. `[Insert booking validation and booking summary screenshots.]`
4. `[Insert confirmation and Support FAQ screenshots.]`

The external reference images remain in `reference_screenshots/`; they are not
presented as screenshots of TwinCity Live.

## Verification

The detailed action/expected/actual/result table is in
[`VERIFICATION.md`](./VERIFICATION.md). The automated tests, lint, production
build, browser checks, responsive checks, and unverified cases are listed
there. The empty-catalogue and altered missing/long-content browser cases were
not run because the application has no corresponding test fixture or demo.

## Limitations

- Fictional events and local JavaScript catalogue only.
- Simulated booking flow; no real payment processing, backend, or ticket
  issuance.
- Attendee personal information is not persisted.
- No project support email address is configured; help is provided internally
  by the Support route.
- Public deployment and final application screenshots are pending.
- The authoritative assignment PDF was not available, so an exact FR01–FR19
  crosswalk must be completed after the PDF is supplied.
- Student name, roll number, and section are not verified in the repository.

## Submission package

The final ZIP has not been named or created because the required student values
are missing. The required filename format is
`RollNo_Name_Section_A#02.zip`. Supply the verified roll number, name, and
section before creating the final archive. Exclude `node_modules/`, `dist/`,
credentials, and temporary files.
