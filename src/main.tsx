
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW, installPrompt } from './registerSW'

// Register service worker for PWA
registerSW();

// Setup install prompt
installPrompt();

createRoot(document.getElementById("root")!).render(<App />);
