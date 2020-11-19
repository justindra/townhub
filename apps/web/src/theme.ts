import { createMuiTheme } from '@material-ui/core';

export const LightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff9800'
    }
  },
  // typography: {
  //     fontFamily: `'Open Sans', 'Helvetica Neue', Arial, sans-serif`,
  //     button: {
  //         fontWeight: 300,
  //         letterSpacing: '2px',
  //     },
  // },
});

export const DarkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff9800'
    },
    background: {
      default: '#0f0f10',
      paper: '#1e1f21'
    }
  },
  // typography: {
  //     fontFamily: `'Open Sans', 'Helvetica Neue', Arial, sans-serif`,
  //     button: {
  //         fontWeight: 300,
  //         letterSpacing: '2px',
  //     },
  // },
});
