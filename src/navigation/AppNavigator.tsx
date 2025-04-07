import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { CharacterCreationScreen } from '../screens/CharacterCreationScreen';
import { CharacterListScreen } from '../screens/CharacterListScreen';
import { CampaignScreen } from '../screens/CampaignScreen';
import { GameScreen } from '../screens/GameScreen';
import { GameplayScreen } from '../screens/GameplayScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  CharacterCreation: { characterId?: string };
  CharacterList: undefined;
  CharacterDetail: { characterId: string };
  Campaign: undefined;
  Game: { campaignId: string };
  Gameplay: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'D&D Chat' }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Register' }} 
        />
        <Stack.Screen 
          name="CharacterList" 
          component={CharacterListScreen} 
          options={{ title: 'Your Characters' }} 
        />
        <Stack.Screen 
          name="CharacterCreation" 
          component={CharacterCreationScreen} 
          options={({ route }) => ({ 
            title: route.params?.characterId ? 'Edit Character' : 'Create Character' 
          })} 
        />
        <Stack.Screen 
          name="Campaign" 
          component={CampaignScreen} 
          options={{ title: 'Campaigns' }} 
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen} 
          options={{ title: 'Game' }} 
        />
        <Stack.Screen
          name="Gameplay"
          component={GameplayScreen}
          options={{
            title: 'Gameplay Tools',
            headerStyle: {
              backgroundColor: '#1a1a1a',
            },
            headerTintColor: '#ffffff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 