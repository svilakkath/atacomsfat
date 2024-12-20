import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';

import AddMedicineDetails from '@/screens/AddMedicineDetails';
import Home from '@/screens/Home';
import WellnessPartnerList from '@/screens/WellnessPartnerList';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="WellnessPartnersList" component={WellnessPartnerList} />
      <Tab.Screen name="Profile" component={AddMedicineDetails} />
    </Tab.Navigator>
  );
}
