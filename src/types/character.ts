import { Spell } from '../services/dndApi';

export interface Character {
  id: string;
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
  spells?: Spell[];
  equipment?: string[];
  proficiencies?: string[];
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
} 