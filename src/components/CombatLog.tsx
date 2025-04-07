import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, TextInput, Button } from 'react-native-paper';

interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'attack' | 'damage' | 'heal' | 'effect' | 'other';
}

export const CombatLog: React.FC = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedType, setSelectedType] = useState<LogEntry['type']>('other');

  const addLogEntry = () => {
    if (!newMessage.trim()) return;

    const entry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message: newMessage.trim(),
      type: selectedType,
    };

    setLogEntries([entry, ...logEntries]);
    setNewMessage('');
  };

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'attack':
        return '#ff4444';
      case 'damage':
        return '#ff8844';
      case 'heal':
        return '#44ff44';
      case 'effect':
        return '#4444ff';
      default:
        return '#ffffff';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.logContainer}>
        {logEntries.map((entry) => (
          <Card key={entry.id} style={styles.logEntry}>
            <Card.Content>
              <View style={styles.logHeader}>
                <Text style={styles.timestamp}>
                  {formatTimestamp(entry.timestamp)}
                </Text>
                <Text
                  style={[
                    styles.type,
                    { color: getTypeColor(entry.type) },
                  ]}
                >
                  {entry.type.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.message}>{entry.message}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.typeButtons}>
          {(['attack', 'damage', 'heal', 'effect', 'other'] as const).map((type) => (
            <Button
              key={type}
              mode={selectedType === type ? 'contained' : 'outlined'}
              onPress={() => setSelectedType(type)}
              style={[
                styles.typeButton,
                selectedType === type && { backgroundColor: getTypeColor(type) },
              ]}
              labelStyle={styles.typeButtonText}
            >
              {type}
            </Button>
          ))}
        </View>

        <TextInput
          label="New Log Entry"
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
          textColor="#000000"
          outlineColor="#4a4a9c"
        />

        <Button
          mode="contained"
          onPress={addLogEntry}
          style={styles.addButton}
          labelStyle={styles.buttonText}
        >
          Add Entry
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  logContainer: {
    flex: 1,
    padding: 16,
  },
  logEntry: {
    marginBottom: 8,
    backgroundColor: '#2a2a2a',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timestamp: {
    color: '#a0a0ff',
    fontSize: 12,
  },
  type: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  message: {
    color: '#ffffff',
    fontSize: 14,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#2a2a2a',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    margin: 4,
  },
  typeButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  input: {
    marginBottom: 16,
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
}); 