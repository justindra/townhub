import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageRoutes } from './pages';
import { ThemeProvider } from '@material-ui/core';
import { LightTheme } from './theme';

function App() {
  return (
    <ThemeProvider theme={LightTheme}>
      <Router>
        <PageRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
