import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import { merge } from 'lodash';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      // myOwnColor: string;
    }

    interface Theme {
      spacing: (multiplier?: number) => number;
    }
  }
}

const spacing = (multiplier: number = 1) => multiplier * 20;

const OverrideTheme = {
  spacing,
  roundness: 8,
};

export const DefaultTheme = merge(
  {},
  PaperDefaultTheme,
  NavigationDefaultTheme,
  OverrideTheme
);
export const DarkTheme = merge(
  {},
  PaperDarkTheme,
  NavigationDarkTheme,
  OverrideTheme
);
