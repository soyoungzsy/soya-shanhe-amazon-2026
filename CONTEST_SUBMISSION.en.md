# Soya Shanhe — keep your confirmed choices

English entry draft for the Alexa+ track. Source repository: https://github.com/soyoungzsy/soya-shanhe-amazon-2026. The final demo URL and required entrant details belong in the Devpost form. Source publication alone does not establish that a contest entry has been submitted.

## Short description

A seasonal travel calendar that keeps the traveller's confirmed choices when plans change, with real MCP tools, transparent receipts and explicit no-match decisions.

## Inspiration

A traveller may move a holiday without changing their budget, departure city or travel style. Those decisions should survive the change. Seasonal evidence also needs a clear boundary: a historical winter report cannot establish that an attraction will open this year.

Soya Shanhe already provides a globe, destination photography, guides and a browser-local wishlist. This entry adds preference preservation inside that existing product, so a changed date does not require starting again in another interface.

## What it does

The original Chinese travel calendar, navigation, photographs, encyclopedia and 79 inspiration records remain. The traveller uses the same concrete date range, departure city, budget and interest controls. A small seasonal-planning section adds explicit locks and a receipt of changed and preserved values.

In the fictional demonstration, Kyoto is chosen for an eleven-day November 2026 holiday from Hangzhou, with a CNY 28,000 planning budget. Changing the original calendar to December 20–30 keeps the eleven days and other locked priorities. When Kyoto no longer meets the original filter, an eligible annotated seasonal alternative is proposed, with historical evidence clearly labelled conditional.

An intentionally infeasible CNY 500 test budget demonstrates the no-match behavior. The confirmed December plan and input values stay intact. The traveller must explicitly select an offered relaxation; changing a locked field also requires explicit unlock confirmation. Saving and restoring retains locks, recent receipts and the pending choice in the browser, separately from the original wishlist and personal records.

This is an Alexa+ experience simulation with a real MCP server and browser client. The choices come from structured rules. No language model, arbitrary natural-language understanding, autonomous agent or official Alexa connection is active. MCP supplies tool transport, not AI reasoning.

## How we built it

The existing React/Vite product is the foundation. The official MCP SDK 1.29.0 adds four tools for query, generation, modification and preparation/restoration of browser-local saves over Streamable HTTP 2025-11-25. The original page sends actual initialize, tools/list and tools/call messages, with inspectable errors and results.

Strict schemas allow only planning fields and reference rates. Revision checks reject stale changes. Infeasible requests are recorded as pending without replacing committed dates or itinerary. Tool-side save validation returns `serverPersisted:false`; only a successful real browser storage write causes the UI to show saved status. Profiles, documents, OCR text and private destination lists are not sent to the tools.

The original estimator and eligibility rules are preserved. Replacement first satisfies the original complete-catalogue filter, then prefers eligible records with added seasonal annotations; the original browsing order is unchanged. Kyoto has general JNTO guidance, Beijing's dated evidence becomes conditional in later years, and Harbin's historical winter report cannot confirm upcoming openings. Other records retain original source links and disclose that they were not individually rechecked for this addition.

## Existing work and new contribution

The public upstream is [soya-travel-calendar](https://github.com/soyoungzsy/soya-travel-calendar), pinned to `9309a31188f74f3df4e4f8dd6ab017dadcc600b4`. All 415 baseline files were verified against public Git blob hashes before making the isolated copy. The original globe, content, guides, calendar, estimates and browser-local product features are reused with attribution.

The contest contribution is the real MCP server/client integrated into the original interface; strict planning schemas; preference locks tied to the original controls; receipts; explicit no-match decisions and relaxations; safe preparation/restoration of local snapshots; provenance annotations; and original-interface tests. The main website and repository were not modified. The separate eventual contest snapshot can be frozen without freezing the main product. Significant-new-work acceptance remains the organizers' decision.

## Challenges and learning

Integration required respecting the product's existing contracts. A month-only demo could not replace a real start/end date range, and a server file could not replace browser-local saving. The original HTTP server also accepted GET/HEAD only, so a narrow optional MCP route was added without replacing its reference/static routes.

Asynchronous lock updates needed visible pending state and rollback on failure. A local save needed to distinguish tool validation from an actual browser write. No match needed a valid pending result, separate from transport or validation failure. These distinctions are observable rather than invented successful responses.

## Verification and limitations

The untouched original build and 105 tests passed. The integrated copy passes those original tests plus eight new rules/storage/real-SDK HTTP tests. A separate new Chrome suite checks the original interface, actual tool traffic, exact calendar edits, retained priorities, estimates, lock rollback, no-match behavior, browser save/restore, original wishlist, failure states, narrow layout and encyclopedia navigation. Fault injection is explicitly labelled. These are developer tests, not independent user research or measured business impact.

The new locks cover single-destination plans; the original multi-destination feature remains available without a claim of new lock support. Costs are reference scenarios, not live offers or spending guarantees; a high scenario may exceed the input budget. There is no booking, payment, current weather/opening guarantee or visa clearance. The demo uses a fictional traveller and no user's face, real trip or work material. Narration is a separate media asset and is not part of this source snapshot.

## What's next

Validate whether travellers understand the locked conditions, receipts and pending choices, then expand individually checked seasonal evidence. Any future language-model or official Alexa adapter would need a separate integration and authorization decision. Neither is implemented or claimed in this entry.

## Built with and product feedback

React, Vite, JavaScript, Node.js, official MCP TypeScript SDK, Streamable HTTP, Zod, Playwright Core and existing Chrome. The demo uses existing FFmpeg. No AWS/Alexa runtime or connected LLM is claimed. Original photos, globe imagery and dependencies retain their licenses and notices.

We used the official MCP SDK at runtime. A browser-oriented example explaining protocol negotiation, stateless Node HTTP integration, and the difference between tool validation and client-local persistence would reduce setup friction. We did not use gated Alexa developer tools or Echo hardware and cannot give hands-on feedback about them.
