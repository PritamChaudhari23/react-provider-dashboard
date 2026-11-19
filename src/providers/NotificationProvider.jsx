/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";

const NotificationStateContext = createContext(null);
const NotificationActionsContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationStateContext);
  if (!context) {
    throw new Error("useNotifications must be used in Notification Provider");
  }
  return context;
};

export const useNotificationActions = () => {
  const context = useContext(NotificationActionsContext);
  if (!context) {
    throw new Error(
      "useNotificationActions must be used in Notification Provider",
    );
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
  const [memoizationEnabled, setMemoizationEnabled] = useState(true);

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

  const memoizedActions = useMemo(
    () => ({
      addNotification,
      removeNotification,
      clearAll,
      memoizationEnabled,
      setMemoizationEnabled,
    }),
    [
      addNotification,
      removeNotification,
      clearAll,
      memoizationEnabled,
      setMemoizationEnabled,
    ],
  );
  const actions = memoizationEnabled
    ? memoizedActions
    : { ...memoizedActions };

  return (
    <NotificationStateContext.Provider value={notifications}>
      <NotificationActionsContext.Provider value={actions}>
        {children}
      </NotificationActionsContext.Provider>
    </NotificationStateContext.Provider>
  );
};

export default NotificationProvider;
