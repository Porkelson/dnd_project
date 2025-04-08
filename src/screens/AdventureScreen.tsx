import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Surface, useTheme, ActivityIndicator, Divider } from 'react-native-paper';
import { eventService } from '../services/eventService';
import { AdventureEvent, EventOutcome, PlayerState } from '../types/events';

export const AdventureScreen: React.FC = () => {
  const theme = useTheme();
  const [currentEvent, setCurrentEvent] = useState<AdventureEvent | null>(null);
  const [eventDescription, setEventDescription] = useState<string>('');
  const [outcome, setOutcome] = useState<EventOutcome | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [playerState, setPlayerState] = useState<PlayerState>(eventService.getPlayerState());

  // Load a random event when the screen mounts or when requested
  const loadRandomEvent = async () => {
    setLoading(true);
    try {
      const event = eventService.getRandomEvent();
      if (event) {
        setCurrentEvent(event);
        const description = await eventService.generateEventDescription(event);
        setEventDescription(description);
        setOutcome(null);
      } else {
        // No eligible events
        setCurrentEvent(null);
        setEventDescription('You have explored all available events. Try completing some events to unlock more.');
      }
    } catch (error) {
      console.error('Error loading event:', error);
      setEventDescription('An error occurred while loading the event.');
    } finally {
      setLoading(false);
    }
  };

  // Load initial event
  useEffect(() => {
    loadRandomEvent();
  }, []);

  // Handle player choice
  const handleChoice = async (choiceIndex: number) => {
    if (!currentEvent) return;
    
    setLoading(true);
    try {
      const result = await eventService.processChoice(currentEvent, choiceIndex);
      setOutcome(result);
      setPlayerState(eventService.getPlayerState());
    } catch (error) {
      console.error('Error processing choice:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle outcome choice
  const handleOutcomeChoice = async (choice: string) => {
    // In a real app, this would process the outcome choice
    // For now, just load a new event
    loadRandomEvent();
  };

  // Render the current event
  const renderEvent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            Generating adventure...
          </Text>
        </View>
      );
    }

    if (!currentEvent) {
      return (
        <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            No Events Available
          </Text>
          <Text style={[styles.description, { color: theme.colors.onSurface }]}>
            {eventDescription}
          </Text>
          <Button
            mode="contained"
            onPress={loadRandomEvent}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
          >
            Try Again
          </Button>
        </Surface>
      );
    }

    return (
      <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          {currentEvent.title}
        </Text>
        <Text style={[styles.type, { color: theme.colors.secondary }]}>
          {currentEvent.type.charAt(0).toUpperCase() + currentEvent.type.slice(1)}
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.onSurface }]}>
          {eventDescription}
        </Text>
        
        <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
        
        <Text style={[styles.choicesTitle, { color: theme.colors.onSurface }]}>
          What do you do?
        </Text>
        
        <View style={styles.choicesContainer}>
          {currentEvent.choices.map((choice, index) => (
            <Button
              key={index}
              mode="outlined"
              onPress={() => handleChoice(index)}
              style={[styles.choiceButton, { borderColor: theme.colors.primary }]}
              textColor={theme.colors.onSurface}
            >
              {choice}
            </Button>
          ))}
        </View>
      </Surface>
    );
  };

  // Render the outcome
  const renderOutcome = () => {
    if (!outcome) return null;
    
    return (
      <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          Outcome
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.onSurface }]}>
          {outcome.description}
        </Text>
        
        <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
        
        <Text style={[styles.choicesTitle, { color: theme.colors.onSurface }]}>
          What's next?
        </Text>
        
        <View style={styles.choicesContainer}>
          {outcome.choices.map((choice, index) => (
            <Button
              key={index}
              mode="outlined"
              onPress={() => handleOutcomeChoice(choice.text)}
              style={[styles.choiceButton, { borderColor: theme.colors.primary }]}
              textColor={theme.colors.onSurface}
            >
              {choice.text}
            </Button>
          ))}
        </View>
      </Surface>
    );
  };

  // Render player state
  const renderPlayerState = () => {
    return (
      <Surface style={[styles.stateSurface, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.stateTitle, { color: theme.colors.primary }]}>
          Player State
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.colors.onSurface }]}>Health</Text>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {playerState.stats.health}/{playerState.stats.maxHealth}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.colors.onSurface }]}>Level</Text>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {playerState.stats.level}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.colors.onSurface }]}>Gold</Text>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {playerState.stats.gold}
            </Text>
          </View>
        </View>
        
        {playerState.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={[styles.tagsTitle, { color: theme.colors.onSurface }]}>
              Tags
            </Text>
            <View style={styles.tagsList}>
              {playerState.tags.map((tag, index) => (
                <Surface 
                  key={index} 
                  style={[styles.tag, { backgroundColor: theme.colors.primaryContainer }]}
                >
                  <Text style={[styles.tagText, { color: theme.colors.onPrimaryContainer }]}>
                    {tag}
                  </Text>
                </Surface>
              ))}
            </View>
          </View>
        )}
      </Surface>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {renderPlayerState()}
      {renderEvent()}
      {renderOutcome()}
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
    padding: 16,
  },
  surface: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  stateSurface: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  type: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  choicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  choicesContainer: {
    gap: 12,
  },
  choiceButton: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 18,
  },
  tagsContainer: {
    marginTop: 8,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
  },
}); 