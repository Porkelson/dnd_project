// src/services/characterService.ts
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, Query, CollectionReference, DocumentData, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Spell } from './dndApi';
import { getCurrentUser } from './authService';

const CHARACTERS_COLLECTION = 'characters';

export interface Character {
  id?: string;
  userId: string;
  name: string;
  race: string;
  class: string;
  level: number;
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  spells?: any[];
  equipment?: string[];
  proficiencies?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const createCharacter = async (characterData: Omit<Character, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Character> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to create a character');
  }

  const newCharacter: Omit<Character, 'id'> = {
    ...characterData,
    userId: currentUser.uid,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await addDoc(collection(db, CHARACTERS_COLLECTION), newCharacter);
  return { ...newCharacter, id: docRef.id };
};

export const getCharacter = async (characterId: string): Promise<Character> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to view characters');
  }

  const characterDoc = await getDoc(doc(db, CHARACTERS_COLLECTION, characterId));
  
  if (!characterDoc.exists()) {
    throw new Error('Character not found');
  }

  const characterData = characterDoc.data() as Character;
  
  // Ensure the character belongs to the current user
  if (characterData.userId !== currentUser.uid) {
    throw new Error('You do not have permission to view this character');
  }

  return { ...characterData, id: characterDoc.id };
};

export const getCharacters = async (): Promise<Character[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to view characters');
  }

  const charactersQuery = query(
    collection(db, CHARACTERS_COLLECTION),
    where('userId', '==', currentUser.uid)
  );

  const querySnapshot = await getDocs(charactersQuery);
  
  return querySnapshot.docs.map(doc => ({
    ...doc.data() as Character,
    id: doc.id
  }));
};

export const updateCharacter = async (id: string, updates: Partial<Character>): Promise<Character> => {
  try {
    const characterRef = doc(db, CHARACTERS_COLLECTION, id);
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    await updateDoc(characterRef, updateData);
    const updatedDoc = await getDoc(characterRef);
    return updatedDoc.data() as Character;
  } catch (error) {
    console.error('Error updating character:', error);
    throw error;
  }
};

export const deleteCharacter = async (id: string): Promise<void> => {
  try {
    const characterRef = doc(db, CHARACTERS_COLLECTION, id);
    await deleteDoc(characterRef);
  } catch (error) {
    console.error('Error deleting character:', error);
    throw error;
  }
};

export const updateCharacterSpells = async (characterId: string, spells: any[]): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to update characters');
  }

  const characterRef = doc(db, CHARACTERS_COLLECTION, characterId);
  const characterDoc = await getDoc(characterRef);
  
  if (!characterDoc.exists()) {
    throw new Error('Character not found');
  }

  const characterData = characterDoc.data() as Character;
  
  // Ensure the character belongs to the current user
  if (characterData.userId !== currentUser.uid) {
    throw new Error('You do not have permission to update this character');
  }

  await updateDoc(characterRef, {
    spells,
    updatedAt: new Date()
  });
};

export const updateCharacterEquipment = async (characterId: string, equipment: string[]): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to update characters');
  }

  const characterRef = doc(db, CHARACTERS_COLLECTION, characterId);
  const characterDoc = await getDoc(characterRef);
  
  if (!characterDoc.exists()) {
    throw new Error('Character not found');
  }

  const characterData = characterDoc.data() as Character;
  
  // Ensure the character belongs to the current user
  if (characterData.userId !== currentUser.uid) {
    throw new Error('You do not have permission to update this character');
  }

  await updateDoc(characterRef, {
    equipment,
    updatedAt: new Date()
  });
};

export const updateCharacterProficiencies = async (characterId: string, proficiencies: string[]): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to update characters');
  }

  const characterRef = doc(db, CHARACTERS_COLLECTION, characterId);
  const characterDoc = await getDoc(characterRef);
  
  if (!characterDoc.exists()) {
    throw new Error('Character not found');
  }

  const characterData = characterDoc.data() as Character;
  
  // Ensure the character belongs to the current user
  if (characterData.userId !== currentUser.uid) {
    throw new Error('You do not have permission to update this character');
  }

  await updateDoc(characterRef, {
    proficiencies,
    updatedAt: new Date()
  });
};