# 🎵 Musify — Mini Music App

A React Native music app built with Expo.

---

## 📱 Features

### Core
- **Mock Login** — Email/password auth with validation and loading state
- **Home Feed** — Artist cards (horizontal scroll) + full track list with search
- **Music Player** — Play/pause, seek, next/previous track, progress bar
- **Artist Profile** — Hero image, bio, follower count, artist's top tracks

### Bonus
- **Favorites System** — Heart any track; persisted locally via AsyncStorage
- **Session Resume** — Restores login state and last played track on app reopen
- **Real Bollywood Music** — Integrated Deezer API via RapidAPI for real trending tracks

---

##  Getting Started

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
```
Email:    demo@music.com
Password: password123
```

---

##  Project Structure

```
src/
├── screens/          # One file per screen (Login, Home, Player, Artist, Favorites)
├── components/       # Reusable UI (TrackCard, MiniPlayer)
├── context/          # Global state (PlayerContext, FavoritesContext)
├── data/             # Mock tracks and artists fallback (mockData.js)
├── navigation/       # Stack + Tab navigator config
└── services/         # Audio, storage, and API logic (deezerService, favoritesService)
```

---

##  Key Decisions & Tradeoffs

### Expo over bare React Native
Expo dramatically reduces setup time and provides `expo-av` for reliable audio playback out of the box. The tradeoff is slightly less native control, which is acceptable for this scope.

### Context API over Redux
The app has two shared states (player + favorites). Context API is sufficient here Redux would be over engineering for this scale.

### Deezer API via RapidAPI for real music
Initially the app used royalt free placeholder audio (SoundHelix). To make the experience feel closer to a real product, I integrated the Deezer API via RapidAPI which provides 30-second previews of real, trending Bollywood tracks. See the full journey below.

### AsyncStorage for persistence
Simple key value storage fits the use case perfectly favorites list, session token, and last played track. No need for SQLite or a remote DB.

### Single audio instance via useRef
The sound object lives in a ref inside PlayerContext so it persists across renders without causing re-renders. This ensures only one track ever plays at a time.

### Parallel API queries for maximum track coverage
Deezer's preview availability varies by region. To maximize the number of playable tracks shown, 8 parallel search queries are fired simultaneously (by artist name and genre) and deduplicated before rendering.

---

## The Deezer Integration 

### Why I switched from placeholder audio
The initial version used SoundHelix random royalty free audio which worked technically but felt missing. A music app demo should feel like a music app. Since Spotify, Apple Music, and JioSaavn either require paid licenses or don't expose audio streaming via public APIs, I chose Deezer via RapidAPI which offers free 30 second track previews legally.

### Challenges faced and how I resolved them

**Challenge 1 — CORS proxy failures**
Direct calls to the Deezer API from a React Native app were blocked by CORS policies when routed through public proxies (`corsproxy.io`, `allorigins.win`). Both proxies silently failed, returning undefined data and causing `Cannot read property 'map' of undefined` errors.

*Resolution:* Switched to RapidAPI's hosted Deezer endpoint which handles CORS correctly and returns consistent JSON. Added nul safety checks (`data?.data`) throughout the service layer so any future failures degrade gracefully instead of crashing.

**Challenge 2 — Only 3 playable tracks in India**
Deezer restricts preview URLs by region. A single search query for "bollywood hits" returned 50 tracks but only 3 had valid preview URLs — the rest had `null` previews due to regional licensing.

*Resolution:* Fired 8 parallel search queries covering different artists and genres (`arijit singh`, `ar rahman`, `shreya ghoshal`, `neha kakkar`, etc.), flattened and deduplicated results by track ID, giving 100+ tracks with significantly more playable previews.

**Challenge 3 — ReferenceError from stale cached code**
After switching from the proxy approach to RapidAPI, Metro bundler cached the old file, causing `ReferenceError: Property 'RAPIDAPI_KEY' doesn't exist` even after saving the new file correctly.

*Resolution:* Ran `npx expo start --clear` to wipe Metro's cache. Also rewrote the service file from scratch (Ctrl+A, delete, paste fresh) to eliminate any invisible syntax issues from partial edits.

**Challenge 4 — Duplicate function from accidental edit**
When adding a debug log inside `loadHomeTracks()`, the entire function was accidentally duplicated inside itself, causing a Babel `SyntaxError: 'export' may only appear at the top level`.

*Resolution:* Identified the exact line from the error stack trace, did a full file rewrite rather than trying to surgically fix the nested code.

**Challenge 5 — Broken Git branch reference**(major headache)
After working across branches, the `refs/heads/feature/deezer-integration` reference became corrupted, causing `fatal: cannot lock ref 'HEAD': unable to resolve reference`. All normal Git commands (checkout, commit, push) failed.

*Resolution:* Created a fresh branch (`main-final`), re-cloned the remote repo to a clean directory, copied the working `src` folder back in, reinstalled dependencies, and pushed cleanly. No code was lost.

### Key learnings
- Always add null-safety checks when consuming external APIs never assume the shape of the response
- Metro's aggressive caching can hide file changes; `--clear` should be the first debug step for unexplained errors
- Regional API restrictions are a real world constraint; parallel queries are a practical workaround
- (IMPP) -> Git branch corruption is rare but recoverable the working tree is always safe even when refs break

---

##  Libraries Used

| Library | Purpose |
|---------|---------|
| `expo-av` | Audio playback |
| `@react-navigation/native` | Screen navigation |
| `@react-native-async-storage/async-storage` | Local persistence |
| `@react-native-community/slider` | Progress/seek bar |
| `RapidAPI Deezer` | Real Bollywood track search and 30s previews |

---

##  Video Walkthrough
[Link to video]

##  Download APK
https://expo.dev/accounts/shravani_2906/projects/MusicApp/builds/0ec7608e-fb63-4d70-8410-c14b7275465a
