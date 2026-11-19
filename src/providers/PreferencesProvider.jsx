/* eslint-disable react-refresh/only-export-components */
// Depends on AuthProvider: reads currentUser, so it must be nested inside it.
// Mounting it without AuthProvider throws instead of failing silently.
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
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

  const userId = authCtx.currentUser?.id ?? null;
  const [preferencesByUser, setPreferencesByUser] = useState({});
  const userPreferences =
    preferencesByUser[userId] ?? data.defaultPreferences;
  const itemsPerPage = userPreferences.itemsPerPage;
  const defaultView = userPreferences.defaultView;

  const updateItemsPerPage = useCallback(
    (number) => {
      setPreferencesByUser((previous) => ({
        ...previous,
        [userId]: {
          ...(previous[userId] ?? data.defaultPreferences),
          itemsPerPage: number,
        },
      }));
    },
    [userId],
  );
  const updateDefaultView = useCallback(
    (view) => {
      setPreferencesByUser((previous) => ({
        ...previous,
        [userId]: {
          ...(previous[userId] ?? data.defaultPreferences),
          defaultView: view,
        },
      }));
    },
    [userId],
  );

  const value = useMemo(
    () => ({
      userId,
      itemsPerPage,
      defaultView,
      setItemsPerPage: updateItemsPerPage,
      setDefaultView: updateDefaultView,
    }),
    [userId, itemsPerPage, defaultView, updateItemsPerPage, updateDefaultView],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesProvider;
