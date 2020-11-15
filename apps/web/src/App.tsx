import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageRoutes } from './pages';
import { ThemeProvider } from '@material-ui/core';
import { LightTheme, DarkTheme } from './theme';

import { TownhubApi } from './state';

TownhubApi.updateTownId('1eefd261-6b35-4f2a-8e44-fffec17b2f1a');

function App() {
  return (
    <ThemeProvider theme={DarkTheme}>
      <Router>
        <PageRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
