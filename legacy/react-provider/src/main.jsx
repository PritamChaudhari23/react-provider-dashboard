// index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { AuthProvider } from './providers/AuthProvider';
import { DataProvider } from './providers/DataProvider';
import { ModalProvider } from './providers/ModalProvider';
import { UIProvider } from './providers/UIProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <UIProvider>
      <DataProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </DataProvider>
    </UIProvider>
  </AuthProvider>
);
