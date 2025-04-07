import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, IconButton, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

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
  const [characters, setCharacters] = useState<Character[]>(MOCK_CHARACTERS);

  // In a real app, you would fetch characters from a database here
  useEffect(() => {
    // Fetch characters from storage/database
  }, []);

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
      <Text variant="headlineMedium" style={styles.title}>Your Characters</Text>
      
      {characters.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No characters yet</Text>
          <Text style={styles.emptyStateSubtext}>Create your first character to get started</Text>
        </View>
      ) : (
        <FlatList
          data={characters}
          renderItem={renderCharacterItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CharacterCreation', {})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
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
}); 