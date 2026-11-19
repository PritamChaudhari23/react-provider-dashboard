import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import NotificationProvider from "./providers/NotificationProvider.jsx";
import PreferencesProvider from "./providers/PreferencesProvider.jsx";
import ThemeProvider from "./providers/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PreferencesProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </PreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
