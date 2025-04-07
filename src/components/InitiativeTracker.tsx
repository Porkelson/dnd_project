import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, IconButton, TextInput, Button } from 'react-native-paper';

interface Combatant {
  id: string;
  name: string;
  initiative: number;
  isPlayer: boolean;
}

export const InitiativeTracker: React.FC = () => {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [newName, setNewName] = useState('');
  const [newInitiative, setNewInitiative] = useState('');

  const addCombatant = () => {
    if (!newName || !newInitiative) return;

    const newCombatant: Combatant = {
      id: Date.now().toString(),
      name: newName,
      initiative: parseInt(newInitiative),
      isPlayer: true,
    };

    setCombatants([...combatants, newCombatant].sort((a, b) => b.initiative - a.initiative));
    setNewName('');
    setNewInitiative('');
  };

  const removeCombatant = (id: string) => {
    setCombatants(combatants.filter(c => c.id !== id));
  };

  const nextTurn = () => {
    if (combatants.length === 0) return;
    const first = combatants[0];
    setCombatants([...combatants.slice(1), first]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Name"
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
          textColor="#000000"
          outlineColor="#4a4a9c"
        />
        <TextInput
          label="Initiative"
          value={newInitiative}
          onChangeText={setNewInitiative}
          keyboardType="numeric"
          style={styles.input}
          textColor="#000000"
          outlineColor="#4a4a9c"
        />
        <Button
          mode="contained"
          onPress={addCombatant}
          style={styles.addButton}
          labelStyle={styles.buttonText}
        >
          Add
        </Button>
      </View>

      <ScrollView style={styles.list}>
        {combatants.map((combatant, index) => (
          <Card
            key={combatant.id}
            style={[
              styles.combatantCard,
              index === 0 && styles.activeCombatant,
            ]}
          >
            <Card.Content style={styles.combatantContent}>
              <View>
                <Text style={styles.combatantName}>{combatant.name}</Text>
                <Text style={styles.initiativeText}>
                  Initiative: {combatant.initiative}
                </Text>
              </View>
              <IconButton
                icon="delete"
                size={20}
                onPress={() => removeCombatant(combatant.id)}
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Button
        mode="contained"
        onPress={nextTurn}
        style={styles.nextButton}
        labelStyle={styles.buttonText}
      >
        Next Turn
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#ffffff',
  },
  addButton: {
    backgroundColor: '#4a4a9c',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  combatantCard: {
    marginBottom: 8,
    backgroundColor: '#2a2a2a',
  },
  activeCombatant: {
    borderLeftWidth: 4,
    borderLeftColor: '#4a4a9c',
  },
  combatantContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  combatantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  initiativeText: {
    color: '#a0a0ff',
    fontSize: 14,
  },
  nextButton: {
    marginTop: 16,
    backgroundColor: '#4a4a9c',
  },
}); 