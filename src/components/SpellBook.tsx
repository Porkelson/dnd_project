import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Text, Card, Searchbar, Chip, Button, Portal, Modal, Divider, IconButton } from 'react-native-paper';
import { dndApi, Spell, ApiReference } from '../services/dndApi';

interface SpellBookProps {
  characterClass?: string;
  level?: number;
}

export const SpellBook: React.FC<SpellBookProps> = ({ characterClass, level = 1 }) => {
  const [spells, setSpells] = useState<ApiReference[]>([]);
  const [filteredSpells, setFilteredSpells] = useState<ApiReference[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [spellModalVisible, setSpellModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [spellDetails, setSpellDetails] = useState<{[key: string]: Spell}>({});
  const [loadingSpell, setLoadingSpell] = useState<string | null>(null);
  const [classes, setClasses] = useState<ApiReference[]>([]);

  useEffect(() => {
    loadSpells();
    loadClasses();
  }, []);

  useEffect(() => {
    filterSpells();
  }, [searchQuery, spells, selectedLevel, selectedClass, spellDetails]);

  const loadSpells = async () => {
    try {
      setLoading(true);
      const response = await dndApi.getSpells();
      setSpells(response.results);
      setFilteredSpells(response.results);
    } catch (error) {
      console.error('Error loading spells:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const response = await dndApi.getClasses();
      setClasses(response.results);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const filterSpells = () => {
    let filtered = [...spells];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(spell => 
        spell.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by spell level if selected
    if (selectedLevel !== null) {
      filtered = filtered.filter(spell => {
        // If we already have the spell details, use them
        if (spellDetails[spell.index]) {
          return spellDetails[spell.index].level.toString() === selectedLevel;
        }
        // Otherwise, load the spell details
        loadSpellDetails(spell.index);
        return true; // Include it for now, it will be filtered once details are loaded
      });
    }
    
    // Filter by class if selected
    if (selectedClass !== null) {
      filtered = filtered.filter(spell => {
        // If we already have the spell details, use them
        if (spellDetails[spell.index]) {
          return spellDetails[spell.index].classes.some(c => c.index === selectedClass);
        }
        // Otherwise, load the spell details
        loadSpellDetails(spell.index);
        return true; // Include it for now, it will be filtered once details are loaded
      });
    }
    
    setFilteredSpells(filtered);
  };

  const loadSpellDetails = async (spellIndex: string) => {
    // Don't load if already loading or already loaded
    if (loadingSpell === spellIndex || spellDetails[spellIndex]) {
      return;
    }

    try {
      setLoadingSpell(spellIndex);
      const spellData = await dndApi.getSpell(spellIndex);
      setSpellDetails(prev => ({
        ...prev,
        [spellIndex]: spellData
      }));
    } catch (error) {
      console.error(`Error loading spell details for ${spellIndex}:`, error);
      // Add a placeholder to prevent repeated failed attempts
      setSpellDetails(prev => ({
        ...prev,
        [spellIndex]: {
          index: spellIndex,
          name: spellIndex.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          level: 0, // Default to cantrip
          school: { name: 'Unknown', index: 'unknown' },
          classes: [],
          desc: ['Failed to load spell details.'],
          higher_level: [],
          range: 'Unknown',
          components: [],
          material: '',
          ritual: false,
          duration: 'Unknown',
          concentration: false,
          casting_time: 'Unknown',
          attack_type: '',
          damage: { damage_type: { name: 'Unknown', index: 'unknown' } },
          subclasses: [],
          url: '',
        } as unknown as Spell
      }));
    } finally {
      setLoadingSpell(null);
    }
  };

  // Add a new function to load spell details in batches
  const loadSpellDetailsBatch = async (spellIndices: string[]) => {
    // Limit the batch size to prevent too many simultaneous requests
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < spellIndices.length; i += batchSize) {
      batches.push(spellIndices.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
      await Promise.all(
        batch.map(async (spellIndex) => {
          if (!spellDetails[spellIndex] && loadingSpell !== spellIndex) {
            await loadSpellDetails(spellIndex);
          }
        })
      );
    }
  };

  // Add a useEffect to load spell details for filtered spells
  useEffect(() => {
    if (filteredSpells.length > 0 && filteredSpells.length <= 50) {
      // Only load details for up to 50 spells at a time to prevent resource errors
      const spellIndices = filteredSpells.map(spell => spell.index);
      loadSpellDetailsBatch(spellIndices);
    }
  }, [filteredSpells]);

  const handleSpellPress = async (spell: ApiReference) => {
    try {
      setLoading(true);
      // If we already have the spell details, use them
      if (spellDetails[spell.index]) {
        setSelectedSpell(spellDetails[spell.index]);
        setSpellModalVisible(true);
        setLoading(false);
        return;
      }
      
      // Load spell details only when needed
      await loadSpellDetails(spell.index);
      setSelectedSpell(spellDetails[spell.index]);
      setSpellModalVisible(true);
    } catch (error) {
      console.error('Error loading spell details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSpellLevelText = (level: number) => {
    if (level === 0) return 'Cantrip';
    if (level === 1) return '1st Level';
    if (level === 2) return '2nd Level';
    if (level === 3) return '3rd Level';
    return `${level}th Level`;
  };

  const getSpellSchoolColor = (school: string) => {
    switch (school.toLowerCase()) {
      case 'abjuration': return '#4a9c4a'; // Green
      case 'conjuration': return '#9c4a4a'; // Red
      case 'divination': return '#4a4a9c'; // Blue
      case 'enchantment': return '#9c4a9c'; // Purple
      case 'evocation': return '#9c9c4a'; // Yellow
      case 'illusion': return '#4a9c9c'; // Cyan
      case 'necromancy': return '#9c9c9c'; // Gray
      case 'transmutation': return '#9c6a4a'; // Orange
      default: return '#a0a0ff'; // Default blue
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLevel(null);
    setSelectedClass(null);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search spells"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#ffffff"
        placeholderTextColor="#a0a0a0"
        inputStyle={styles.searchInput}
      />
      
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter by Level:</Text>
          <ScrollView 
            horizontal 
            style={styles.levelFilter} 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.levelFilterContent}
          >
            <Chip
              selected={selectedLevel === null}
              onPress={() => setSelectedLevel(null)}
              style={[styles.chip, selectedLevel === null && styles.selectedChip]}
              textStyle={[styles.chipText, selectedLevel === null && styles.selectedChipText]}
            >
              All
            </Chip>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
              <Chip
                key={level}
                selected={selectedLevel === level.toString()}
                onPress={() => setSelectedLevel(level.toString())}
                style={[styles.chip, selectedLevel === level.toString() && styles.selectedChip]}
                textStyle={[styles.chipText, selectedLevel === level.toString() && styles.selectedChipText]}
              >
                {getSpellLevelText(level)}
              </Chip>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter by Class:</Text>
          <ScrollView 
            horizontal 
            style={styles.classFilter} 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.classFilterContent}
          >
            <Chip
              selected={selectedClass === null}
              onPress={() => setSelectedClass(null)}
              style={[styles.chip, selectedClass === null && styles.selectedChip]}
              textStyle={[styles.chipText, selectedClass === null && styles.selectedChipText]}
            >
              All Classes
            </Chip>
            {classes.map((cls) => (
              <Chip
                key={cls.index}
                selected={selectedClass === cls.index}
                onPress={() => setSelectedClass(cls.index)}
                style={[styles.chip, selectedClass === cls.index && styles.selectedChip]}
                textStyle={[styles.chipText, selectedClass === cls.index && styles.selectedChipText]}
              >
                {cls.name}
              </Chip>
            ))}
          </ScrollView>
        </View>
        
        {(selectedLevel !== null || selectedClass !== null || searchQuery) && (
          <Button
            mode="outlined"
            onPress={resetFilters}
            style={styles.resetButton}
            labelStyle={styles.resetButtonText}
          >
            Reset Filters
          </Button>
        )}
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a4a9c" />
        </View>
      ) : (
        <ScrollView style={styles.spellList}>
          {filteredSpells.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No spells found</Text>
              <Button 
                mode="outlined" 
                onPress={resetFilters}
                style={styles.resetButton}
                labelStyle={styles.resetButtonText}
              >
                Reset Filters
              </Button>
            </View>
          ) : (
            filteredSpells.map((spell) => {
              const details = spellDetails[spell.index];
              const level = details ? details.level : null;
              const school = details ? details.school.name : null;
              const schoolColor = school ? getSpellSchoolColor(school) : '#a0a0ff';
              
              return (
                <Card
                  key={spell.index}
                  style={styles.spellCard}
                  onPress={() => handleSpellPress(spell)}
                >
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.spellHeader}>
                      <Text style={styles.spellName}>{spell.name}</Text>
                      {level !== null && (
                        <View style={[styles.levelBadge, { backgroundColor: schoolColor }]}>
                          <Text style={styles.levelText}>{getSpellLevelText(level)}</Text>
                        </View>
                      )}
                    </View>
                    {school && (
                      <Text style={[styles.schoolText, { color: schoolColor }]}>
                        {school}
                      </Text>
                    )}
                  </Card.Content>
                </Card>
              );
            })
          )}
        </ScrollView>
      )}
      
      <Portal>
        <Modal
          visible={spellModalVisible}
          onDismiss={() => setSpellModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          {selectedSpell && (
            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedSpell.name}</Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setSpellModalVisible(false)}
                  style={styles.closeButton}
                  iconColor="#ffffff"
                />
              </View>
              
              <View style={styles.modalSubtitleContainer}>
                <View style={[styles.levelBadge, { backgroundColor: getSpellSchoolColor(selectedSpell.school.name) }]}>
                  <Text style={styles.levelText}>{getSpellLevelText(selectedSpell.level)}</Text>
                </View>
                <Text style={[styles.schoolText, { color: getSpellSchoolColor(selectedSpell.school.name) }]}>
                  {selectedSpell.school.name}
                </Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Casting Time</Text>
                <Text style={styles.sectionText}>{selectedSpell.casting_time}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Range</Text>
                <Text style={styles.sectionText}>{selectedSpell.range}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Components</Text>
                <Text style={styles.sectionText}>
                  {selectedSpell.components.join(', ')}
                  {selectedSpell.material && ` (${selectedSpell.material})`}
                </Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Duration</Text>
                <Text style={styles.sectionText}>
                  {selectedSpell.duration}
                  {selectedSpell.concentration && ' (Concentration)'}
                </Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                {selectedSpell.desc.map((paragraph, index) => (
                  <Text key={index} style={styles.sectionText}>
                    {paragraph}
                  </Text>
                ))}
              </View>
              
              {selectedSpell.higher_level && selectedSpell.higher_level.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>At Higher Levels</Text>
                  {selectedSpell.higher_level.map((text, index) => (
                    <Text key={index} style={styles.sectionText}>
                      {text}
                    </Text>
                  ))}
                </View>
              )}
              
              {selectedSpell.classes && selectedSpell.classes.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Available to Classes</Text>
                  <View style={styles.classList}>
                    {selectedSpell.classes.map((cls, index) => (
                      <Chip 
                        key={index} 
                        style={styles.classChip}
                        textStyle={styles.classChipText}
                      >
                        {cls.name}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  searchBar: {
    margin: 16,
    backgroundColor: '#2a2a2a',
    elevation: 0,
  },
  searchInput: {
    color: '#ffffff',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 16,
    marginBottom: 8,
  },
  levelFilter: {
    paddingHorizontal: 16,
  },
  levelFilterContent: {
    paddingRight: 16,
  },
  classFilter: {
    paddingHorizontal: 16,
  },
  classFilterContent: {
    paddingRight: 16,
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#2a2a2a',
    borderColor: '#4a4a9c',
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: '#4a4a9c',
  },
  chipText: {
    color: '#ffffff',
  },
  selectedChipText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spellList: {
    flex: 1,
    padding: 16,
  },
  spellCard: {
    marginBottom: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    elevation: 2,
  },
  cardContent: {
    padding: 12,
  },
  spellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  spellName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  schoolText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modal: {
    backgroundColor: '#2a2a2a',
    margin: 20,
    padding: 0,
    borderRadius: 8,
    maxHeight: '80%',
    width: width - 40,
  },
  modalScroll: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  closeButton: {
    margin: 0,
  },
  modalSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    backgroundColor: '#444444',
    marginVertical: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#ffffff',
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  resetButton: {
    borderColor: '#4a4a9c',
    marginHorizontal: 16,
    marginTop: 8,
  },
  resetButtonText: {
    color: '#ffffff',
  },
  classList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  classChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#3a3a3a',
  },
  classChipText: {
    color: '#ffffff',
  },
}); 