import { createContext, useContext, useReducer } from "react";

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

  // id and timestamp are built here so the reducer stays pure
  function addNotification(message, type = "info") {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: crypto.randomUUID(),
        message,
        type,
        timestamp: Date.now(),
      },
    });
  }

  function removeNotification(id) {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  }

  function clearAll() {
    dispatch({ type: "CLEAR_ALL" });
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
