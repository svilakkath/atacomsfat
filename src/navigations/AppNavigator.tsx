import auth from '@react-native-firebase/auth';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';

import AddMedicineDetails from '@/screens/AddMedicineDetails';
import AddWellnessPartner from '@/screens/AddWellnessPartner';
import Login from '@/screens/Login';
import MedicineDetailsHome from '@/screens/MedicineDetailsHome';
import SignUp from '@/screens/SignUp';
import WellnessPartnerHome from '@/screens/WellnessPartnerHome';
import WellnessPartnerList from '@/screens/WellnessPartnerList';
import WellnessPartnerProfile from '@/screens/WellnessPartnerProfile';
import {useUserStore} from '@/store';
import {RootStackParamList} from '@/types/common';
import BottomTabNavigator from './bottomTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const {uid, setUser, clearUser} = useUserStore();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(authUser => {
      if (authUser?.uid) {
        setUser(authUser.uid);
      } else {
        clearUser();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, clearUser]);

  if (loading) {
    return null;
  }
  // async function SignOut() {
  //   await auth().signOut();
  // }
  return (
    <Stack.Navigator
      initialRouteName={uid ? 'BottomNavigator' : 'Login'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="BottomNavigator"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen name="AddWellnessPartner" component={AddWellnessPartner} />
      <Stack.Screen name="AddMedicineDetails" component={AddMedicineDetails} />
      <Stack.Screen
        name="WellnessPartnerHome"
        component={WellnessPartnerHome}
      />
      <Stack.Screen
        name="WellnessPartnerList"
        component={WellnessPartnerList}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="MedicineDetailsHome"
        component={MedicineDetailsHome}
      />
      <Stack.Screen
        name="WellnessPartnerProfile"
        component={WellnessPartnerProfile}
      />
    </Stack.Navigator>
  );
}
