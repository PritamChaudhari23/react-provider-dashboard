// Depends on AuthProvider: reads currentUser, so it must be nested inside it.
// Mounting it without AuthProvider throws instead of failing silently.
import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import data from "../data.json";

const PreferencesContext = createContext(null);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used in Preferences Provider");
  }
  return context;
};

const PreferencesProvider = ({ children }) => {
  const authCtx = useContext(AuthContext);
  if (!authCtx) {
    throw new Error("PreferencesProvider must be nested inside AuthProvider");
  }

  const [itemsPerPage, setItemsPerPage] = useState(
    data.defaultPreferences.itemsPerPage,
  );
  const [defaultView, setDefaultView] = useState(
    data.defaultPreferences.defaultView,
  );

  const userId = authCtx.currentUser?.id ?? null;

  return (
    <PreferencesContext.Provider
      value={{
        userId,
        itemsPerPage,
        defaultView,
        setItemsPerPage,
        setDefaultView,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesProvider;
