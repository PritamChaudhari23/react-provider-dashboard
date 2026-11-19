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

  const [itemsPerPage, setItemsPerPage] = useState(
    data.defaultPreferences.itemsPerPage,
  );
  const [defaultView, setDefaultView] = useState(
    data.defaultPreferences.defaultView,
  );

  const userId = authCtx.currentUser?.id ?? null;
  const updateItemsPerPage = useCallback((number) => {
    setItemsPerPage(number);
  }, []);
  const updateDefaultView = useCallback((view) => {
    setDefaultView(view);
  }, []);

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
