import auth from '@react-native-firebase/auth';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';

import AddMedicineDetails from '@/screens/AddMedicineDetails';
import AddWellnessPartner from '@/screens/AddWellnessPartner';
import Login from '@/screens/Login';
import SignUp from '@/screens/SignUp';
import WellnessPartnerHome from '@/screens/WellnessPartnerHome';
import WellnessPartnerList from '@/screens/WellnessPartnerList';
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
      <Stack.Screen
        name="AddWellnessPartner"
        component={AddWellnessPartner}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddMedicineDetails"
        component={AddMedicineDetails}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="WellnessPartnerHome"
        component={WellnessPartnerHome}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="WellnessPartnerList"
        component={WellnessPartnerList}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        // options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
