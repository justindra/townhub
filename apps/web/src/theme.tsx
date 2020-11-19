import React, { useEffect, useState } from 'react';
import {
  createMuiTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core';

const BaseTheme: ThemeOptions = {
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff9800',
    },
  },
  // typography: {
  //     fontFamily: `'Open Sans', 'Helvetica Neue', Arial, sans-serif`,
  //     button: {
  //         fontWeight: 300,
  //         letterSpacing: '2px',
  //     },
  // },
};

const LightTheme = createMuiTheme({
  palette: {
    ...BaseTheme.palette,
    type: 'light',
  },
});

const DarkTheme = createMuiTheme({
  palette: {
    ...BaseTheme.palette,
    type: 'dark',
    background: {
      default: '#0f0f10',
      paper: '#1e1f21',
    },
  },
});

// Define available themes
const colorSchemes: Record<string, string> = {
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
};

export const ThemeProvider: React.FC = ({ children }) => {
  const [scheme, setScheme] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia) return;

    // The listener
    const listener = (e: MediaQueryListEvent) => {
      if (!e || !e.matches) {
        return;
      }
      const schemeNames = Object.keys(colorSchemes);
      for (let i = 0; i < schemeNames.length; i++) {
        const schemeName = schemeNames[i];
        if (e.media === colorSchemes[schemeName]) {
          setScheme(schemeName.toLowerCase());
          break;
        }
      }
    };

    let activeMatches: MediaQueryList[] = [];
    Object.keys(colorSchemes).forEach((schemeName) => {
      const mq = window.matchMedia(colorSchemes[schemeName]);
      mq.addEventListener('change', listener);
      activeMatches.push(mq);
      listener(new MediaQueryListEvent('change', mq));
    });
    // Remove listeners, no memory leaks
    return () => {
      activeMatches.forEach((mq) => mq.removeEventListener('change', listener));
      activeMatches = [];
    };
  }, []);

  // Set the theme, based on the scheme we know
  const theme = scheme === 'dark' ? DarkTheme : LightTheme;
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
