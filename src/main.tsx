import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toast } from '@vapor-ui/core';
import { toastManager } from './lib/toastManager';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toast.Provider toastManager={toastManager}>
      <App />
    </Toast.Provider>
  </StrictMode>,
);
