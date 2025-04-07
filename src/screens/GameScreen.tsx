import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  TouchableWithoutFeedback,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Text, TextInput, Button, Card, Divider, IconButton, Avatar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

// Mock data for messages - in a real app, this would come from a database or real-time API
const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'dm',
    content: 'Welcome to your adventure! You find yourself at a crossroads in a dense forest. The path to the left leads to a small village, while the path to the right leads deeper into the forest.',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: '2',
    sender: 'player',
    content: 'I want to go to the village.',
    timestamp: new Date(Date.now() - 30000).toISOString(),
  },
  {
    id: '3',
    sender: 'dm',
    content: 'You make your way to the village. As you approach, you see a group of villagers gathered around a notice board. They seem concerned about something.',
    timestamp: new Date(Date.now() - 15000).toISOString(),
  },
];

// Mock data for campaigns - in a real app, this would come from a database
const MOCK_CAMPAIGNS = [
  {
    id: '1',
    name: 'The Lost Mine of Phandelver',
    type: 'solo',
    characterId: '1',
    status: 'in-progress',
  },
  {
    id: '2',
    name: 'Curse of Strahd',
    type: 'multiplayer',
    code: 'ABC123',
    status: 'waiting',
  },
];

export const GameScreen = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const route = useRoute<GameScreenRouteProp>();
  const campaignId = route.params?.campaignId;
  
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [campaign, setCampaign] = useState(MOCK_CAMPAIGNS.find(c => c.id === campaignId) || null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    // In a real app, you would fetch the campaign data from a database
    if (campaignId) {
      const foundCampaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
      if (foundCampaign) {
        setCampaign(foundCampaign);
      }
    }
    
    // Set up keyboard listeners
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => scrollToBottom(), 100);
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );
    
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [campaignId]);
  
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, you would send the message to a server
    const message = {
      id: Date.now().toString(),
      sender: 'player',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Scroll to bottom after sending a message
    setTimeout(() => scrollToBottom(), 100);
    
    // Simulate DM response after a short delay
    setTimeout(() => {
      const dmResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'dm',
        content: generateDMResponse(newMessage),
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, dmResponse]);
      
      // Scroll to bottom after receiving a response
      setTimeout(() => scrollToBottom(), 100);
    }, 1000);
  };
  
  const generateDMResponse = (playerMessage: string) => {
    // In a real app, this would be handled by an AI or a human DM
    const responses = [
      "You continue on your journey, finding more clues along the way.",
      "The villagers tell you about strange happenings in the forest.",
      "A mysterious figure approaches you with a quest.",
      "You discover a hidden treasure map in the village inn.",
      "The village elder recognizes you as the chosen one from the prophecy.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderMessage = (message: any) => {
    const isDM = message.sender === 'dm';
    
    return (
      <View 
        key={message.id} 
        style={[
          styles.messageContainer,
          isDM ? styles.dmMessageContainer : styles.playerMessageContainer
        ]}
      >
        {isDM && (
          <Avatar.Icon 
            size={40} 
            icon="dice-d20" 
            style={styles.dmAvatar} 
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isDM ? styles.dmMessageBubble : styles.playerMessageBubble
        ]}>
          <Text style={styles.messageContent}>{message.content}</Text>
          <Text style={styles.messageTimestamp}>{formatTimestamp(message.timestamp)}</Text>
        </View>
        
        {!isDM && (
          <Avatar.Icon 
            size={40} 
            icon="account" 
            style={styles.playerAvatar} 
          />
        )}
      </View>
    );
  };
  
  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Campaign not found</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Campaign')}
          style={styles.button}
        >
          Back to Campaigns
        </Button>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.campaignName}>{campaign.name}</Text>
          <Text style={styles.campaignType}>
            {campaign.type === 'solo' ? 'Solo Campaign' : 'Multiplayer Campaign'}
          </Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <ScrollView 
          ref={scrollViewRef}
          style={[
            styles.messagesContainer,
            { marginBottom: Platform.OS === 'ios' ? keyboardHeight : 0 }
          ]}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
        >
          {messages.map(renderMessage)}
        </ScrollView>
        
        <View style={[
          styles.inputContainer,
          { paddingBottom: Platform.OS === 'android' ? keyboardHeight : 0 }
        ]}>
          <TextInput
            placeholder="Type your message..."
            value={newMessage}
            onChangeText={setNewMessage}
            mode="outlined"
            style={styles.input}
            textColor="#000000"
            outlineColor="#4a4a9c"
            right={
              <TextInput.Icon 
                icon="send" 
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              />
            }
            onSubmitEditing={handleSendMessage}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#2a2a2a',
  },
  campaignName: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  campaignType: {
    color: '#cccccc',
    marginTop: 5,
  },
  divider: {
    backgroundColor: '#444444',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  dmMessageContainer: {
    justifyContent: 'flex-start',
  },
  playerMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  dmMessageBubble: {
    backgroundColor: '#4a4a9c',
  },
  playerMessageBubble: {
    backgroundColor: '#2a2a2a',
  },
  messageContent: {
    color: '#ffffff',
    fontSize: 16,
  },
  messageTimestamp: {
    color: '#cccccc',
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  dmAvatar: {
    backgroundColor: '#4a4a9c',
  },
  playerAvatar: {
    backgroundColor: '#2a2a2a',
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderTopWidth: 1,
    borderTopColor: '#444444',
  },
  input: {
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  button: {
    margin: 20,
    backgroundColor: '#4a4a9c',
  },
}); 