import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Kreiranje React root-a na DOM elementu sa id="root"
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderovanje glavne App komponente unutar StrictMode za detekciju potencijalnih problema
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
