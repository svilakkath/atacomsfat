import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';

import Home from '@/screens/Home';
import Settings from '@/screens/Settings';
import AddWellnessPartner from '@/screens/Users';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="AddWellnessPartner" component={AddWellnessPartner} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
