import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { PageRoutes } from './pages';

function App() {
  return (
    <Router>
      <PageRoutes />
    </Router>
  );
}

export default App;
