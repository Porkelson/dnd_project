import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Text, Card, FAB, IconButton, Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getCharacters, Character as ServiceCharacter } from '../services/characterService';

type CharacterListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define the Character type
interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
}

// Mock data for characters - in a real app, this would come from a database
const MOCK_CHARACTERS: Character[] = [
  {
    id: '1',
    name: 'Aragorn',
    race: 'Human',
    class: 'Ranger',
    level: 5,
  },
  {
    id: '2',
    name: 'Gandalf',
    race: 'Human',
    class: 'Wizard',
    level: 20,
  },
];

export const CharacterListScreen = () => {
  const navigation = useNavigation<CharacterListScreenNavigationProp>();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load characters when the screen is focused
  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from your database
      const fetchedCharacters = await getCharacters();
      // Convert service characters to our local Character type
      const convertedCharacters: Character[] = fetchedCharacters.map(char => ({
        id: char.id || '',
        name: char.name,
        race: typeof char.race === 'string' ? char.race : '',
        class: typeof char.class === 'string' ? char.class : '',
        level: char.level
      }));
      setCharacters(convertedCharacters);
    } catch (error) {
      console.error('Error loading characters:', error);
      // Fallback to mock data if the API call fails
      setCharacters(MOCK_CHARACTERS);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCharacters();
    setRefreshing(false);
  };

  const renderCharacterItem = ({ item }: { item: Character }) => (
    <Card style={styles.characterCard} mode="outlined">
      <Card.Content>
        <View style={styles.characterHeader}>
          <Text variant="titleLarge" style={styles.characterName}>{item.name}</Text>
          <View style={styles.characterActions}>
            <IconButton 
              icon="pencil" 
              size={20} 
              onPress={() => navigation.navigate('CharacterCreation', { characterId: item.id })} 
            />
            <IconButton 
              icon="delete" 
              size={20} 
              onPress={() => {
                // Delete character logic
                setCharacters(characters.filter(char => char.id !== item.id));
              }} 
            />
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.characterDetails}>
          <Text style={styles.characterDetail}>Race: {item.race}</Text>
          <Text style={styles.characterDetail}>Class: {item.class}</Text>
          <Text style={styles.characterDetail}>Level: {item.level}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Your Characters</Text>
          <Button 
            mode="contained-tonal" 
            icon="refresh" 
            onPress={onRefresh}
            loading={refreshing}
            style={styles.refreshButton}
          >
            Refresh
          </Button>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading characters...</Text>
          </View>
        ) : characters.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No characters yet</Text>
            <Text style={styles.emptyStateSubtext}>Create your first character to get started</Text>
            <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => navigation.navigate('CharacterCreation', {})}
              style={styles.createButton}
            >
              Create Character
            </Button>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <FlatList
              data={characters}
              renderItem={renderCharacterItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#4a4a9c']}
                  tintColor="#4a4a9c"
                />
              }
            />
          </View>
        )}
      </View>
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CharacterCreation', {})}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    width: isDesktop ? 600 : '100%',
    padding: 20,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
  },
  listContent: {
    paddingBottom: 20,
  },
  characterCard: {
    marginBottom: 15,
    backgroundColor: '#2a2a2a',
    borderColor: '#444444',
  },
  characterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterName: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  characterActions: {
    flexDirection: 'row',
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#444444',
  },
  characterDetails: {
    marginTop: 5,
  },
  characterDetail: {
    color: '#cccccc',
    marginBottom: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    color: '#cccccc',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4a4a9c',
  },
  refreshButton: {
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    marginTop: 16,
    backgroundColor: '#4a4a9c',
  },
}); 