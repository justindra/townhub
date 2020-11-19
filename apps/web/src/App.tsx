import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageRoutes } from './pages';
import { ThemeProvider } from './theme';

import { DEFAULT_CONTEXT_VALUE, TownhubProvider } from './state';

function App() {
  // Need to fix viewport heights for mobile usage
  // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  return (
    <TownhubProvider value={DEFAULT_CONTEXT_VALUE}>
      <ThemeProvider>
        <Router>
          <PageRoutes />
        </Router>
      </ThemeProvider>
    </TownhubProvider>
  );
}

export default App;
