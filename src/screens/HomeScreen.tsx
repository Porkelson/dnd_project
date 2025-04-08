import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, useTheme, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { signOutUser } from '../services/authService';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const { width } = Dimensions.get('window');
  const isDesktop = width >= 768;

  const handlePlay = () => {
    navigation.navigate('Campaign');
  };

  const handleAdventure = () => {
    navigation.navigate('Adventure');
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.contentContainer, { width: isDesktop ? 600 : '100%' }]}>
        <Surface style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            Welcome to D&D Chat
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
            Your AI-powered D&D companion
          </Text>
        </Surface>
        
        <Surface style={styles.buttonContainer}>
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
            mode="contained"
            onPress={handleAdventure}
            style={[styles.button, { backgroundColor: theme.colors.secondary }]}
            labelStyle={styles.buttonText}
            icon="map-marker"
          >
            Adventure
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
        </Surface>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    alignSelf: 'center',
  },
  headerContainer: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  button: {
    marginVertical: 8,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
  },
}); 