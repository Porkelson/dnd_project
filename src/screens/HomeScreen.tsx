import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const navigateToCharacterCreation = () => {
    navigation.navigate('CharacterCreation', {});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to D&D Chat</Text>
      <Text style={styles.subtitle}>Your AI-powered D&D companion</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CharacterList')}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          View Characters
        </Button>
        
        <Button
          mode="contained"
          onPress={navigateToCharacterCreation}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Create Character
        </Button>
        
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Campaign')}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Campaigns
        </Button>
        
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Gameplay')}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Gameplay Tools
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Login')}
          style={[styles.button, styles.outlinedButton]}
          labelStyle={styles.buttonText}
        >
          Login
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Register')}
          style={[styles.button, styles.outlinedButton]}
          labelStyle={styles.buttonText}
        >
          Register
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#4a4a9c',
    paddingVertical: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderColor: '#4a4a9c',
  },
}); 