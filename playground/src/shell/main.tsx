import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import faviconUrl from '@ds/assets/logo/svg/mm-symbol-blue.svg?url';
import './shell.css';
import { App } from './App';

document.head.append(Object.assign(document.createElement('link'), { rel: 'icon', href: faviconUrl }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
