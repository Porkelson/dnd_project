import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, ActivityIndicator, Button, FAB } from 'react-native-paper';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { getCurrentUser } from '../services/authService';
import { getCharacters, Character } from '../services/characterService';

type TabParamList = {
  Home: undefined;
  'Create Character': undefined;
  'Character Details': { characterId?: string };
  Test: undefined;
};

type Props = BottomTabScreenProps<TabParamList, 'Character Details'>;

export const CharacterDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        setError('You must be logged in to view characters');
        return;
      }
      
      const userCharacters = await getCharacters();
      setCharacters(userCharacters);
    } catch (err) {
      setError('Failed to load characters');
      console.error('Error loading characters:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderCharacterItem = ({ item }: { item: Character }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('Character Details', { characterId: item.id })}>
      <Card.Content>
        <Text style={styles.characterName}>{item.name}</Text>
        <Text>Level {item.level} {item.class}</Text>
        <Text>{item.race}</Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={loadCharacters} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {characters.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>You don't have any characters yet</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Create Character')}
            style={styles.createButton}
          >
            Create Your First Character
          </Button>
        </View>
      ) : (
        <FlatList
          data={characters}
          renderItem={renderCharacterItem}
          keyExtractor={(item) => item.id || ''}
          contentContainerStyle={styles.list}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Create Character')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 