# Context Lab — Provider Dashboard

A single-page React dashboard for practicing Context providers, reducer-based
state, and observing component renders. All data and notifications are local;
the app makes no API requests.

## Run locally

```sh
npm install
npm run dev
```

Use `npm run build` to create a production build and `npm run lint` to lint the
main project. The archived `legacy/` examples are excluded from the root lint
configuration and have not been changed.

## Explore the dashboard

- Choose a mock user in the header; preferences are stored in memory per user.
- Use Settings to change the page size and default view. Saving adds a toast.
- In Activity, run **Simulate Activity (5 events)** to dispatch five staggered
  local notifications.
- The fixed Render monitor tracks Header, Sidebar, each section, and ToastList.
  Turn off **Memoize notification actions** to reproduce legacy value churn;
  turn it back on and repeat to compare the counts.
- Notifications appear in the toast layer and bell menu, and automatically
  dismiss after four seconds.

`PreferencesProvider` intentionally reads `AuthContext` and checks that it is
nested under `AuthProvider`. This avoids prop-drilling the current mock user
while making the dependency explicit and failing clearly if the provider tree
is incorrect.
