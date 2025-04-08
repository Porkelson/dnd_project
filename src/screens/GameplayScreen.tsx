import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { DiceRoller } from '../components/DiceRoller';
import { InitiativeTracker } from '../components/InitiativeTracker';
import { CombatLog } from '../components/CombatLog';
import { SpellBook } from '../components/SpellBook';

export const GameplayScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('dice');

  const renderContent = () => {
    switch (selectedTab) {
      case 'dice':
        return <DiceRoller />;
      case 'initiative':
        return <InitiativeTracker />;
      case 'combat':
        return <CombatLog />;
      case 'spells':
        return <SpellBook />;
      default:
        return <DiceRoller />;
    }
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={selectedTab}
        onValueChange={setSelectedTab}
        buttons={[
          { value: 'dice', label: 'Dice' },
          { value: 'initiative', label: 'Initiative' },
          { value: 'combat', label: 'Combat Log' },
          { value: 'spells', label: 'Spellbook' },
        ]}
        style={styles.segmentedButtons}
      />
      <View style={styles.content}>
        {renderContent()}
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
    backgroundColor: '#2a2a2a',
  },
  content: {
    flex: 1,
  },
}); 