import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './language/i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
