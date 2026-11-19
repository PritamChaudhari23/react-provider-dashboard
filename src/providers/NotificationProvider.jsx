/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used in Notification Provider");
  }
  return context;
};

function notificationReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return [...state, action.payload];
    case "REMOVE_NOTIFICATION":
      return state.filter((n) => n.id !== action.payload);
    case "CLEAR_ALL":
      return [];
    default:
      return state;
  }
}

const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  // IDs and timestamps are built outside the reducer so the reducer stays pure.
  const addNotification = useCallback((message, type = "info") => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: crypto.randomUUID(),
        message,
        type,
        timestamp: Date.now(),
      },
    });
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  const value = useMemo(
    () =>
      ({
        notifications,
        addNotification,
        removeNotification,
        clearAll,
      }),
    [notifications, addNotification, removeNotification, clearAll],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
