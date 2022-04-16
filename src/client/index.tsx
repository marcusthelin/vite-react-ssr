/// <reference types="vite/client" />
// import { createRoot, hydrateRoot } from 'react-dom/client';
import React from 'react';
import { hydrate } from 'react-dom';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './components/App';
const rootElement = document.getElementById('root');

if (import.meta.env.PROD) {
    console.log('Hydrate');
    const root = hydrateRoot(
        rootElement as HTMLElement,
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
    root.render(<App />);
} else {
    const root = createRoot(rootElement as HTMLElement);
    root.render(<App />);
}

// hydrate(<App />, rootElement);
