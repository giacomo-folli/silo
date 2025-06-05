# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm start` - Start Expo development server
- `npm run android` - Start Android development build
- `npm run ios` - Start iOS development build  
- `npm run web` - Start web development build
- `npm run lint` - Run ESLint

### Project Management
- `npm run reset-project` - Reset to blank project (moves starter code to app-example/)

## Architecture Overview

This is an Expo React Native note-taking app called "Silo" using Expo Router for navigation.

### Routing Structure
- Uses **Expo Router** with file-based routing in `/app` directory
- Two-tab structure: Editor and Archive tabs
- Root layout handles theme and font loading
- Tab layout defines navigation structure

### Component Organization
- **Screens**: `/src/screens/` - Main app screens (NotePage, ArchivePage)
- **UI Components**: `/src/components/ui/` - Themed and reusable UI components
- **Common Components**: `/src/components/common/` - Shared utilities
- **Centralized exports** through `index.ts` files

### State Management
- Uses **local component state** with props drilling (no global state management)
- State lives in tab components, passed down to screens
- AsyncStorage for persistence with debounced auto-save
- Storage keys: `silo_note` (current), `silo_notes_archive` (archived)

### Styling
- Single `styles.tsx` file with React Native StyleSheet
- Theme support via `useColorScheme` hook
- Platform-specific implementations (`.ios.tsx` files)

### Key Features
- Real-time auto-save with 1-second debounce
- Word count tracking
- Archive management for notes
- Cross-platform icon system
- Gesture handling (swipe down to dismiss keyboard)

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)

### TypeScript
- Strict mode enabled
- Some `any` types exist (marked as TODOs for improvement)