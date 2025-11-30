import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSecurity } from './utils/security';
import { scheduledPostService } from '@/components/blog/services/scheduledPostService';

// Initialize security features before anything else 
initSecurity();

// Start scheduled post service
scheduledPostService.start();

// Use createRoot API for better performance
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// Render the app
root.render(<App />);

// Report web vitals only in development
if (import.meta.env.DEV) {
  import('./reportWebVitals').then(({ reportWebVitals }) => {
    reportWebVitals();
  });
}
