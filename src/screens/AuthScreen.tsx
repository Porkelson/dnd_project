import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme, Divider } from 'react-native-paper';
import { registerUser, signInUser } from '../services/authService';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInUser(email, password);
      } else {
        await registerUser(email, password);
      }
      onAuthSuccess();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Register'}</Text>
        
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
        
        {!isLogin && (
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
        )}
        
        <Button
          mode="contained"
          onPress={handleAuth}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          {isLogin ? 'Sign In' : 'Register'}
        </Button>
        
        <Divider style={styles.divider} />
        
        <Button
          mode="text"
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchButton}
        >
          {isLogin ? 'Need an account? Register' : 'Have an account? Sign In'}
        </Button>
      </Surface>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    width: isDesktop ? 400 : '100%',
    maxWidth: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 20,
  },
  switchButton: {
    marginTop: 8,
  },
}); 