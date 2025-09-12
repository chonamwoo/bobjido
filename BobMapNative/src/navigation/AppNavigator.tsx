import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import NativeHomeScreen from '../screens/NativeHomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import {
  RegisterScreen,
  DiscoverScreen,
  CreateScreen,
  MessagesScreen,
  ProfileScreen,
  PlaylistDetailScreen,
  RestaurantDetailScreen
} from '../screens/StubScreens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Home Stack
const HomeStack = ({ userLocation }: any) => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HomeMain" 
      options={{ 
        headerShown: false
      }}
    >
      {(props: any) => <NativeHomeScreen {...props} userLocation={userLocation} />}
    </Stack.Screen>
    <Stack.Screen 
      name="PlaylistDetail" 
      component={PlaylistDetailScreen}
      options={{ title: '플레이리스트' }}
    />
    <Stack.Screen 
      name="RestaurantDetail" 
      component={RestaurantDetailScreen}
      options={{ title: '맛집 상세' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = ({ userLocation }: any) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Discover') {
          iconName = focused ? 'compass' : 'compass-outline';
        } else if (route.name === 'Create') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        } else if (route.name === 'Messages') {
          iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#f97316',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" options={{ tabBarLabel: '홈' }}>
      {(props: any) => <HomeStack {...props} userLocation={userLocation} />}
    </Tab.Screen>
    <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarLabel: '탐색' }} />
    <Tab.Screen name="Create" component={CreateScreen} options={{ tabBarLabel: '만들기' }} />
    <Tab.Screen name="Messages" component={MessagesScreen} options={{ tabBarLabel: '메시지' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: '프로필' }} />
  </Tab.Navigator>
);

// Root Navigator
const AppNavigator = ({ isAuthenticated, userLocation }: { isAuthenticated: boolean, userLocation?: any }) => {
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs userLocation={userLocation} /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;