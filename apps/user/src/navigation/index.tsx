import {
  NavigationContainer,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ColorSchemeName } from 'react-native';

import { HomePage, NotFound } from '../screens';
import { RootStackParamList } from './interfaces';
import { LinkingConfiguration } from './linking-configuration';
import { Provider as PaperProvider } from 'react-native-paper';
import { DarkTheme, DefaultTheme } from './theme';
import { ShuttleModule } from '../modules';

export interface NavigationProps {
  colorScheme: ColorSchemeName
}

export const Navigation: React.FC<NavigationProps> = ({ colorScheme }) => {
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer
      linking={LinkingConfiguration}
      theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  </PaperProvider>
  )
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name='root' component={HomePage} />
      <Stack.Screen name='shuttles' component={ShuttleModule} />
      <Stack.Screen
        name='notFound'
        component={NotFound}
        options={{ title: 'Oops!' }}
      />
    </Stack.Navigator>
  );
}
