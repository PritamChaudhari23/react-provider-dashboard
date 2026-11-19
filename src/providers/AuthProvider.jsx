/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import data from "../data.json";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used in Auth Provider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(data.users[0]);

  const login = useCallback((user) => {
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({ currentUser, login, logout }),
    [currentUser, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
