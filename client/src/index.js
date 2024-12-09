import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LlamaAPIProvider } from "./Context/LlamaAPIContext.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LlamaAPIProvider>
      <App />
    </LlamaAPIProvider>
  </React.StrictMode>
);
