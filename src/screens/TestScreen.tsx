import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { FirebaseTest } from '../components/FirebaseTest';

export const TestScreen: React.FC = () => {
  const theme = useTheme();
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.colors.primary }]}>
          Firebase Persistence Testing
        </Text>
        <Text style={[styles.description, { color: theme.colors.onSurface }]}>
          Use this screen to test the Firebase persistence functionality. 
          Create, read, update, and delete characters to verify that data is properly stored in Firestore.
        </Text>
      </Surface>
      
      <Surface style={styles.testContainer}>
        <FirebaseTest />
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  testContainer: {
    margin: 16,
    borderRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
}); 