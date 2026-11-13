# Manual Verification Checklist

Browser checks were performed against the local Vite application and its
production preview. Reference-site observations were made from the supplied
images only; they were not live tests of those external websites.

The assignment PDF was not present in the repository or supplied attachment.
The exact FR01–FR19 specification cross-check therefore remains pending; this
checklist covers the requirements in the available milestone instructions.

| Case | Actions | Expected | Actual | Result |
| --- | --- | --- | --- | --- |
| Ticketo-style invalid form | With a ticket selected, submit an empty attendee form; then enter a valid name and submit again. | Specific inline errors; first invalid input receives focus; entered valid values remain. | Inline name/email/age errors appeared; focus moved first to name and then email; “Ada Lovelace” remained in the field. | Pass |
| Under-age attendee | Select Web Development Bootcamp (15+) and submit age 14. | Prevent progression and identify the age requirement. | Inline age error named the event and “15+”; focus moved to the age field. | Pass |
| Exact minimum age | Submit a valid booking for the 15+ event with age 15. | Accept eligibility and show confirmation. | Confirmation appeared for the completed booking. | Pass |
| Price range | Set minimum and maximum to Rs 1,800. | Show events whose displayed starting price is inclusively Rs 1,800. | Only Web Development Bootcamp (Rs 1,800 starting price) remained. | Pass |
| Combined filters and sort | Combine that range with “bootcamp” search, Workshop category, and Rawalpindi; separately sort by low starting price. | Filters intersect; sort orders only matching results. | Combined filters returned the bootcamp. Price-ascending placed Spring Book Fair (Rs 300) first. | Pass |
| Invalid price range and reset | Set minimum above maximum, then reset filters. | Show a clear range error; Reset restores the full catalogue and clears bounds. | “Minimum price must not exceed maximum price” appeared; Reset restored all 12 events. | Pass |
| No search matches | Search for a term not present in the catalogue. | Show a no-matches state distinct from loading or error. | “No events match those filters” appeared; clear/reset restored 12 events. | Pass |
| Empty catalogue | No empty-catalogue demo or data injection was used. | Empty catalogue state is distinct from no matches. | The separate empty-catalogue component branch was not browser-exercised; this remains unverified. | Not run |
| Missing or unusually long event content | No catalogue fixture was added or mutated to remove fields or insert extreme-length content. | Missing/long content should remain usable and not overflow. | Not browser-verified against altered event data. | Not run |
| Loading failure and retry | Open `/events?demoLoadError=1`, then select Retry. | First request shows an error; retry loads events. | Error appeared and Retry displayed all 12 events. | Pass |
| Invalid event and route | Open `/events/INVALID` and an unknown route. | Show useful not-found states without runtime errors. | Event-specific not-found and general 404 pages appeared. | Pass |
| Browser history | Browse to an event, use browser Back, then Forward. | Route content follows browser history. | Events list and event details were restored in sequence. | Pass |
| Ticket selection and persistence | Add tickets, reload, and inspect Navbar and booking summary. | Ticket IDs/quantities restore; count and totals match. | Saved selections and ticket count survived reload; the summary matched the selection. | Pass |
| Invalid restored selections | Restore a missing event ID, a missing ticket type, and a quantity above demo availability. | Invalid records are clearly identified, excluded from totals, and correctable/removable. | Missing event/type messages and the reduced-capacity message appeared; removal worked and the valid ticket could be corrected. | Pass |
| Malformed localStorage | Replace the booking value with invalid JSON and reload `/booking`. | No crash; show recovery guidance. | Booking rendered with a recovery notice and empty selection. A caught parse diagnostic was logged to the console. | Pass |
| Capacity boundaries | Select exactly the remaining demo quantity, then exceed reduced availability. | Exact capacity is accepted; excess is rejected. | Quantity 2 was accepted at capacity 2; a saved quantity of 3 was rejected when capacity was reduced to 2. | Pass |
| Empty booking | Remove all tickets and submit the booking form. | Do not navigate; show an empty-booking message and no service fee. | Stayed on `/booking`, showed “Add at least one ticket,” and displayed Rs 0 fee and total. | Pass |
| Service fee | Check a one-ticket and multiple-ticket booking. | Charge one Rs 100 fee per non-empty booking, not per ticket. | One-ticket and two-ticket summaries each charged Rs 100; empty booking charged Rs 0. | Pass |
| Confirmation snapshot and clear | Complete a valid booking and inspect confirmation, Navbar, and booking page. | Show reference and itemized snapshot; clear active selection and saved ticket list. | Confirmation summary remained available; Navbar count cleared and localStorage held an empty selection. | Pass |
| Direct confirmation | Open `/confirmation` in a fresh page without route state. | Do not invent booking information. | “No recent booking found” and a Browse events link appeared. | Pass |
| Keyboard support FAQ | Open Support, focus a question summary, and press Enter. | FAQ opens by keyboard with visible focus styling. | The first FAQ expanded with keyboard activation. | Pass |
| Responsive widths | Inspect event filters and support/booking pages at 390px and 1280px. | No horizontal overflow; controls remain usable. | `scrollWidth` did not exceed the viewport at either width. | Pass |
| Production nested routes | Open and refresh `/events/E001`; directly open `/support` and `/confirmation` in Vite preview. | Built assets load and nested routes render. | Event details survived refresh; Support rendered; direct Confirmation showed the guarded empty state. | Pass |
| Browser runtime errors | Exercise the normal routes and interactions above. | No uncaught page errors. | No uncaught page errors were observed. Malformed JSON produced only the handled parse diagnostic noted above. | Pass |
| Public deployment | No hosting account was connected and no public deploy was attempted. | Verify the actual public URL and deployed journey. | Vercel rewrite configuration is prepared; public deployment remains unverified. | Not run |

## Automated checks

- `node --test`: 8 passing tests.
- `npm.cmd test`: 8 passing tests.
- `npm.cmd run lint`: passed with no warnings.
- `npm.cmd run build`: passed.
- `vercel.json`: parsed as valid JSON.

## Screenshot handling

No application screenshots were generated. Supplied external-site reference
images are retained in `reference_screenshots/`; the student should capture and
insert genuine application screenshots in the final report.
