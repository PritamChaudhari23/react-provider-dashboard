// providers/DataProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useUI } from './UIProvider';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const { setLoading, setError } = useUI();

  const [posts, setPosts] = useState([]);

  // existing logic
  const fetchSecretData = async () => {
    if (!user) {
      setError('Not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await new Promise((res) => setTimeout(res, 600));
      return `Secret data for ${user.name}`;
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: fetch posts
  const fetchPosts = async () => {
    if (!user) {
      setError('Login to see posts');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await res.json();

      setPosts(data.slice(0, 5));
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        fetchSecretData,
        fetchPosts,
        posts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
