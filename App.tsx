import AppNavigator from '@/navigations/AppNavigator';
// import {store} from '@/store/store';
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
