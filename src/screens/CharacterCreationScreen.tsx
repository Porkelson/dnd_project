import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Divider, Menu } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type CharacterCreationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CharacterCreationScreenRouteProp = RouteProp<RootStackParamList, 'CharacterCreation'>;

// Basic D&D races
const RACES = [
  'Human',
  'Elf',
  'Dwarf',
  'Halfling',
  'Dragonborn',
  'Gnome',
  'Half-Elf',
  'Half-Orc',
  'Tiefling',
];

// Basic D&D classes
const CLASSES = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard',
];

export const CharacterCreationScreen = () => {
  const navigation = useNavigation<CharacterCreationScreenNavigationProp>();
  const route = useRoute<CharacterCreationScreenRouteProp>();
  const characterId = route.params?.characterId;
  
  // Character basic info
  const [name, setName] = useState('');
  const [race, setRace] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [level, setLevel] = useState('1');
  
  // Dropdown menus
  const [raceMenuVisible, setRaceMenuVisible] = useState(false);
  const [classMenuVisible, setClassMenuVisible] = useState(false);
  
  // Ability scores
  const [strength, setStrength] = useState('10');
  const [dexterity, setDexterity] = useState('10');
  const [constitution, setConstitution] = useState('10');
  const [intelligence, setIntelligence] = useState('10');
  const [wisdom, setWisdom] = useState('10');
  const [charisma, setCharisma] = useState('10');
  
  // Background
  const [background, setBackground] = useState('');
  
  // Reset form when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Reset form when screen is focused
      if (!characterId) {
        resetForm();
      } else {
        // In a real app, you would load the character data here
        // For now, we'll just use mock data
        loadCharacterData(characterId);
      }
    }, [characterId])
  );
  
  const resetForm = () => {
    setName('');
    setRace('');
    setCharacterClass('');
    setLevel('1');
    setStrength('10');
    setDexterity('10');
    setConstitution('10');
    setIntelligence('10');
    setWisdom('10');
    setCharisma('10');
    setBackground('');
  };
  
  const loadCharacterData = (id: string) => {
    // In a real app, you would fetch the character data from a database
    // For now, we'll just use mock data
    console.log('Loading character data for ID:', id);
    // Mock data - in a real app, this would come from a database
    setName('Aragorn');
    setRace('Human');
    setCharacterClass('Ranger');
    setLevel('5');
    setStrength('16');
    setDexterity('14');
    setConstitution('15');
    setIntelligence('12');
    setWisdom('14');
    setCharisma('16');
    setBackground('A noble ranger from the North.');
  };
  
  const handleCreateCharacter = () => {
    // TODO: Save character to database
    const character = {
      id: characterId || Date.now().toString(), // Generate a new ID if creating a new character
      name,
      race,
      class: characterClass,
      level: parseInt(level, 10),
      abilityScores: {
        strength: parseInt(strength, 10),
        dexterity: parseInt(dexterity, 10),
        constitution: parseInt(constitution, 10),
        intelligence: parseInt(intelligence, 10),
        wisdom: parseInt(wisdom, 10),
        charisma: parseInt(charisma, 10),
      },
      background,
    };
    
    console.log('Character saved:', character);
    navigation.navigate('CharacterList');
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Create Your Character
      </Text>
      
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Basic Information</Text>
        
        <TextInput
          label="Character Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          textColor="#000000"
          outlineColor="#4a4a9c"
        />
        
        <Menu
          visible={raceMenuVisible}
          onDismiss={() => setRaceMenuVisible(false)}
          anchor={
            <TextInput
              label="Race"
              value={race}
              mode="outlined"
              style={styles.input}
              right={<TextInput.Icon icon="menu-down" onPress={() => setRaceMenuVisible(true)} />}
              textColor="#000000"
              outlineColor="#4a4a9c"
              editable={false}
            />
          }
          contentStyle={{ backgroundColor: '#2a2a2a' }}
        >
          {RACES.map((r) => (
            <Menu.Item 
              key={r} 
              onPress={() => {
                setRace(r);
                setRaceMenuVisible(false);
              }} 
              title={r}
              titleStyle={{ color: '#ffffff' }}
            />
          ))}
        </Menu>
        
        <Menu
          visible={classMenuVisible}
          onDismiss={() => setClassMenuVisible(false)}
          anchor={
            <TextInput
              label="Class"
              value={characterClass}
              mode="outlined"
              style={styles.input}
              right={<TextInput.Icon icon="menu-down" onPress={() => setClassMenuVisible(true)} />}
              textColor="#000000"
              outlineColor="#4a4a9c"
              editable={false}
            />
          }
          contentStyle={{ backgroundColor: '#2a2a2a' }}
        >
          {CLASSES.map((c) => (
            <Menu.Item 
              key={c} 
              onPress={() => {
                setCharacterClass(c);
                setClassMenuVisible(false);
              }} 
              title={c}
              titleStyle={{ color: '#ffffff' }}
            />
          ))}
        </Menu>
        
        <TextInput
          label="Level"
          value={level}
          onChangeText={setLevel}
          mode="outlined"
          style={styles.input}
          keyboardType="number-pad"
          textColor="#000000"
          outlineColor="#4a4a9c"
        />
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Ability Scores</Text>
        
        <View style={styles.abilityScoresContainer}>
          <View style={styles.abilityScoreItem}>
            <TextInput
              label="Strength"
              value={strength}
              onChangeText={setStrength}
              mode="outlined"
              style={styles.abilityScoreInput}
              keyboardType="number-pad"
              textColor="#000000"
              outlineColor="#4a4a9c"
            />
            <Text style={styles.modifierText}>
              {Math.floor((parseInt(strength, 10) - 10) / 2)}
            </Text>
          </View>
          
          <View style={styles.abilityScoreItem}>
            <TextInput
              label="Dexterity"
              value={dexterity}
              onChangeText={setDexterity}
              mode="outlined"
              style={styles.abilityScoreInput}
              keyboardType="number-pad"
              textColor="#000000"
              outlineColor="#4a4a9c"
            />
            <Text style={styles.modifierText}>
              {Math.floor((parseInt(dexterity, 10) - 10) / 2)}
            </Text>
          </View>
          
          <View style={styles.abilityScoreItem}>
            <TextInput
              label="Constitution"
              value={constitution}
              onChangeText={setConstitution}
              mode="outlined"
              style={styles.abilityScoreInput}
              keyboardType="number-pad"
              textColor="#000000"
              outlineColor="#4a4a9c"
            />
            <Text style={styles.modifierText}>
              {Math.floor((parseInt(constitution, 10) - 10) / 2)}
            </Text>
          </View>
          
          <View style={styles.abilityScoreItem}>
            <TextInput
              label="Intelligence"
              value={intelligence}
              onChangeText={setIntelligence}
              mode="outlined"
              style={styles.abilityScoreInput}
              keyboardType="number-pad"
              textColor="#000000"
              outlineColor="#4a4a9c"
            />
            <Text style={styles.modifierText}>
              {Math.floor((parseInt(intelligence, 10) - 10) / 2)}
            </Text>
          </View>
          
          <View style={styles.abilityScoreItem}>
            <TextInput
              label="Wisdom"
              value={wisdom}
              onChangeText={setWisdom}
              mode="outlined"
              style={styles.abilityScoreInput}
              keyboardType="number-pad"
              textColor="#000000"
              outlineColor="#4a4a9c"
            />
            <Text style={styles.modifierText}>
              {Math.floor((parseInt(wisdom, 10) - 10) / 2)}
            </Text>
          </View>
          
          <View style={styles.abilityScoreItem}>
            <TextInput
              label="Charisma"
              value={charisma}
              onChangeText={setCharisma}
              mode="outlined"
              style={styles.abilityScoreInput}
              keyboardType="number-pad"
              textColor="#000000"
              outlineColor="#4a4a9c"
            />
            <Text style={styles.modifierText}>
              {Math.floor((parseInt(charisma, 10) - 10) / 2)}
            </Text>
          </View>
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Background</Text>
        
        <TextInput
          label="Character Background"
          value={background}
          onChangeText={setBackground}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={4}
          textColor="#000000"
          outlineColor="#4a4a9c"
        />
      </View>
      
      <Button 
        mode="contained" 
        onPress={handleCreateCharacter}
        style={styles.button}
      >
        Create Character
      </Button>
    </ScrollView>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#444444',
  },
  abilityScoresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  abilityScoreItem: {
    width: '30%',
    marginBottom: 15,
    alignItems: 'center',
  },
  abilityScoreInput: {
    width: '100%',
    backgroundColor: '#ffffff',
  },
  modifierText: {
    color: '#ffffff',
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#4a4a9c',
  },
}); 