# 🎵 Musify — Mini Music App

A React Native music app built with Expo.

---

## 📱 Features

### Core
- **Mock Login** — Email/password auth with validation and loading state
- **Home Feed** — Artist cards (horizontal scroll) + full track list
- **Music Player** — Play/pause, seek, next/previous track, progress bar
- **Artist Profile** — Hero image, bio, follower count, artist's tracks

### Bonus
- **Favorites System** — Heart any track; persisted locally via AsyncStorage
- **Session Resume** — Restores login state and last played track on reopen

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your Android/iOS device

### Run the app
```bash
git clone https://github.com/Shravani2906P/MusicApp.git
cd MusicApp
npm install
npx expo start
```
Scan the QR code with Expo Go on your phone.

### Demo credentials
Email:    demo@music.com
Password: password123

---

## 🏗️ Project Structure
src/
├── screens/          # One file per screen (Login, Home, Player, Artist, Favorites) 

├── components/       # Reusable UI (TrackCard, MiniPlayer)

├── context/          # Global state (PlayerContext, FavoritesContext)

├── data/             # Mock tracks and artists (mockData.js)

├── navigation/       # Stack + Tab navigator config

└── services/         # Storage logic (favoritesService.js)

---

## 🧠 Key Decisions & Tradeoffs

### Expo over bare React Native
Expo dramatically reduces setup time and provides `expo-av` for reliable
audio playback out of the box. The tradeoff is slightly less native
control, which is acceptable for this scope.

### Context API over Redux
The app has two shared states (player + favorites). Context API is
sufficient here — Redux would be over engineering for this scale.

### Mock JSON over real API
Keeps the focus on app architecture and UI quality. The data layer is
fully abstracted in `src/data/mockData.js`, making it easy to swap in
a real API later.

### AsyncStorage for persistence
Simple key-value storage fits the use case perfectly (favorites list +
session token + last track). No need for SQLite or a remote DB.

### Single audio instance via useRef
The sound object lives in a ref inside PlayerContext so it persists
across renders without causing re-renders itself. This ensures only
one track ever plays at a time.


I used royalty-free placeholder audio to demonstrate playback — in production this would integrate with a licensed music API like Deezer.
---

## 📦 Libraries Used

| Library | Purpose |
|--------|---------|
| `expo-av` | Audio playback |
| `@react-navigation/native` | Screen navigation |
| `@react-native-async-storage/async-storage` | Local persistence |
| `@react-native-community/slider` | Progress/seek bar |

---

## 🎥 Video Walkthrough

---

## 📥 Download APK
(https://expo.dev/accounts/shravani_2906/projects/MusicApp/builds/c9e91203-661c-4661-b4ed-923e2aba094a)
