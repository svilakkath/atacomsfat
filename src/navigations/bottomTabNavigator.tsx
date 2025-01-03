/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import EditUserProfile from '@/screens/EditUserProfile';
import Home from '@/screens/Home';
import WellnessPartnerList from '@/screens/WellnessPartnerList';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) => {
  return <Icon name={name} size={size} color={color} />;
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#ffffff',
          height: 60,
          bottom: 8,
          left: 10,
          right: 10,
          borderRadius: 20,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
          margin: 7,
        },
        tabBarActiveTintColor: '#3cb371',
        tabBarInactiveTintColor: '#a9a9a9',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
          tabBarButton: props => (
            <TouchableWithoutFeedback onPress={props.onPress}>
              <View style={[styles.tabBarButton, props.style]}>
                {props.children}
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <Tab.Screen
        name="WellnessPartnersList"
        component={WellnessPartnerList}
        options={{
          tabBarIcon: ({color, size}) => (
            <TabBarIcon name="account-group" color={color} size={size} />
          ),
          tabBarButton: props => (
            <TouchableWithoutFeedback onPress={props.onPress}>
              <View style={[styles.tabBarButton, props.style]}>
                {props.children}
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={EditUserProfile}
        options={{
          tabBarIcon: ({color, size}) => (
            <TabBarIcon name="account-circle" color={color} size={size} />
          ),
          tabBarButton: props => (
            <TouchableWithoutFeedback onPress={props.onPress}>
              <View style={[styles.tabBarButton, props.style]}>
                {props.children}
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
