# SteamEdge 1.2.0: changes from upstream 1.0.1

## Comparison basis

Compared the supplied upstream repository at `0644e54ae4c6db0b30346f948af1a9c6027f828e` (the checked-out `main` commit) with this 1.2.0 source. The 1.2.0 side is on branch `braxffa/steamedge-1.2.0-english`. The application diff has 60 changed paths, including three file moves, with 11,225 insertions and 3,304 deletions. This ledger adds one documentation path, so the staged repository diff has 61 paths (11,292 insertions and 3,304 deletions). The accompanying full binary-capable patch records the exact staged diff.

## User-visible and functional changes

- **Realistic Mode:** new achievement-farming page and engine flow. It plans and queues games, spaces achievement unlocks, supports timing/target options, resumes or accelerates overdue steps, tracks unsupported games, reports progress, and can stop the run.
- **Steam chat:** new direct-friend chat page with friend/conversation lists, online state, message history, unread/read handling, sending, typing notifications, desktop notifications, and optional automatic replies with a per-person cooldown. Group chat is not implemented.
- **In-app update check:** checks GitHub releases and compares version numbers; shows status and a release-page link. It does not download or install an update automatically.
- **Localization and complete English cleanup:** adds an English dictionary plus German, Spanish, Russian, and Chinese dictionaries. A final English (US) audit replaces the remaining Turkish UI strings and standardizes wording throughout sign-in/QR and Steam Guard, account setup, inventory and market flows, sales dialogs, overview, settings and memory text, notifications/toasts, timer abbreviations, credits, and friend-chat auto-replies. SteamEdge's English locale now presents a consistent English interface throughout; dynamic page text is translated as it appears.
- **Missed auto-reply default fixed:** the built-in “away” reply is now English in source and the clean source package. The existing saved setting in the current app was changed only when it still equaled the old Turkish default; it now contains the English default.
- **Hour booster and session timing:** restores the saved game selection reliably; persists duration, concurrency, and sync choices as they change; improves queue/progress/timer rendering; adds synchronized playtime planning and a ledger to track each game's remaining time; supports sequential/looping behavior and improved restart/stop handling.
- **Overview and achievement screens:** refreshes current farming/boost status and progress, and improves achievement information and update feedback.
- **Inventory and market:** updates English UI, item pricing/history flows, progress/cancellation handling, and sale feedback; uses cached listings where available.
- **Settings and account handling:** adds or revises chat, language, update, memory, import/export/reset, and account controls; fixes copy/status feedback and the requested author/contributor credit layout. The contributor is `@braxffa`.
- **Desktop packaging and project presentation:** version 1.2.0, Windows icon, refreshed logos/buttons and README, and a smaller source tree. Removes the embedded `Software-3.5.zip`.
- **Dependencies and application bridge:** updates the Electron/build dependencies and lockfile, adds dependency overrides, and exposes the new features through the isolated preload API.

## Complete changed-path ledger

### Project metadata, legal files, and web assets
- `.gitignore` — adds generated/runtime-data exclusions for the source and package workflow.
- `LICENSE` — replaced the project-specific legal addendum with the GNU AGPL v3 license text.
- `NOTICE` — adds the project attribution and license notice.
- `README.md` — rewritten for the 1.2.0 project, features, and usage.
- `assets/btn-changelog-dark.svg`, `assets/btn-changelog.svg`, `assets/btn-download.svg`, `assets/btn-quick-start-dark.svg`, `assets/btn-quick-start.svg`, `assets/btn-report-bug-dark.svg`, `assets/btn-report-bug.svg`, `assets/btn-star-dark.svg`, `assets/btn-star.svg`, `assets/btn-tutorial-dark.svg`, `assets/btn-tutorial.svg`, `assets/divider.svg`, `assets/logo-mark.svg` — add the refreshed project-site buttons, divider, and vector logo.

### Electron runtime, dependencies, and core services
- `main.js` — version 1.2.0 runtime changes: account/auth flow, notifications, settings persistence, chat and auto-reply, realistic-mode orchestration, updater, memory controls, and related IPC handlers.
- `package.json`, `package-lock.json` — set version 1.2.0; update package metadata, Electron packaging dependencies, overrides, and resolved dependency versions.
- `preload.js` — adds typed bridge methods for chat, realistic mode, update checks, locale loading, memory controls, settings, and engine events.
- `src/core/esitlemeDefteri.js` — new playtime synchronization ledger and timeline planner.
- `src/engine/farmController.js` → `src/core/farmController.js` — moved; file content is unchanged (Git R100).
- `src/engine/steamEngine.js` → `src/core/steamEngine.js` — moved and substantially updated for chat events/auto-reply, Steam connection handling, playtime sync, market/history, and achievement operations (Git R062).
- `src/auth/steamAuth.js` → `src/services/steamAuth.js` — moved and updated Steam authentication service (Git R064).
- `src/services/guncelleme.js` — new GitHub release/version check with timeout and error reporting.
- `src/configs/.gitkeep`, `src/core/.gitkeep`, `src/services/.gitkeep`, `src/utils/.gitkeep` — retain the reorganized source directories.
- `src/assets/icon.ico` — adds the Windows application icon.
- `src/assets/logo-banner.png`, `src/assets/logo-mark.png` — removes the old raster logos.
- `src/assets/logo-mark.svg` — adds the vector logo used by the refreshed UI.

### Login, renderer logic, language files, and pages
- `src/login/login.html` — updates the login view and QR/Steam Guard copy for the localized interface.
- `src/main/js/ayarlar.js` — updates settings controls, account actions, language selection, update/memory controls, and credits behavior.
- `src/main/js/basarim.js` — updates achievement loading, display, and result handling.
- `src/main/js/common.js` — shared localization, notifications/toasts, navigation, and chat UI behavior.
- `src/main/js/env.js` — inventory/market flows, pricing and sales-history display, and sale feedback.
- `src/main/js/genel.js` — overview status and live farming/boost progress.
- `src/main/js/gercekci.js` — new Realistic Mode renderer and controls.
- `src/main/js/i18n.js` — replaces the prior translation implementation with dictionary loading and dynamic DOM translation.
- `src/main/js/kart.js` — routes card-page text through the selected locale.
- `src/main/js/lang/de.json`, `src/main/js/lang/en.json`, `src/main/js/lang/es.json`, `src/main/js/lang/ru.json`, `src/main/js/lang/zh.json` — add the five UI dictionaries; English includes the requested corrected login, market, timer, toast, credits, and chat wording.
- `src/main/js/saat.js` — hour-booster persistence, saved-list restoration, live timers/progress, concurrency, and synchronized/sequential queue controls.
- `src/main/js/sohbet.js` — new direct Steam chat renderer, history, unread state, and sending controls.
- `src/main/main.html` — updates the application shell/navigation and mounts the new pages.
- `src/main/pages/Software-3.5.zip` — removes an embedded archive that is not part of the app's runtime.
- `src/main/pages/ayarlar.html` — settings UI, memory/chat controls, and aligned developer/contributor credits.
- `src/main/pages/basarim.html` — achievement page layout and translated copy.
- `src/main/pages/env.html` — inventory/market UI and translated listing/sale/history labels.
- `src/main/pages/gercekci.html` — new Realistic Mode page.
- `src/main/pages/kart.html` — card farming page translation and display updates.
- `src/main/pages/saat.html` — hour booster controls and timer labels.
- `src/main/pages/sohbet.html` — new Steam chat page.
- `src/main/style/edge.css` — updated page, control, timer, chat, and credit-badge styling, including the requested consistent badge separators and red contributor outline.
