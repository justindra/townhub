import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageRoutes } from './pages';
import { ThemeProvider } from '@material-ui/core';
import { DarkTheme } from './theme';

import { DEFAULT_CONTEXT_VALUE, TownhubProvider } from './state';

function App() {
  return (
    <TownhubProvider value={DEFAULT_CONTEXT_VALUE}>
      <ThemeProvider theme={DarkTheme}>
        <Router>
          <PageRoutes />
        </Router>
      </ThemeProvider>
    </TownhubProvider>
  );
}

export default App;
