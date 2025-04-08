import { AdventureEvent, PlayerState } from '../types/events';
import Config from 'react-native-config';

// This is a mock implementation. In a real app, you would use the OpenAI API.
// You would need to install the OpenAI package: npm install openai

class OpenAIService {
  private apiKey: string | undefined;
  private baseUrl: string = 'https://api.openai.com/v1';
  
  constructor() {
    this.apiKey = Config.OPENAI_API_KEY;
  }
  
  /**
   * Generate a dynamic description for an event based on the event prompt and player state
   */
  async generateEventDescription(event: AdventureEvent, playerState: PlayerState): Promise<string> {
    try {
      // In a real app, this would call the OpenAI API
      // For now, we'll use a mock implementation
      
      // Create a context string with player state
      const context = this.createContextString(playerState);
      
      // In a real implementation, you would call OpenAI API here
      // const response = await this.callOpenAI(event.prompt, context);
      
      // For now, return a mock description
      return this.generateMockDescription(event, playerState);
    } catch (error) {
      console.error('Error generating event description:', error);
      return event.prompt; // Fallback to the basic prompt
    }
  }
  
  /**
   * Create a context string from the player state
   */
  private createContextString(playerState: PlayerState): string {
    return `
      Player Tags: ${playerState.tags.join(', ')}
      Inventory: ${playerState.inventory.join(', ')}
      Level: ${playerState.stats.level}
      Health: ${playerState.stats.health}/${playerState.stats.maxHealth}
      Gold: ${playerState.stats.gold}
    `;
  }
  
  /**
   * Generate a mock description for an event
   */
  private generateMockDescription(event: AdventureEvent, playerState: PlayerState): string {
    // Create a more detailed description based on the event type and player state
    let description = `You encounter ${event.title.toLowerCase()}. ${event.prompt}`;
    
    // Add details based on event type
    switch (event.type) {
      case 'exploration':
        description += ` The area is filled with interesting details and potential discoveries.`;
        break;
      case 'combat':
        description += ` The situation is tense and dangerous.`;
        break;
      case 'social':
        description += ` The person seems to have valuable information or items.`;
        break;
      case 'puzzle':
        description += ` There are clues scattered around that might help solve this puzzle.`;
        break;
      case 'treasure':
        description += ` Valuable items are visible, but there might be traps or guardians.`;
        break;
    }
    
    // Add details based on player state
    if (playerState.tags.includes('rested')) {
      description += ` You feel well-rested and ready for anything.`;
    }
    
    if (playerState.stats.health < playerState.stats.maxHealth * 0.5) {
      description += ` Your injuries make this situation more challenging.`;
    }
    
    if (playerState.stats.level > 5) {
      description += ` Your experience helps you notice details that others might miss.`;
    }
    
    return description;
  }
  
  /**
   * Call the OpenAI API (mock implementation)
   */
  private async callOpenAI(prompt: string, context: string): Promise<string> {
    // This is a mock implementation
    // In a real app, you would use the OpenAI API
    
    // Example of how you would call the OpenAI API:
    /*
    const { Configuration, OpenAIApi } = require('openai');
    
    const configuration = new Configuration({
      apiKey: this.apiKey,
    });
    
    const openai = new OpenAIApi(configuration);
    
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: `${prompt}\n\nContext: ${context}`,
      max_tokens: 150,
      temperature: 0.7,
    });
    
    return response.data.choices[0].text || prompt;
    */
    
    // For now, just return the prompt
    return prompt;
  }
}

// Export a singleton instance
export const openAIService = new OpenAIService(); 