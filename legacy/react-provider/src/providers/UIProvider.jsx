// providers/UIProvider.jsx
import { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <UIContext.Provider value={{ loading, error, setLoading, setError }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
}
