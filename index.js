import React from 'react';
import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import App from './App';
import {name as appName} from './app.json';
import {theme} from './src/assets/theme';

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
