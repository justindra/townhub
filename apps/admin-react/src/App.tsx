import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageRoutes } from './pages';

const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <PageRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
