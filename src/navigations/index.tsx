import MedicineDetails from '@/screens/MedicineDetails';
import Login from '@/screens/SignUp';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import BottomTabNavigator from './bottomTabNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="BottomNavigator" component={BottomTabNavigator} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MedicineDetails" component={MedicineDetails} />
    </Stack.Navigator>
  );
}
