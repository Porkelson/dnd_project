import React, { useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import { IconButton } from 'react-native-paper';

interface DiceRollerProps {
  onRoll?: (result: number, diceType: number) => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll }) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [selectedDice, setSelectedDice] = useState(20);
  const spinValue = new Animated.Value(0);

  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  const rollDice = () => {
    if (rolling) return;
    
    setRolling(true);
    setResult(null);

    // Create spinning animation
    Animated.sequence([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(spinValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate dice roll
    setTimeout(() => {
      const rollResult = Math.floor(Math.random() * selectedDice) + 1;
      setResult(rollResult);
      setRolling(false);
      onRoll?.(rollResult, selectedDice);
    }, 500);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.diceSelector}>
        {diceTypes.map((dice) => (
          <TouchableOpacity
            key={dice}
            style={[
              styles.diceButton,
              selectedDice === dice && styles.selectedDice,
            ]}
            onPress={() => setSelectedDice(dice)}
          >
            <Text style={styles.diceText}>d{dice}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View
        style={[
          styles.dice,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <Text style={styles.diceNumber}>
          {rolling ? '?' : result || selectedDice}
        </Text>
      </Animated.View>

      <IconButton
        icon="dice-multiple"
        size={40}
        onPress={rollDice}
        disabled={rolling}
        style={styles.rollButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  diceSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  diceButton: {
    padding: 8,
    margin: 4,
    borderRadius: 4,
    backgroundColor: '#3a3a3a',
  },
  selectedDice: {
    backgroundColor: '#4a4a9c',
  },
  diceText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dice: {
    width: 80,
    height: 80,
    backgroundColor: '#4a4a9c',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  diceNumber: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  rollButton: {
    backgroundColor: '#4a4a9c',
  },
}); 