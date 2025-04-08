import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { signOutUser } from '../services/authService';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();

  const handlePlay = () => {
    navigation.navigate('Campaign');
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      // Navigation will be handled by the auth state listener in App.tsx
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to D&D Chat</Text>
      <Text style={styles.subtitle}>Your AI-powered D&D companion</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handlePlay}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.buttonText}
          icon="play"
        >
          Play
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={[styles.button, { borderColor: theme.colors.error }]}
          labelStyle={[styles.buttonText, { color: theme.colors.error }]}
          icon="logout"
        >
          Logout
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    marginBottom: 20,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 