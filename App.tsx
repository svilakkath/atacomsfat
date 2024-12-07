import AppNavigator from '@/navigations';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
export default App;
