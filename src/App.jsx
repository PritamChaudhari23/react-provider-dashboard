import { useEffect, useRef, useState } from "react";
import { useAuth } from "./providers/AuthProvider.jsx";
import {
  useNotificationActions,
  useNotifications,
} from "./providers/NotificationProvider.jsx";
import { usePreferences } from "./providers/PreferencesProvider.jsx";
import { useTheme } from "./providers/ThemeProvider.jsx";
import data from "./data.json";

const sections = {
  overview: {
    label: "Overview",
    description: "A quick look at your workspace.",
  },
  settings: {
    label: "Settings",
    description: "Manage your dashboard preferences.",
  },
  activity: {
    label: "Activity",
    description: "Follow recent updates across your workspace.",
  },
};

const fontSizes = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

const renderCounts = {};

function useRenderCounter(name) {
  const count = useRef(0);
  // Render counts are intentionally incremented during render for this demo.
  // eslint-disable-next-line react-hooks/refs
  count.current += 1;
  // eslint-disable-next-line react-hooks/immutability, react-hooks/refs
  renderCounts[name] = count.current;
}

function Header() {
  const { currentUser, login, logout } = useAuth();
  const { theme, fontSize, toggleTheme, setFontSize } = useTheme();
  useRenderCounter("Header");

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">C</span>
        <span>
          <strong>Context Lab</strong>
          <small>Provider dashboard</small>
        </span>
      </div>

      <div className="topbar-actions">
        <label className="user-picker">
          <span>Viewing as</span>
          <select
            aria-label="Viewing as"
            value={currentUser?.id ?? ""}
            onChange={(event) => {
              const selectedUser = data.users.find(
                (user) => String(user.id) === event.target.value,
              );
              if (selectedUser) {
                login(selectedUser);
              } else {
                logout();
              }
            }}
          >
            <option value="">No user</option>
            {data.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>

        <NotificationBell />

        <label className="font-size-picker">
          <span>Text</span>
          <select
            aria-label="Text size"
            value={fontSize}
            onChange={(event) => setFontSize(event.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>

        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
          <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
        </button>
      </div>
    </header>
  );
}

function NotificationBell() {
  const notifications = useNotifications();
  const { clearAll, removeNotification } = useNotificationActions();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-control">
      <button
        className="notification-button"
        type="button"
        aria-label={`Notifications: ${notifications.length}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <svg
          className="bell-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="notification-count">{notifications.length}</span>
      </button>
      {isOpen && (
        <div className="notification-menu">
          <div className="notification-menu-heading">
            <strong>Notifications</strong>
            <button type="button" onClick={clearAll} disabled={!notifications.length}>
              Clear all
            </button>
          </div>
          {notifications.length ? (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <span>{notification.message}</span>
                  <button
                    type="button"
                    aria-label={`Dismiss ${notification.message}`}
                    onClick={() => removeNotification(notification.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-notifications">You’re all caught up.</p>
          )}
        </div>
      )}
    </div>
  );
}

function Sidebar({ activeView, onNavigate }) {
  useRenderCounter("Sidebar");

  return (
    <aside className="sidebar">
      <p className="nav-heading">WORKSPACE</p>
      <nav aria-label="Dashboard sections">
        {Object.entries(sections).map(([view, section]) => (
          <button
            className={`nav-item${activeView === view ? " active" : ""}`}
            key={view}
            type="button"
            aria-current={activeView === view ? "page" : undefined}
            onClick={() => onNavigate(view)}
          >
            <span className={`nav-indicator nav-indicator-${view}`} aria-hidden="true" />
            {section.label}
            {view === "activity" && (
              <span className="nav-badge">{data.activityMessages.length}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-note">
        <span className="note-icon" aria-hidden="true">i</span>
        <p>Explore how providers share state across your app.</p>
      </div>
    </aside>
  );
}

function OverviewSection() {
  const { currentUser } = useAuth();
  useRenderCounter("OverviewSection");

  return (
    <section className="content-card overview-card">
      <div className="section-eyebrow">YOUR WORKSPACE</div>
      <h2>Welcome back{currentUser ? `, ${currentUser.name}` : ""}.</h2>
      <p className="section-intro">
        Here’s what’s happening across your projects today.
      </p>
      <div className="stat-grid">
        {data.overviewStats.map((stat, index) => (
          <article className="stat-card" key={stat.label}>
            <span className={`stat-icon stat-icon-${index}`} aria-hidden="true">
              {["↗", "✓", "◷", "◎"][index]}
            </span>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
            <small>{index === 2 ? "Needs attention" : "Across your workspace"}</small>
          </article>
        ))}
      </div>
      <div className="overview-footer">
        <span className="status-dot" />
        All systems are up to date
      </div>
    </section>
  );
}

function SettingsSection({ onNotify }) {
  const {
    userId,
    itemsPerPage,
    defaultView,
    setItemsPerPage,
    setDefaultView,
  } = usePreferences();
  const [itemsPerPageDraft, setItemsPerPageDraft] = useState(
    String(itemsPerPage),
  );
  const [defaultViewDraft, setDefaultViewDraft] = useState(defaultView);
  const [error, setError] = useState("");

  useRenderCounter("SettingsSection");

  function saveSettings(event) {
    event.preventDefault();
    const parsedItemsPerPage = Number(itemsPerPageDraft);
    if (!Number.isInteger(parsedItemsPerPage) || parsedItemsPerPage < 1) {
      setError("Enter a whole number greater than zero.");
      return;
    }

    setError("");
    setItemsPerPage(parsedItemsPerPage);
    setDefaultView(defaultViewDraft);
    onNotify("Settings saved", "success");
  }

  return (
    <section className="content-card settings-card">
      <div className="section-eyebrow">PREFERENCES</div>
      <h2>Dashboard settings</h2>
      <p className="section-intro">
        Choose how information is presented in your dashboard.
      </p>
      <form className="settings-form" onSubmit={saveSettings}>
        <label className="form-field">
          <span>Items per page</span>
          <small>Choose how many items to show in lists.</small>
          <input
            type="number"
            min="1"
            step="1"
            required
            value={itemsPerPageDraft}
            onChange={(event) => setItemsPerPageDraft(event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Default view</span>
          <small>Select the section to use as your preferred starting point.</small>
          <select
            value={defaultViewDraft}
            onChange={(event) => setDefaultViewDraft(event.target.value)}
          >
            {data.viewOptions.map((view) => (
              <option value={view} key={view}>
                {view[0].toUpperCase() + view.slice(1)}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-footer">
          <span>
            {userId === null
              ? "These preferences apply while no user is selected."
              : "Preferences are saved for the selected user."}
          </span>
          <button className="primary-button" type="submit">
            Save Settings
          </button>
        </div>
      </form>
    </section>
  );
}

function ActivitySection({ onNotify }) {
  const [isRunning, setIsRunning] = useState(false);
  const timerIds = useRef([]);

  useRenderCounter("ActivitySection");

  useEffect(
    () => () => {
      timerIds.current.forEach((timerId) => window.clearTimeout(timerId));
    },
    [],
  );

  function simulateActivity() {
    setIsRunning(true);
    timerIds.current = data.activityMessages.slice(0, 5).map((message, index) =>
      window.setTimeout(() => {
        const type = data.notificationTypes[index % data.notificationTypes.length];
        onNotify(message, type);
        if (index === 4) {
          timerIds.current = [];
          setIsRunning(false);
        }
      }, index * 400),
    );
  }

  return (
    <section className="content-card activity-card">
      <div className="section-eyebrow">LIVE FEED</div>
      <h2>Recent activity</h2>
      <p className="section-intro">
        Send a short burst of simulated workspace events to the notification queue.
      </p>
      <div className="activity-simulator">
        <div>
          <span className="simulator-icon" aria-hidden="true">◷</span>
          <strong>Notification stress test</strong>
          <p>Five local events, staggered by 400 milliseconds.</p>
        </div>
        <button
          className="primary-button"
          type="button"
          disabled={isRunning}
          onClick={simulateActivity}
        >
          {isRunning ? "Simulating activity…" : "Simulate Activity (5 events)"}
        </button>
      </div>
    </section>
  );
}

function Toast({ notification }) {
  const { removeNotification } = useNotificationActions();

  useEffect(() => {
    const timerId = window.setTimeout(
      () => removeNotification(notification.id),
      4000,
    );
    return () => window.clearTimeout(timerId);
  }, [notification.id, removeNotification]);

  return (
    <div className={`toast toast-${notification.type}`}>
      <span className="toast-mark" aria-hidden="true">✓</span>
      <span>{notification.message}</span>
      <button
        type="button"
        aria-label={`Dismiss ${notification.message}`}
        onClick={() => removeNotification(notification.id)}
      >
        ×
      </button>
    </div>
  );
}

function ToastList() {
  const notifications = useNotifications();
  useRenderCounter("ToastList");

  return (
    <div
      className="toast-layer"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

function DebugPanel() {
  const { memoizationEnabled, setMemoizationEnabled } =
    useNotificationActions();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCounts({ ...renderCounts });
    }, 250);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <aside className="debug-panel" aria-label="Render counters">
      <div className="debug-heading">
        <span className="debug-live-dot" />
        <strong>Render monitor</strong>
        <span className="debug-live-label">
          {memoizationEnabled ? "MEMOIZED" : "LEGACY MODE"}
        </span>
      </div>
      <p className="debug-caption">
        Component renders in this session
      </p>
      <ul>
        {[
          "Header",
          "Sidebar",
          "OverviewSection",
          "SettingsSection",
          "ActivitySection",
          "ToastList",
        ].map((name) => (
          <li key={name}>
            <span>{name}</span>
            <strong>{counts[name] ?? 0}</strong>
          </li>
        ))}
      </ul>
      <label className="debug-toggle">
        <input
          type="checkbox"
          checked={memoizationEnabled}
          onChange={(event) => setMemoizationEnabled(event.target.checked)}
        />
        <span>Memoize notification actions</span>
      </label>
      <p className="debug-help">
        Turn this off to observe legacy context-value churn, then simulate activity.
      </p>
    </aside>
  );
}

function App() {
  const { theme, fontSize } = useTheme();
  const { defaultView, userId } = usePreferences();
  const { addNotification } = useNotificationActions();
  const [activeView, setActiveView] = useState(defaultView);
  const section = sections[activeView] ?? sections.overview;

  return (
    <div
      className="app-shell"
      data-theme={theme}
      style={{ "--font-size": fontSizes[fontSize] ?? fontSizes.medium }}
    >
      <Header />
      <div className="dashboard-layout">
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
        />
        <main className="main-content">
          <div className="page-heading">
            <div>
              <div className="breadcrumb">Workspace <span>/</span> Dashboard</div>
              <h1>{section.label}</h1>
              <p>{section.description}</p>
            </div>
            <span className="date-chip">Provider patterns · Demo</span>
          </div>

          <div className="section-stack">
            <div hidden={activeView !== "overview"}>
              <OverviewSection />
            </div>
            <div hidden={activeView !== "settings"}>
              <SettingsSection
                key={userId ?? "guest"}
                onNotify={addNotification}
              />
            </div>
            <div hidden={activeView !== "activity"}>
              <ActivitySection onNotify={addNotification} />
            </div>
          </div>
        </main>
      </div>

      <ToastList />
      <DebugPanel />
    </div>
  );
}

export default App;
