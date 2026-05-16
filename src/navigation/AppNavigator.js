import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PlayerScreen from '../screens/PlayerScreen';
import ArtistScreen from '../screens/ArtistScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#121212', borderTopColor: '#333' },
        tabBarActiveTintColor: '#1DB954',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>❤️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator({ initialRoute = 'Login', lastTrack }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={HomeTabs} />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen name="Artist" component={ArtistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}