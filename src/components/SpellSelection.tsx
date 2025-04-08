import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Searchbar, Chip, Button, Portal, Modal, Divider, IconButton } from 'react-native-paper';
import { dndApi, Spell, ApiReference } from '../services/dndApi';

interface SpellSelectionProps {
  characterClass?: string;
  level?: number;
  onSpellsSelected?: (spells: Spell[]) => void;
  maxSpells?: number;
  initialSpells?: Spell[];
}

export const SpellSelection: React.FC<SpellSelectionProps> = ({ 
  characterClass, 
  level = 1, 
  onSpellsSelected,
  maxSpells = 0,
  initialSpells = []
}) => {
  const [spells, setSpells] = useState<ApiReference[]>([]);
  const [filteredSpells, setFilteredSpells] = useState<ApiReference[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [spellModalVisible, setSpellModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [spellDetails, setSpellDetails] = useState<{[key: string]: Spell}>({});
  const [loadingSpell, setLoadingSpell] = useState<string | null>(null);
  const [selectedSpells, setSelectedSpells] = useState<Spell[]>(initialSpells);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    loadSpells();
  }, [characterClass]);

  useEffect(() => {
    filterSpells();
  }, [searchQuery, spells, selectedLevel, spellDetails, characterClass, level]);

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
        // Don't load spell details here - we'll load them on demand
        return true;
      });
    }
    
    // Filter by class if selected
    if (characterClass) {
      filtered = filtered.filter(spell => {
        // If we already have the spell details, use them
        if (spellDetails[spell.index]) {
          return spellDetails[spell.index].classes.some(c => c.name.toLowerCase() === characterClass.toLowerCase());
        }
        // Don't load spell details here - we'll load them on demand
        return true;
      });
    }
    
    // Filter by character level - only show spells the character can cast at their level
    filtered = filtered.filter(spell => {
      // If we already have the spell details, use them
      if (spellDetails[spell.index]) {
        const spellLevel = spellDetails[spell.index].level;
        
        // Cantrips (level 0) are always available
        if (spellLevel === 0) return true;
        
        // For spell levels 1-9, check if the character can cast spells of that level
        // This is a simplified check - in a real app, you'd want to check the class's spellcasting table
        if (characterClass) {
          switch (characterClass.toLowerCase()) {
            case 'wizard':
            case 'sorcerer':
            case 'bard':
              // These classes can cast spells of level 1 at character level 1
              // For simplicity, we'll just check if the spell level is less than or equal to the character level
              return spellLevel <= level;
            case 'cleric':
            case 'druid':
              // These classes can cast spells of level 1 at character level 1
              return spellLevel <= level;
            default:
              // For other classes, only show cantrips
              return spellLevel === 0;
          }
        }
        
        // Default to showing only cantrips if no class is selected
        return spellLevel === 0;
      }
      
      // Don't load spell details here - we'll load them on demand
      return true;
    });
    
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

  const handleSelectSpell = (spell: Spell) => {
    // Check if spell is already selected
    const isAlreadySelected = selectedSpells.some(s => s.index === spell.index);
    
    if (isAlreadySelected) {
      // Remove spell if already selected
      setSelectedSpells(selectedSpells.filter(s => s.index !== spell.index));
    } else {
      // Add spell if not already selected and under max limit
      if (maxSpells === 0 || selectedSpells.length < maxSpells) {
        setSelectedSpells([...selectedSpells, spell]);
      }
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
  };

  const handleCancelSelection = () => {
    // Reset to initial spells
    setSelectedSpells(initialSpells);
    setIsConfirmed(false);
    
    // Close the modal if it's open
    setSpellModalVisible(false);
  };

  const handleConfirmSelection = () => {
    if (onSpellsSelected) {
      onSpellsSelected(selectedSpells);
    }
    setIsConfirmed(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Spells</Text>
        {maxSpells > 0 && (
          <Text style={styles.subtitle}>
            {selectedSpells.length} / {maxSpells} spells selected
          </Text>
        )}
        <Text style={styles.levelInfo}>Character Level: {level}</Text>
      </View>
      
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
        
        {(selectedLevel !== null || searchQuery) && (
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
              const isSelected = details ? selectedSpells.some(s => s.index === spell.index) : false;
              
              return (
                <Card
                  key={spell.index}
                  style={[styles.spellCard, isSelected && styles.selectedSpellCard]}
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
                    {details && (
                      <Button
                        mode={isSelected ? "contained" : "outlined"}
                        onPress={() => handleSelectSpell(details)}
                        style={styles.selectButton}
                        labelStyle={styles.selectButtonText}
                        disabled={!isSelected && maxSpells > 0 && selectedSpells.length >= maxSpells}
                      >
                        {isSelected ? "Remove" : "Select"}
                      </Button>
                    )}
                  </Card.Content>
                </Card>
              );
            })
          )}
        </ScrollView>
      )}
      
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={handleCancelSelection}
          style={styles.actionButton}
          labelStyle={styles.actionButtonText}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleConfirmSelection}
          style={styles.actionButton}
          labelStyle={styles.actionButtonText}
          disabled={selectedSpells.length === 0 || (maxSpells > 0 && selectedSpells.length > maxSpells)}
        >
          Confirm Selection
        </Button>
      </View>
      
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
              
              <Button
                mode={selectedSpells.some(s => s.index === selectedSpell.index) ? "contained" : "outlined"}
                onPress={() => {
                  handleSelectSpell(selectedSpell);
                }}
                style={styles.modalSelectButton}
                labelStyle={styles.modalSelectButtonText}
                disabled={!selectedSpells.some(s => s.index === selectedSpell.index) && maxSpells > 0 && selectedSpells.length >= maxSpells}
              >
                {selectedSpells.some(s => s.index === selectedSpell.index) ? "Remove Spell" : "Select Spell"}
              </Button>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0a0',
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
  selectedSpellCard: {
    borderColor: '#4a4a9c',
    borderWidth: 2,
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
  selectButton: {
    marginTop: 8,
    borderColor: '#4a4a9c',
  },
  selectButtonText: {
    color: '#ffffff',
  },
  modal: {
    backgroundColor: '#2a2a2a',
    margin: 20,
    padding: 0,
    borderRadius: 8,
    maxHeight: '80%',
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
  modalSelectButton: {
    marginTop: 16,
    borderColor: '#4a4a9c',
  },
  modalSelectButtonText: {
    color: '#ffffff',
  },
  levelInfo: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#444444',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: '#ffffff',
  },
}); 