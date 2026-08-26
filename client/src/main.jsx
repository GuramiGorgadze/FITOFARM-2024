import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoaderProvider } from './context/LoaderContext.jsx';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './language/i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </Router>
  </StrictMode>
);
