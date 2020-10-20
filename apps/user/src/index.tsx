import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import { Navigation } from './navigation';

export const App: React.FC = () => {
  const isLoadingComplete = useCachedResources();
  // Default to light mode
  const colorScheme = useColorScheme() || 'light';

  if (!isLoadingComplete) {
    return null;
  } else {
    return (

      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar style={colorScheme}/>
      </SafeAreaProvider>
    );
  }
}
