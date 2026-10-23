# Soya Shanhe — original-product contest snapshot

Snapshot version **0.4.0-contest.1**, based on public Soya Travel Calendar commit `9309a31188f74f3df4e4f8dd6ab017dadcc600b4`. All 415 original files were checked against that commit's public Git blob hashes before copying. The production website, original repository and other working directories were not edited.

This copy preserves the original Chinese product: paper background, globe, photographs, navigation, 79 inspiration records, encyclopedia, guides, wishlist, personal lists and the existing date/budget entry. The contest additions live inside the existing destination/planning flow. The earlier separate English lab interface and its video are superseded and are not this entry.

## Run

Requires Node.js 22.12+ and npm. No model key, account, paid service or persistent authorization is needed. Initial dependency installation uses public npm. There is no deployment step.

```sh
npm ci --ignore-scripts --registry=https://registry.npmjs.org
npm run build
npm test
npm run start:contest
```

Open `http://127.0.0.1:8080`. An occupied port can be changed with `PORT=8081 npm run start:contest`. `npm run dev` also serves the local MCP route. The original `npm start` command is retained as the baseline static/reference server; use `start:contest` for this tool-enabled copy. Stop with Ctrl+C. Optional new UI checks: `npm run test:season-browser`, using an already installed Chrome (`CHROME_PATH` if needed); no browser is downloaded.

## Original interface, added flow

1. Use the original globe/cards and calendar to choose a destination and exact start/end dates, departure city, budget and interest. Existing guides, encyclopedia and all original records remain available.
2. Click **季节依据与偏好保留** below the selected destination's original card, or expand that section below the globe. Start from the current destination. It will only generate if that destination meets the original filter; it does not silently replace an ineligible initial choice.
3. The original date range and derived number of days are retained. Budget, origin, duration, interest and pace are initially locked; dates and scope can be adjusted. Use the same original inputs to change conditions. Unlock a field explicitly before changing it. Date-range changes that alter locked duration are rejected.
4. The receipt names every changed condition/destination and the unchanged values. If the current destination no longer fits, replacement first satisfies the original filter across all 79 records, then prefers eligible records with the added seasonal annotations. This does not change the original browsing order. Historical evidence remains conditional.
5. To demonstrate a no-match case, explicitly unlock budget and request the fictional test budget of CNY 500. The complete catalogue has no match for the example's other conditions. Committed input values and itinerary remain intact. Choose a listed relaxation explicitly or cancel; a locked-field relaxation separately asks for unlock confirmation.
6. Click **保存偏好计划到本机**. Refresh and use **恢复本机偏好计划**. Locks, receipts and a pending decision are retained. The original wishlist and other local records are not replaced.

## Real MCP and honest storage

The official MCP SDK 1.29.0 handles Streamable HTTP on `/mcp`, protocol 2025-11-25. The original page sends real initialize, initialized, tools/list and tools/call messages. Four tools query, generate, modify and prepare/restore a browser-local save. The collapsed exchange panel shows real inputs, outputs and errors. The workflow is user-directed structured rules, without a connected model, arbitrary natural-language understanding, autonomous agent or official Alexa connection.

`save_plan` returns `validated_for_browser_storage` and `serverPersisted:false`. It does not falsely claim a server save. Only a successful actual `localStorage.setItem` followed by verification causes the client to show saved status. Restore is validated through the tool before applying. A failed write leaves an explicit error; an older save requires confirmation before discarding a newer draft. The service stores only bounded revision counters in memory, not plan files or account data.

New records use the separate `shanhe-contest-season-plan-v1` browser key. Requests contain only allowlisted planning fields and reference rates; no profile, passport, visa documents, OCR text, personal destination list or wishlist is sent to MCP. Existing original local-storage behavior is retained. Use fictional demo data. Storage is not encrypted and this remains a single-user loopback prototype. Back up data before clearing browser storage. Remove the isolated copy to uninstall; retain any browser exports you want to keep.

## Source and financial limits

The original `getCandidates`, `estimate`, `makeItinerary`, date-range support (1–60 days through 2029) and full record set are preserved. Source helpers add annotations, not narrower replacement date rules. Kyoto uses general JNTO guidance; Beijing's 2026 material reused later is conditional; Harbin's 2025–2026 briefing does not confirm any selected future winter. Other records retain original source links and are explicitly marked as not individually rechecked by this contest addition.

Planning uses the original central estimate for eligibility and displays the original low/high range. The high scenario can exceed the user's input budget and is flagged; there is no guarantee of real spending. Departure-city intent is retained in the draft, but transportation is still an inherited static scenario, not a route quote. The plan pins the same reference-rate snapshot for consistent changes. No current price, availability, weather, opening, visa clearance, booking or payment is provided. Original reference-data APIs remain original features; offline/browser tests abort them and show the real historical fallback, without forged API successes.

The new lock workflow currently covers **single-destination plans**. The original multi-destination trip feature is preserved and is not claimed to have the new locks. No independent user, physical-phone or production-readiness validation is claimed.

## Validation and materials

Before modification the original build and all 105 original tests passed. New tests are separate: eight rules/storage/real-SDK HTTP checks and a new original-interface browser suite. The current run evidence and screenshots are delivered separately from source; old substitute-page test counts do not count as this integration's validation. API/transport/storage fault injections are explicitly labelled tests.

Read the original [README](README.md), [English guide](README.en.md), [privacy guidance](PRIVACY.md), [third-party notices](THIRD_PARTY_NOTICES.md) and [media credits](docs/media-credits.md). Original photography, globe textures, icons and other assets retain their own terms; the code MIT license does not relicense them. Demo recording, English entry copy and the new safe source snapshot must describe this original interface. This independent source repository is https://github.com/soyoungzsy/soya-shanhe-amazon-2026. Source publication does not establish registration or contest submission; those require a Devpost receipt. Keep submitted materials unchanged after the deadline through December 3, independently of the main product upstream.
