import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
 
import HomeScreen from '../screens/homescreen';
import LikedScreen from '../screens/likedscreen';
import SettingsScreen from '../screens/settingscreen'; //change in the file
import CustomTabBar from './CustomTabBar';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        id = "Tabs"
        initialRouteName="Discovery"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        {/* Left Tab: Liked */}
        <Tab.Screen name="Liked" component={LikedScreen} />

        {/* Middle Tab: Discovery (The Big Button) */}
        <Tab.Screen name="Discovery" component={HomeScreen} />

        {/* Right Tab: Preferences */}
        <Tab.Screen name="Preferences" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
