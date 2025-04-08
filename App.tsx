import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TestScreen } from './src/screens/TestScreen';
import { CharacterCreationScreen } from './src/screens/CharacterCreationScreen';
import { CharacterDetailsScreen } from './src/screens/CharacterDetailsScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { getCurrentUser, onAuthStateChange } from './src/services/authService';

type TabParamList = {
  Home: undefined;
  'Create Character': undefined;
  'Character Details': { characterId?: string };
  Test: undefined;
};

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const BottomTab = createBottomTabNavigator<TabParamList>();
const TopTab = createMaterialTopTabNavigator<TabParamList>();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already signed in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setIsAuthenticated(!!user);
    });

    // Check if we're on desktop
    const checkIfDesktop = () => {
      const { width } = Dimensions.get('window');
      setIsDesktop(width >= 768);
    };

    checkIfDesktop();
    const dimensionListener = Dimensions.addEventListener('change', checkIfDesktop);

    return () => {
      unsubscribe();
      dimensionListener.remove();
    };
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  if (!isAuthenticated) {
    return (
      <PaperProvider>
        <NavigationContainer>
          <AuthScreen onAuthSuccess={handleAuthSuccess} />
        </NavigationContainer>
      </PaperProvider>
    );
  }

  const TabNavigator = isDesktop ? TopTab.Navigator : BottomTab.Navigator;
  const TabScreen = isDesktop ? TopTab.Screen : BottomTab.Screen;

  return (
    <PaperProvider>
      <NavigationContainer>
        <TabNavigator
          screenOptions={({ route }: { route: { name: keyof TabParamList } }) => ({
            tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
              let iconName: IconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Create Character') {
                iconName = focused ? 'account-plus' : 'account-plus-outline';
              } else if (route.name === 'Character Details') {
                iconName = focused ? 'account-details' : 'account-details-outline';
              } else {
                iconName = focused ? 'test-tube' : 'test-tube-empty';
              }

              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6200ee',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <TabScreen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
          <TabScreen 
            name="Create Character" 
            component={CharacterCreationScreen}
            options={{ title: 'New Character' }}
          />
          <TabScreen 
            name="Character Details" 
            component={CharacterDetailsScreen}
            options={{ title: 'Characters' }}
          />
          <TabScreen 
            name="Test" 
            component={TestScreen}
            options={{ title: 'Testing' }}
          />
        </TabNavigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
