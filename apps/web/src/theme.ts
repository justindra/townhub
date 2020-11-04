import { createMuiTheme } from '@material-ui/core';

export const LightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#1976d2'
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
      main: '#1976d2'
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
