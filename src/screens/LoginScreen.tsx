import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    // TODO: Implement actual login logic
    console.log('Login pressed', { email, password });
    navigation.navigate('Home');
  };

  const handleSkip = () => {
    // Skip login for development
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome Back
      </Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
      />

      <Button 
        mode="contained" 
        onPress={handleLogin}
        style={styles.button}
      >
        Login
      </Button>

      <Button 
        mode="text" 
        onPress={() => navigation.navigate('Register')}
        style={styles.button}
      >
        Don't have an account? Register
      </Button>

      <Button 
        mode="text" 
        onPress={handleSkip}
        style={styles.skipButton}
      >
        Skip Login (Development)
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 10,
  },
  skipButton: {
    marginTop: 30,
  },
}); 