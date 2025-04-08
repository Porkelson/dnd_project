import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput, Surface, useTheme, Divider } from 'react-native-paper';
import { createCharacter, getCharacter, updateCharacter, deleteCharacter } from '../services/characterService';
import { Character } from '../types/character';

export const FirebaseTest: React.FC = () => {
  const theme = useTheme();
  const [characterId, setCharacterId] = useState<string>('');
  const [characterName, setCharacterName] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateCharacter = async () => {
    try {
      setLoading(true);
      setResult('Creating character...');
      
      const newCharacter: Character = {
        id: '',
        name: characterName || 'Test Character',
        race: 'Human',
        class: 'Fighter',
        level: 1,
        abilityScores: {
          strength: 15,
          dexterity: 14,
          constitution: 13,
          intelligence: 12,
          wisdom: 10,
          charisma: 8
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const createdCharacter = await createCharacter(newCharacter);
      setCharacterId(createdCharacter.id || '');
      setResult(`Character created with ID: ${createdCharacter.id}`);
    } catch (error) {
      setResult(`Error creating character: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCharacter = async () => {
    if (!characterId) {
      setResult('Please enter a character ID');
      return;
    }
    
    try {
      setLoading(true);
      setResult('Fetching character...');
      
      const character = await getCharacter(characterId);
      setResult(`Character found: ${JSON.stringify(character, null, 2)}`);
    } catch (error) {
      setResult(`Error fetching character: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCharacter = async () => {
    if (!characterId) {
      setResult('Please enter a character ID');
      return;
    }
    
    try {
      setLoading(true);
      setResult('Updating character...');
      
      const updates = {
        name: characterName || 'Updated Character',
        level: 2
      };
      
      const updatedCharacter = await updateCharacter(characterId, updates);
      setResult(`Character updated: ${JSON.stringify(updatedCharacter, null, 2)}`);
    } catch (error) {
      setResult(`Error updating character: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCharacter = async () => {
    if (!characterId) {
      setResult('Please enter a character ID');
      return;
    }
    
    try {
      setLoading(true);
      setResult('Deleting character...');
      
      await deleteCharacter(characterId);
      setResult(`Character deleted: ${characterId}`);
      setCharacterId('');
    } catch (error) {
      setResult(`Error deleting character: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Character ID"
          value={characterId}
          onChangeText={setCharacterId}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Character Name"
          value={characterName}
          onChangeText={setCharacterName}
          style={styles.input}
          mode="outlined"
        />
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={handleCreateCharacter} 
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          disabled={loading}
          icon="plus"
        >
          Create Character
        </Button>
        
        <Button 
          mode="contained" 
          onPress={handleGetCharacter} 
          style={[styles.button, { backgroundColor: theme.colors.secondary }]}
          disabled={loading}
          icon="magnify"
        >
          Get Character
        </Button>
        
        <Button 
          mode="contained" 
          onPress={handleUpdateCharacter} 
          style={[styles.button, { backgroundColor: theme.colors.tertiary }]}
          disabled={loading}
          icon="pencil"
        >
          Update Character
        </Button>
        
        <Button 
          mode="contained" 
          onPress={handleDeleteCharacter} 
          style={[styles.button, { backgroundColor: theme.colors.error }]}
          disabled={loading}
          icon="delete"
        >
          Delete Character
        </Button>
      </View>
      
      <Divider style={styles.divider} />
      
      <Surface style={styles.resultContainer}>
        <Text style={[styles.resultTitle, { color: theme.colors.primary }]}>Result:</Text>
        <Text style={[styles.resultText, { color: theme.colors.onSurface }]}>{result}</Text>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  resultContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'sans-serif-medium',
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
}); 