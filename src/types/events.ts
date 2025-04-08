export interface AdventureEvent {
  id: string;
  title: string;
  type: 'exploration' | 'combat' | 'social' | 'puzzle' | 'treasure';
  choices: string[];
  requires: string[];
  grants: string[];
  prompt: string;
}

export interface EventChoice {
  text: string;
  outcome: string;
  requires?: string[];
  grants?: string[];
}

export interface EventOutcome {
  description: string;
  choices: EventChoice[];
}

export interface PlayerState {
  tags: string[];
  inventory: string[];
  stats: {
    health: number;
    maxHealth: number;
    gold: number;
    experience: number;
    level: number;
  };
} 