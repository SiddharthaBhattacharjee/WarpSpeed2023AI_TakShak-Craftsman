import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppcontextProvider } from "./components/context";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppcontextProvider>
    <App />
    </AppcontextProvider>
  </React.StrictMode>
);