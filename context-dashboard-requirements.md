# Context + Provider Dashboard — Requirements Doc

**Status:** Queued — build after the Redux Toolkit + Saga dashboard is complete.
**Goal:** Fix the two real mistakes from the original `react-provider` project (hidden cross-context coupling, no memoization) by building a project specifically designed to surface and force fixes for both — with a visible way to prove the fix worked.

---

## 1. Why this project exists

The original `react-provider` project had:
1. `DataProvider` silently depending on `useAuth()` + `useUI()` internally — no guard, no visibility, just a runtime crash if mis-nested.
2. No memoization on any provider's `value` — every consumer re-rendered on every provider re-render, with no way to observe it happening.
3. No `useReducer` + Context practice — everything was `useState`.

This project reproduces the same *shape* of problem deliberately, then requires fixing it, with a render-counter panel that makes the fix visible/provable rather than theoretical.

---

## 2. Scope decisions (already settled)

- **No API calls.** All data is local/simulated — button clicks, form inputs, `setTimeout`-staggered fake events. The learning goal is Context mechanics, not data fetching.
- **Single page.** No routing, no `react-router-dom`. "Pages" are sections toggled via a sidebar nav (conditionally rendered `<section>`s within one `App.jsx`).
- **Plain HTML**, no UI library, consistent with the RTK project's styling approach.
- **No backend persistence required.** `localStorage` for preferences is optional/nice-to-have, not required.

---

## 3. Contexts to build (4)

### 3.1 `ThemeContext`
- **State:** `theme` (`'light' | 'dark'`), `fontSize` (`'small' | 'medium' | 'large'`)
- **Actions:** `toggleTheme()`, `setFontSize(size)`
- **Update frequency:** low — changes only on explicit user toggle.
- **Purpose:** baseline "Context is fine for this" case — no coupling, no re-render pressure. Nothing to fix here; it's the control case to compare against.

### 3.2 `AuthContext`
- **State:** `currentUser` (object or `null`) — mock session only, no real credentials/validation.
- **Actions:** `login(user)`, `logout()`
- **Update frequency:** low — changes only when the "viewing as" picker changes.
- **Purpose:** the dependency that `PreferencesContext` will couple to (deliberately).

### 3.3 `PreferencesContext`
- **State:** `itemsPerPage` (number), `defaultView` (string, e.g. `'overview' | 'settings' | 'activity'`)
- **Actions:** `setItemsPerPage(n)`, `setDefaultView(view)`
- **Depends on:** `AuthContext.currentUser` — preferences are conceptually per-user.
- **Required behavior:**
  - Must throw a clear, explicit error if mounted without an ancestor `AuthProvider` (e.g. `if (!authCtx) throw new Error('PreferencesProvider must be nested inside AuthProvider')`).
  - This dependency must be documented in a code comment at the top of the provider file — no silent coupling.
  - **Design question to answer while building, not before:** should this coupling exist at all, or should `currentUser` just be passed as a prop to `PreferencesProvider` instead of read via an internal hook call? Decide once you're in the code and can feel the tradeoff.

### 3.4 `NotificationContext`
- **State:** `notifications` — array of `{ id, message, type, timestamp }`
- **Actions:** implemented via `useReducer`, not `useState`:
  - `ADD_NOTIFICATION` — push a new notification
  - `REMOVE_NOTIFICATION` — remove by id (manual dismiss or auto-dismiss timeout)
  - `CLEAR_ALL` — empty the queue
- **Update frequency:** high, by design — this is the stress-test context.
- **Purpose:** the primary vehicle for observing and fixing the re-render problem.

---

## 4. Dashboard layout / use cases

**Shell (always visible):**
- **Header** — theme toggle button, "viewing as" user picker (`<select>`, populated from a static list in the JSON data), notification bell icon showing unread count
- **Sidebar** — nav buttons: Overview / Settings / Activity (toggles which `<section>` renders in main content, no routing)
- **Main content area** — renders the active section
- **Toast layer** — floating list, top-right, reads from `NotificationContext`, each toast auto-dismisses after ~4s (`REMOVE_NOTIFICATION` fired via `setTimeout`)
- **Debug panel** — fixed corner `<div>`, shows a live render count per major component

