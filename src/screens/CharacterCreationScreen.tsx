import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Divider, Menu, Portal, Modal, Surface, useTheme } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { dndApi, ApiReference, Race, Class } from '../services/dndApi';
import { createCharacter } from '../services/characterService';

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

interface CharacterCreationScreenProps {
  onCharacterCreated?: (character: any) => void;
}

export const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ onCharacterCreated }) => {
  const navigation = useNavigation<CharacterCreationScreenNavigationProp>();
  const route = useRoute<CharacterCreationScreenRouteProp>();
  const characterId = route.params?.characterId;
  const theme = useTheme();
  
  // Character basic info
  const [loading, setLoading] = useState(false);
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
  
  // Race selection
  const [races, setRaces] = useState<ApiReference[]>([]);
  const [selectedRaceDetails, setSelectedRaceDetails] = useState<Race | null>(null);
  
  // Class selection
  const [classes, setClasses] = useState<ApiReference[]>([]);
  const [selectedClassDetails, setSelectedClassDetails] = useState<Class | null>(null);
  
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
  
  useEffect(() => {
    // Load races and classes from the API
    const loadData = async () => {
      try {
        const [racesResponse, classesResponse] = await Promise.all([
          dndApi.getRaces(),
          dndApi.getClasses()
        ]);
        setRaces(racesResponse.results);
        setClasses(classesResponse.results);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleRaceSelect = async (race: ApiReference) => {
    setRace(race.name);
    setRaceMenuVisible(false);
    
    try {
      const raceDetails = await dndApi.getRace(race.index);
      setSelectedRaceDetails(raceDetails);
      
      // Apply ability score bonuses
      raceDetails.ability_bonuses.forEach(bonus => {
        const abilityName = bonus.ability_score.name.toLowerCase();
        switch (abilityName) {
          case 'strength':
            setStrength(prev => (parseInt(prev) + bonus.bonus).toString());
            break;
          case 'dexterity':
            setDexterity(prev => (parseInt(prev) + bonus.bonus).toString());
            break;
          case 'constitution':
            setConstitution(prev => (parseInt(prev) + bonus.bonus).toString());
            break;
          case 'intelligence':
            setIntelligence(prev => (parseInt(prev) + bonus.bonus).toString());
            break;
          case 'wisdom':
            setWisdom(prev => (parseInt(prev) + bonus.bonus).toString());
            break;
          case 'charisma':
            setCharisma(prev => (parseInt(prev) + bonus.bonus).toString());
            break;
        }
      });
    } catch (error) {
      console.error('Error loading race details:', error);
    }
  };

  const handleClassSelect = async (characterClass: ApiReference) => {
    setCharacterClass(characterClass.name);
    setClassMenuVisible(false);
    
    try {
      const classDetails = await dndApi.getClass(characterClass.index);
      setSelectedClassDetails(classDetails);
    } catch (error) {
      console.error('Error loading class details:', error);
    }
  };

  const handleCreateCharacter = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a character name');
      return;
    }

    if (!selectedRaceDetails || !selectedClassDetails) {
      Alert.alert('Error', 'Please select both a race and a class');
      return;
    }

    const characterData = {
      id: Date.now().toString(),
      name,
      race: selectedRaceDetails?.index || '',
      class: selectedClassDetails?.index || '',
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
      raceDetails: selectedRaceDetails,
      classDetails: selectedClassDetails,
    };

    try {
      setLoading(true);
      const savedCharacter = await createCharacter(characterData);
      console.log('Character saved:', savedCharacter);
      
      if (savedCharacter.id) {
        const characterId = savedCharacter.id;
        Alert.alert(
          'Success', 
          'Character created successfully!',
          [
            {
              text: 'View Character',
              onPress: () => navigation.navigate('CharacterDetail', { characterId })
            },
            {
              text: 'Create Another',
              onPress: () => resetForm()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error creating character:', error);
      Alert.alert(
        'Error', 
        'Failed to create character. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.contentContainer}>
        <Surface style={styles.formContainer}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
            Create Your Character
          </Text>
          
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Basic Information</Text>
            
            <TextInput
              label="Character Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              textColor={theme.colors.onSurface}
              outlineColor={theme.colors.primary}
            />
            
            <View style={styles.menuContainer}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>Race</Text>
              <Menu
                visible={raceMenuVisible}
                onDismiss={() => setRaceMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setRaceMenuVisible(true)}
                    style={[styles.menuButton, { borderColor: theme.colors.primary }]}
                    textColor={theme.colors.onSurface}
                  >
                    {race || 'Select Race'}
                  </Button>
                }
                contentStyle={[styles.menuContent, { backgroundColor: theme.colors.surface }]}
              >
                {races.map((race) => (
                  <Menu.Item
                    key={race.index}
                    onPress={() => handleRaceSelect(race)}
                    title={race.name}
                    titleStyle={{ color: theme.colors.onSurface }}
                  />
                ))}
              </Menu>
            </View>
            
            <View style={styles.menuContainer}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>Class</Text>
              <Menu
                visible={classMenuVisible}
                onDismiss={() => setClassMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setClassMenuVisible(true)}
                    style={[styles.menuButton, { borderColor: theme.colors.primary }]}
                    textColor={theme.colors.onSurface}
                  >
                    {characterClass || 'Select Class'}
                  </Button>
                }
                contentStyle={[styles.menuContent, { backgroundColor: theme.colors.surface }]}
              >
                {classes.map((characterClass) => (
                  <Menu.Item
                    key={characterClass.index}
                    onPress={() => handleClassSelect(characterClass)}
                    title={characterClass.name}
                    titleStyle={{ color: theme.colors.onSurface }}
                  />
                ))}
              </Menu>
            </View>
            
            <TextInput
              label="Level"
              value={level}
              onChangeText={setLevel}
              mode="outlined"
              style={styles.input}
              keyboardType="number-pad"
              textColor={theme.colors.onSurface}
              outlineColor={theme.colors.primary}
            />
          </View>
          
          <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Ability Scores</Text>
            
            <View style={styles.abilityScoresContainer}>
              <View style={styles.abilityScoreItem}>
                <TextInput
                  label="Strength"
                  value={strength}
                  onChangeText={setStrength}
                  mode="outlined"
                  style={styles.abilityScoreInput}
                  keyboardType="number-pad"
                  textColor={theme.colors.onSurface}
                  outlineColor={theme.colors.primary}
                />
                <Text style={[styles.modifierText, { color: theme.colors.onSurface }]}>
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
                  textColor={theme.colors.onSurface}
                  outlineColor={theme.colors.primary}
                />
                <Text style={[styles.modifierText, { color: theme.colors.onSurface }]}>
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
                  textColor={theme.colors.onSurface}
                  outlineColor={theme.colors.primary}
                />
                <Text style={[styles.modifierText, { color: theme.colors.onSurface }]}>
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
                  textColor={theme.colors.onSurface}
                  outlineColor={theme.colors.primary}
                />
                <Text style={[styles.modifierText, { color: theme.colors.onSurface }]}>
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
                  textColor={theme.colors.onSurface}
                  outlineColor={theme.colors.primary}
                />
                <Text style={[styles.modifierText, { color: theme.colors.onSurface }]}>
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
                  textColor={theme.colors.onSurface}
                  outlineColor={theme.colors.primary}
                />
                <Text style={[styles.modifierText, { color: theme.colors.onSurface }]}>
                  {Math.floor((parseInt(charisma, 10) - 10) / 2)}
                </Text>
              </View>
            </View>
          </View>
          
          <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Background</Text>
            
            <TextInput
              label="Character Background"
              value={background}
              onChangeText={setBackground}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
              textColor={theme.colors.onSurface}
              outlineColor={theme.colors.primary}
            />
          </View>
          
          <Button 
            mode="contained" 
            onPress={handleCreateCharacter}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
          >
            Create Character
          </Button>
        </Surface>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    width: isDesktop ? 600 : '100%',
    alignSelf: 'center',
  },
  formContainer: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  divider: {
    marginVertical: 20,
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
  },
  modifierText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
  },
  menuContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  menuButton: {
    borderColor: '#4a4a9c',
  },
  menuContent: {
    backgroundColor: '#2a2a2a',
  },
}); 