import { AdventureEvent, PlayerState, EventOutcome, EventChoice } from '../types/events';
import { dndApi } from './dndApi';
import { openAIService } from './openaiService';

// Sample events - in a real app, these would come from a database or API
const SAMPLE_EVENTS: AdventureEvent[] = [
  {
    id: "ancient_tower",
    title: "Ancient Tower",
    type: "exploration",
    choices: ["Enter", "Inspect the surroundings", "Leave"],
    requires: [],
    grants: ["found_tower_key"],
    prompt: "Describe an abandoned tower filled with magical vines and old artifacts."
  },
  {
    id: "mysterious_merchant",
    title: "Mysterious Merchant",
    type: "social",
    choices: ["Barter", "Ask about local rumors", "Ignore"],
    requires: [],
    grants: ["merchant_friend"],
    prompt: "Describe a mysterious merchant with unusual wares and knowledge of the area."
  },
  {
    id: "dark_forest",
    title: "Dark Forest",
    type: "exploration",
    choices: ["Proceed carefully", "Take a shortcut", "Turn back"],
    requires: [],
    grants: ["forest_explorer"],
    prompt: "Describe a dense, dark forest with strange sounds and glowing eyes in the shadows."
  },
  {
    id: "ancient_ruins",
    title: "Ancient Ruins",
    type: "puzzle",
    choices: ["Investigate the symbols", "Search for treasure", "Leave"],
    requires: ["found_tower_key"],
    grants: ["ruins_knowledge"],
    prompt: "Describe ancient ruins with mysterious symbols and a sense of forgotten magic."
  },
  {
    id: "bandit_ambush",
    title: "Bandit Ambush",
    type: "combat",
    choices: ["Fight", "Negotiate", "Flee"],
    requires: [],
    grants: ["bandit_defeated"],
    prompt: "Describe a sudden ambush by bandits in a narrow pass."
  }
];

class EventService {
  private events: AdventureEvent[] = SAMPLE_EVENTS;
  private playerState: PlayerState = {
    tags: [],
    inventory: [],
    stats: {
      health: 100,
      maxHealth: 100,
      gold: 0,
      experience: 0,
      level: 1
    }
  };

  constructor() {
    // Initialize with default state
  }

  /**
   * Get the current player state
   */
  getPlayerState(): PlayerState {
    return { ...this.playerState };
  }

  /**
   * Update the player state
   */
  updatePlayerState(newState: Partial<PlayerState>): void {
    this.playerState = {
      ...this.playerState,
      ...newState,
      tags: newState.tags ? [...newState.tags] : [...this.playerState.tags],
      inventory: newState.inventory ? [...newState.inventory] : [...this.playerState.inventory],
      stats: newState.stats ? { ...this.playerState.stats, ...newState.stats } : { ...this.playerState.stats }
    };
  }

  /**
   * Add tags to the player state
   */
  addTags(tags: string[]): void {
    const uniqueTags = tags.filter(tag => !this.playerState.tags.includes(tag));
    this.playerState.tags = [...this.playerState.tags, ...uniqueTags];
  }

  /**
   * Remove tags from the player state
   */
  removeTags(tags: string[]): void {
    this.playerState.tags = this.playerState.tags.filter(tag => !tags.includes(tag));
  }

  /**
   * Check if the player meets the requirements for an event
   */
  meetsRequirements(requires: string[]): boolean {
    if (!requires || requires.length === 0) return true;
    return requires.every(req => this.playerState.tags.includes(req));
  }

  /**
   * Get all eligible events based on current player state
   */
  getEligibleEvents(): AdventureEvent[] {
    return this.events.filter(event => this.meetsRequirements(event.requires));
  }

  /**
   * Get a random eligible event
   */
  getRandomEvent(): AdventureEvent | null {
    const eligibleEvents = this.getEligibleEvents();
    if (eligibleEvents.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * eligibleEvents.length);
    return eligibleEvents[randomIndex];
  }

  /**
   * Apply the grants from an event to the player state
   */
  applyGrants(event: AdventureEvent): void {
    if (event.grants && event.grants.length > 0) {
      this.addTags(event.grants);
    }
  }

  /**
   * Generate a dynamic description for an event using OpenAI
   */
  async generateEventDescription(event: AdventureEvent): Promise<string> {
    try {
      return await openAIService.generateEventDescription(event, this.playerState);
    } catch (error) {
      console.error('Error generating event description:', error);
      return event.prompt; // Fallback to the basic prompt
    }
  }

  /**
   * Process a player choice for an event
   */
  async processChoice(event: AdventureEvent, choiceIndex: number): Promise<EventOutcome> {
    if (choiceIndex < 0 || choiceIndex >= event.choices.length) {
      throw new Error('Invalid choice index');
    }
    
    const choice = event.choices[choiceIndex];
    
    // Apply the grants from the event
    this.applyGrants(event);
    
    // Generate a description for the outcome
    const description = await this.generateEventDescription(event);
    
    // Create outcome choices based on the event type
    const outcomeChoices: EventChoice[] = [
      {
        text: "Continue",
        outcome: "You continue your journey.",
        grants: []
      }
    ];
    
    // Add type-specific choices
    if (event.type === 'combat') {
      outcomeChoices.push({
        text: "Rest",
        outcome: "You take a moment to rest and recover.",
        grants: ["rested"]
      });
    } else if (event.type === 'treasure') {
      outcomeChoices.push({
        text: "Examine closely",
        outcome: "You examine the treasure more closely.",
        grants: ["careful_examiner"]
      });
    }
    
    return {
      description,
      choices: outcomeChoices
    };
  }
}

// Export a singleton instance
export const eventService = new EventService(); 