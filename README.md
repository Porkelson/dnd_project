# D&D Adventure Companion

A beginner-friendly D&D experience that focuses on storytelling and adventure rather than complex mechanics. This app provides a simplified way to create characters and experience D&D adventures guided by an AI Dungeon Master.

## Features

- **Simplified Character Creation**: Create D&D characters with minimal complexity
- **AI Dungeon Master**: Experience adventures guided by an intelligent DM
- **Adventure Management**: Track quests, NPCs, and your character's journey
- **Visual Storytelling**: Immersive descriptions and visual elements
- **Beginner-Friendly**: Perfect for newcomers to D&D

## Tech Stack

### Frontend
- React Native - Cross-platform mobile app development
- React Navigation - App navigation
- React Native Paper - UI components
- React Query - Data fetching and state management
- AsyncStorage - Local data persistence
- React Native Reanimated - Animations and transitions
- React Native SVG - Rendering maps and icons

### Backend
- Firebase
  - Firestore - Database for character data, adventures, and game state
  - Firebase Authentication - User accounts
  - Firebase Cloud Functions - AI DM integration and game logic
  - Firebase Storage - Storing images and assets

### AI Integration
- OpenAI API - AI DM responses and adventure generation
- LangChain - Managing conversation context and memory
- Vector Database - Storing and retrieving adventure content

### Development Tools
- TypeScript - Type safety
- ESLint & Prettier - Code quality and formatting
- Jest & React Native Testing Library - Testing
- GitHub Actions - CI/CD
- Expo - Development and deployment

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Firebase account
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/dnd-adventure-companion.git
cd dnd-adventure-companion
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server
```bash
npm start
# or
yarn start
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── screens/            # App screens
├── navigation/         # Navigation configuration
├── services/           # API and service integrations
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── utils/              # Utility functions
├── assets/             # Images, fonts, and other static assets
└── types/              # TypeScript type definitions
```

## Development Roadmap

### Phase 1: Foundation (Current)
- [x] Basic character creation
- [x] Spell book implementation
- [ ] Character persistence
- [ ] Basic adventure structure

### Phase 2: AI DM Integration
- [ ] OpenAI API integration
- [ ] Conversation flow design
- [ ] Adventure templates
- [ ] Basic world state tracking

### Phase 3: Adventure System
- [ ] Campaign framework
- [ ] Scene progression
- [ ] Quest system
- [ ] NPC interaction

### Phase 4: Enhanced Experience
- [ ] Visual elements
- [ ] Sound effects
- [ ] Tutorial system
- [ ] User feedback integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- D&D 5E API for providing game data
- OpenAI for AI capabilities
- The D&D community for inspiration and feedback 