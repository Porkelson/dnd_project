import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, TextInput, Divider, SegmentedButtons, Portal, Modal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type CampaignScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Campaign {
  id: string;
  name: string;
  type: 'solo' | 'multiplayer';
  status: 'in-progress' | 'waiting';
  description?: string;
  characterId?: string;
  code?: string;
  players?: number;
}

// Mock data for campaigns - in a real app, this would come from a database
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'The Lost Mine of Phandelver',
    type: 'solo',
    characterId: '1',
    status: 'in-progress',
    description: 'A classic D&D 5e adventure for levels 1-5',
    players: 1
  },
  {
    id: '2',
    name: 'Curse of Strahd',
    type: 'multiplayer',
    code: 'ABC123',
    status: 'waiting',
    description: 'Gothic horror campaign in Barovia',
    players: 4
  },
];

export const CampaignScreen = () => {
  const navigation = useNavigation<CampaignScreenNavigationProp>();
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [visible, setVisible] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignDescription, setNewCampaignDescription] = useState('');
  const [campaignType, setCampaignType] = useState<'solo' | 'multiplayer'>('solo');

  const handleCreateCampaign = () => {
    if (newCampaignName.trim()) {
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: newCampaignName.trim(),
        description: newCampaignDescription.trim(),
        type: campaignType,
        status: campaignType === 'solo' ? 'in-progress' : 'waiting',
        players: campaignType === 'solo' ? 1 : 4,
        code: campaignType === 'multiplayer' ? generateJoinCode() : undefined,
      };
      
      setCampaigns([...campaigns, newCampaign]);
      setNewCampaignName('');
      setNewCampaignDescription('');
      setCampaignType('solo');
      hideModal();
    }
  };

  const generateJoinCode = () => {
    // Generate a random 6-character code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const renderCampaignItem = (campaign: Campaign) => (
    <Card
      key={campaign.id}
      style={styles.card}
      onPress={() => navigation.navigate('Game', { campaignId: campaign.id })}
    >
      <Card.Content>
        <Text style={styles.cardTitle}>{campaign.name}</Text>
        {campaign.description && (
          <Text style={styles.cardDescription}>{campaign.description}</Text>
        )}
        <Text style={styles.cardInfo}>
          {campaign.type === 'solo' ? 'Solo Campaign' : `${campaign.players} Players`}
        </Text>
        {campaign.code && (
          <Text style={styles.cardInfo}>Join Code: {campaign.code}</Text>
        )}
        <Text style={styles.cardInfo}>Status: {campaign.status}</Text>
      </Card.Content>
    </Card>
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {campaigns.map(renderCampaignItem)}
      </ScrollView>

      <Button
        mode="contained"
        onPress={showModal}
        style={styles.createButton}
        labelStyle={styles.createButtonText}
      >
        Create New Campaign
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Create New Campaign</Text>
          
          <Text style={styles.label}>Campaign Type</Text>
          <SegmentedButtons
            value={campaignType}
            onValueChange={value => setCampaignType(value as 'solo' | 'multiplayer')}
            buttons={[
              { value: 'solo', label: 'Solo' },
              { value: 'multiplayer', label: 'Multiplayer' },
            ]}
            style={styles.segmentedButtons}
          />
          
          <Text style={styles.campaignTypeDescription}>
            {campaignType === 'solo' 
              ? 'Play alone with the AI Dungeon Master' 
              : 'Play with friends using a join code'}
          </Text>
          
          <TextInput
            label="Campaign Name"
            value={newCampaignName}
            onChangeText={setNewCampaignName}
            style={styles.input}
            textColor="#000000"
            outlineColor="#4a4a9c"
          />
          
          <TextInput
            label="Description"
            value={newCampaignDescription}
            onChangeText={setNewCampaignDescription}
            multiline
            numberOfLines={3}
            style={styles.input}
            textColor="#000000"
            outlineColor="#4a4a9c"
          />
          
          <Button
            mode="contained"
            onPress={handleCreateCampaign}
            style={styles.submitButton}
            labelStyle={styles.submitButtonText}
          >
            Create Campaign
          </Button>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#2a2a2a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#ffffff',
    marginBottom: 8,
    fontSize: 14,
  },
  cardInfo: {
    color: '#a0a0ff',
    fontSize: 14,
    marginVertical: 2,
    fontWeight: '500',
  },
  createButton: {
    margin: 16,
    backgroundColor: '#4a4a9c',
    paddingVertical: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modal: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  segmentedButtons: {
    marginBottom: 10,
  },
  campaignTypeDescription: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#4a4a9c',
    marginTop: 10,
    paddingVertical: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 