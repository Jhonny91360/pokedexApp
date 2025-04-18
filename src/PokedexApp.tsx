import 'react-native-gesture-handler';
import React from 'react';
import {StackNavigator} from './presentation/navigator/StackNavigator';
import {ThemeContextProvider} from './presentation/context/ThemeContext';

export const PokedexApp = () => {
  return (
    <ThemeContextProvider>
      <StackNavigator />
    </ThemeContextProvider>
  );
};
