# mis-mobile

Expo (React Native, TypeScript, Expo Router) app for MIS students and parents: login, attendance, and push notifications when a student's RFID card is scanned. Talks to [mis-backend](../mis-backend) at `EXPO_PUBLIC_API_URL`.

See `AGENTS.md` for Expo-specific rules (always `npx expo install`, versioned docs).

## Requirements

- Node 20.19+ / 22 LTS
- Push notifications need a development build (`npx expo run:android` or `eas build --profile development`) — they don't work in Expo Go on Android.

## Setup

```bash
npm install
cp .env.example .env   # set your PC's LAN IP
```

## Commands

| Task | Command |
|---|---|
| Dev server | `npx expo start` |
| Android | `npm run android` |
| Lint | `npx expo lint` |
| Typecheck | `npx tsc --noEmit` |
