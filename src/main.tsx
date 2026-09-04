import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/base.css';
import './styles/layout.css';
import './styles/sections.css';
import './styles/quote.css';
import './styles/gallery-fix.css';
import './styles/desktop-wide.css';

const container = document.getElementById('root');
if (!container) throw new Error('Elemento #root não encontrado no HTML.');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
