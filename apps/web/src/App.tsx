import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageRoutes } from './pages';
import { ThemeProvider } from '@material-ui/core';
import { LightTheme, DarkTheme } from './theme';

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
