import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [message, setMessage] = useState(null);

  const openModal = (msg) => setMessage(msg);
  const closeModal = () => setMessage(null);

  return (
    <ModalContext.Provider value={{ message, openModal, closeModal }}>
      {children}
      {message && (
        <div style={{ border: '1px solid black', padding: 10 }}>
          <p>{message}</p>
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('useModal must be used inside ModalProvider');
  }
  return ctx;
}
