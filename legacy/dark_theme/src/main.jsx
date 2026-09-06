import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './radio/App.jsx';
import ThemeProvider from './radio/ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