### 4.1 Overview section (use case)
- Static/simple content — a welcome message using `currentUser.name`, and a few placeholder "stat" numbers pulled from local JSON (not an API) just to give the page something to show.
- No interactive state changes needed here beyond what Header/Sidebar already drive.

### 4.2 Settings section (use case)
- A form reading/writing `PreferencesContext`: number input for `itemsPerPage`, `<select>` for `defaultView`.
- A "Save Settings" button that, on click, also dispatches a notification via `NotificationContext` ("Settings saved") — this is one of the cross-context-usage touchpoints (a component reading from one context and writing to another).

### 4.3 Activity section (use case) — the stress test
- A button: **"Simulate Activity (5 events)"** — on click, fires 5 `setTimeout`-staggered dispatches to `NotificationContext` (e.g., every 400ms), each pushing a different fake event message from the JSON data's `activityMessages` list.
- **Required observation step:** before adding `useMemo` to any provider, click this button and record the render counts shown in the debug panel for `Header`, `Sidebar`, `SettingsSection`, and `OverviewSection` — none of these should logically need to re-render from a notification push, but without memoization they will.
- **Then:** add `useMemo` to the `NotificationContext` provider's value (and split further if still coupled to something unrelated), re-run the same simulate-activity action, and confirm the same components' render counts stay flat.

### 4.4 Debug panel (use case, cross-cutting)
- Each of `Header`, `Sidebar`, `OverviewSection`, `SettingsSection`, `ActivitySection`, `ToastList` holds a `useRef` counter incremented once per render (in the component body, not in an effect).
- Debug panel component reads these counts (via a simple shared ref object, a dedicated `DebugContext`, or a prop callback — implementation detail to decide while building) and displays them live, updating as renders happen.
- This is the single most important deliverable of the whole project — it's what turns the re-render lesson from theoretical into observed.

---

## 5. States summary table

| Context | State fields | Update trigger | Frequency |
|---|---|---|---|
| `ThemeContext` | `theme`, `fontSize` | Header toggle / settings control | Low |
| `AuthContext` | `currentUser` | Header "viewing as" picker | Low |
| `PreferencesContext` | `itemsPerPage`, `defaultView` | Settings form | Low–medium |
| `NotificationContext` | `notifications[]` | Save actions, Simulate Activity button, auto-dismiss timers | High (by design) |
| Render counters (local, not context) | per-component `useRef` count | Every render of that component | N/A — observation only |

---

## 6. Explicit "done" criteria

- [ ] 4 contexts implemented, each with its own provider file
- [ ] `PreferencesContext` explicitly guards against missing `AuthProvider` ancestor, with a documented reason in a comment
- [ ] `NotificationContext` built with `useReducer`, not `useState`
- [ ] Render-counter debug panel implemented and visibly working
- [ ] Demonstrated (screenshot or just observed live) that `Simulate Activity` causes unrelated components to re-render *before* memoization
- [ ] Demonstrated the same components' render counts stay flat *after* adding `useMemo` to relevant provider values
- [ ] Short written note (a few sentences, can go at the bottom of this doc or in a README) on the `PreferencesContext` → `AuthContext` coupling decision — keep it coupled with a guard, or restructure to avoid it — and why

---

## 7. Explicitly out of scope

- Real authentication/login
- Any API calls or network requests
- Routing / multiple real pages
- Charting libraries or data visualization
- Persisting state across reloads (optional stretch only, not required)
- Automated tests (per earlier decision — not doing testing on this pass)

---

## 8. Data file

See accompanying `context-dashboard-data.json` — contains the static user list (for the "viewing as" picker), placeholder overview stats, and the pool of fake activity messages used by the Simulate Activity button.
