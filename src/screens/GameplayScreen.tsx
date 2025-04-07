import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { DiceRoller } from '../components/DiceRoller';
import { InitiativeTracker } from '../components/InitiativeTracker';
import { CombatLog } from '../components/CombatLog';

export const GameplayScreen = () => {
  const [activeTab, setActiveTab] = useState('dice');

  const handleDiceRoll = (result: number, diceType: number) => {
    console.log(`Rolled d${diceType}: ${result}`);
    // Here you could add the roll to the combat log
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'dice', label: 'Dice' },
          { value: 'initiative', label: 'Initiative' },
          { value: 'combat', label: 'Combat Log' },
        ]}
        style={styles.segmentedButtons}
      />

      <View style={styles.content}>
        {activeTab === 'dice' && (
          <DiceRoller onRoll={handleDiceRoll} />
        )}
        {activeTab === 'initiative' && (
          <InitiativeTracker />
        )}
        {activeTab === 'combat' && (
          <CombatLog />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  segmentedButtons: {
    margin: 16,
  },
  content: {
    flex: 1,
  },
}); 