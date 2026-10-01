import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ContentProvider } from './content/ContentProvider';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
  </React.StrictMode>,
);
