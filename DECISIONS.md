# Reference Investigation and Design Decisions

## Evidence limits

The four files in `reference_screenshots/` are user-supplied static screenshots.
They show the named websites and the visible browser/page state described below.
No live reference-site interaction was performed for this milestone. The
reported defects are distinguished from what can be proven by a static image.

## 1. Ticketo — checkout validation feedback

- **Reference and URL:** Ticketo, `ticketo.com.pk` (the screenshot address bar
  shows the host without a visible path).
- **User task:** Complete the attendee details and continue checkout.
- **Visible observation:** The screenshot shows a browser-native
  **“Please fill out this field.”** bubble over the checkout dialog, alongside
  attendee badge-name fields and the payment/terms area. It does not show a
  stable inline error beside the missing field.
- **Task difficulty:** A generic browser tooltip is transient and browser
  controlled; in the captured checkout view it does not explain the field rule
  beside the field or guide the user through multiple errors.
- **Business consequence (inference):** Users may have to hunt for the missing
  value, increasing checkout friction and the chance they abandon the flow.
- **TwinCity Live decision:** Use controlled attendee fields, disable native
  validation UI with `noValidate`, render specific inline field errors, then
  scroll to and focus the first invalid input after submission. Controlled
  values remain in state when errors are shown.
- **Code location:** [`src/pages/BookingPage.jsx`](./src/pages/BookingPage.jsx);
  inline error styling is in [`src/App.css`](./src/App.css).
- **Alternative considered:** Rely on `required` and browser `reportValidity()`.
- **Reason and trade-off:** Native messages vary by browser and do not provide
  the same persistent per-field explanation. The custom implementation needs
  additional state and focus handling, but gives consistent, accessible
  feedback.
- **Evidence:** [`ticketo-checkout-validation.png`](./reference_screenshots/ticketo-checkout-validation.png).
- **Inspection steps:** Open the supplied image and inspect the address bar,
  checkout dialog, visible attendee-name fields, and native validation bubble.

## 2. Tixstan — price-range filtering

- **Reference and URL:** Tixstan, `tixstan.com/listings/`. The query string in
  the screenshot is truncated in the browser address bar.
- **User task:** Narrow event listings by category, region, and price.
- **Visible observation:** The supplied price-filter image shows the Price
  Filter popover open, a displayed range of **PKR 0–0**, and an **Apply**
  control. The listing count is zero. The companion image shows the selected
  Concert category and Hyderabad region with “We've found 0 listings.”
- **Reported issue and evidence limit:** Reference testing identified the price
  filter as ineffective. The screenshots document the visible controls and
  zero-result state, but by themselves do not establish the underlying
  implementation defect or whether those filters caused the empty result.
- **Task difficulty:** A user cannot rely on the selected price bounds to
  narrow results predictably while combining them with the other filters.
- **Business consequence (inference):** Unreliable filtering can hide suitable
  events or make discovery take longer.
- **TwinCity Live decision:** Provide explicit, keyboard-accessible minimum and
  maximum starting-price inputs. The bounds are inclusive and combine with
  search, category, city, and the selected sort order. An invalid or reversed
  range gets a visible message.
- **Code location:** [`src/components/EventFilters.jsx`](./src/components/EventFilters.jsx),
  [`src/utils/eventFiltering.js`](./src/utils/eventFiltering.js), and
  [`src/pages/EventsPage.jsx`](./src/pages/EventsPage.jsx). Focused automated
  cases are in [`tests/eventFiltering.test.js`](./tests/eventFiltering.test.js).
- **Alternative considered:** A slider-only range control.
- **Reason and trade-off:** Number inputs let users enter exact values and
  work with a keyboard without dragging a small mobile slider. They use more
  space in the filter panel.
- **Evidence:** [`tixstan-price-filter-not-working.png`](./reference_screenshots/tixstan-price-filter-not-working.png)
  and [`tixstan-empty-navigation-results.png`](./reference_screenshots/tixstan-empty-navigation-results.png).
- **Inspection steps:** Inspect the visible listing URL and filters, open the
  supplied price-filter image, read the PKR 0–0 range and Apply control, then
  compare the companion image's selected category/region and zero-result
  heading.

## 3. Ticketistan — Support navigation

- **Reference and URL:** Ticketistan, `ticketistan.com/track/`.
- **User task:** Find help while viewing ticket-tracking guidance.
- **Visible observation:** The screenshot shows a **Support** item in the
  navigation and a system prompt asking which app should open the `mailto:`
  link. The browser status text shows `mailto:support@ticketistan.com`, while
  the page underneath remains the ticket-tracking page.
- **Task difficulty:** The navigation leaves the website for an external mail
  application instead of first presenting help content in the user's current
  context. The image does not show what happens after an email app is selected.
  This is a usability/context-switch concern, not proof that Ticketistan's
  email action is broken.
- **Business consequence (inference):** Users who only need a quick answer may
  abandon the flow or be uncertain whether support content exists.
- **TwinCity Live decision:** Add an internal `/support` FAQ page with links to
  event browsing and My Booking, and link to it from the Navbar and Footer.
  No email link is added because no TwinCity Live support address exists in
  the project. The address visible in the reference screenshot belongs to
  Ticketistan and is not adopted as a project contact.
- **Code location:** [`src/pages/SupportPage.jsx`](./src/pages/SupportPage.jsx),
  [`src/App.jsx`](./src/App.jsx), [`src/components/Navbar.jsx`](./src/components/Navbar.jsx),
  and [`src/components/Footer.jsx`](./src/components/Footer.jsx).
- **Alternative considered:** Add a `mailto:` link.
- **Reason and trade-off:** An unverified project address could misdirect users,
  and the reference screenshot demonstrates the external app handoff. The
  internal FAQ is immediately available, but this demo does not provide direct
  human support.
- **Evidence:** [`ticketistan-support-navigation.png`](./reference_screenshots/ticketistan-support-navigation.png).
- **Inspection steps:** Inspect the visible `ticketistan.com/track/` address,
  Support navigation item, mail-app chooser, and browser status text.
