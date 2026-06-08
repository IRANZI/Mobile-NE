# LexiTech Dictionary

A React Native dictionary app built with **Expo**. Search English words, view definitions, hear pronunciations, and browse your search history.

## Features

- Word search with validation and autocomplete from history
- Definitions, phonetics, examples, and synonyms
- Audio pronunciation (multiple accents when available)
- Search history (saved on device, removable one-by-one or all at once)
- Light / dark mode toggle
- Drawer menu with recent searches

## Tech stack

- React Native + Expo SDK 54
- Expo Router (drawer navigation)
- [Free Dictionary API](https://dictionaryapi.dev/)
- AsyncStorage for history and theme preferences

## Getting started

```bash
npm install --legacy-peer-deps
npm start
```

Then press `a` for Android, `i` for iOS, or scan the QR code with **Expo Go**.

## Project structure

```
app/           Screens (search, history)
components/    UI components
context/       App state (dictionary, theme, alerts)
services/      API calls
utils/         Validation and helpers
```

## Company

LexiTech Solutions Ltd
