import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';

import AddMedicineDetails from '@/screens/AddMedicineDetails';
import AddWellnessPartner from '@/screens/AddWellnessPartner';
import WellnessPartnerList from '@/screens/WellnessPartnerList';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="WellnessPartnerList">
      <Tab.Screen name="Home" component={AddWellnessPartner} />
      <Tab.Screen name="WellnessPartnerList" component={WellnessPartnerList} />
      <Tab.Screen name="Settings" component={AddMedicineDetails} />
    </Tab.Navigator>
  );
}
