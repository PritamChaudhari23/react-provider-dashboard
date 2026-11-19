/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used in Theme Provider");
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({ theme, fontSize, toggleTheme, setFontSize }),
    [theme, fontSize, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
