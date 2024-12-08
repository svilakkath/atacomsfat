import EditUserProfile from '@/screens/EditUserProfile';
import Login from '@/screens/Login';
import SignUp from '@/screens/SignUp';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import BottomTabNavigator from './bottomTabNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="TestScreen">
      <Stack.Screen name="BottomNavigator" component={BottomTabNavigator} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="TestScreen" component={EditUserProfile} />
    </Stack.Navigator>
  );
}
