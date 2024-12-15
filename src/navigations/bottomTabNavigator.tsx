import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';

import AddMedicineDetails from '@/screens/AddMedicineDetails';
import AddWellnessPartner from '@/screens/AddWellnessPartner';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
      <Tab.Screen name="Home" component={AddWellnessPartner} />
      {/* <Tab.Screen name="AddWellnessPartner" component={AddWellnessPartner} /> */}
      <Tab.Screen name="Settings" component={AddMedicineDetails} />
    </Tab.Navigator>
  );
}
