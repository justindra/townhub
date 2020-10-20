import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import { merge } from 'lodash';

export const DefaultTheme = merge({}, PaperDefaultTheme, NavigationDefaultTheme);
export const DarkTheme = merge({}, PaperDarkTheme, NavigationDarkTheme);