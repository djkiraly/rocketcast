# @rocketcast/mobile

Expo (SDK 58) + React Native app for scoring and camera. It runs in an Expo **dev client**
(a custom native build), **not Expo Go**: the streaming modules (M02) are native code that
Expo Go cannot load.

The display name, bundle ID (`com.rocketcore.rocketcast`) and URL scheme are not written here;
`app.config.ts` reads them from `packages/config/src/brand.ts` (ADR-013).

## Prerequisites

- Node 26 and pnpm 10 (see repo root `README.md`); `pnpm install` run once at the repo root.
- iOS: macOS with Xcode (plus Command Line Tools and an iOS Simulator runtime) and CocoaPods.
- Android: Android Studio with an SDK, platform tools, and a running emulator (AVD).
  `ANDROID_HOME` must be set and `adb` on `PATH`.

## First run (per machine)

Generate the native projects, build the dev client, then start the bundler.
`ios/` and `android/` are gitignored; regenerate them any time with `prebuild`.

```bash
# from the repo root
pnpm --filter @rocketcast/mobile prebuild   # writes apps/mobile/ios and apps/mobile/android

# iOS simulator (macOS only)
pnpm --filter @rocketcast/mobile ios        # expo run:ios -> builds + installs the dev client

# Android emulator (start an AVD first)
pnpm --filter @rocketcast/mobile android    # expo run:android -> builds + installs the dev client
```

`expo run:*` builds the dev client, installs it on the simulator/emulator, and starts Metro.

## Daily development

Once a dev client is installed, you only need the bundler:

```bash
pnpm --filter @rocketcast/mobile start      # expo start --dev-client
```

Press `i` (iOS) or `a` (Android) in the terminal, or open the dev client and pick the server.
Rebuild with `ios` / `android` only after changing native dependencies or `app.config.ts`.

## Checks

```bash
pnpm --filter @rocketcast/mobile lint
pnpm --filter @rocketcast/mobile typecheck
pnpm --filter @rocketcast/mobile test       # Vitest, pure TS only (src/**/*.test.ts)
```

## Environment

Copy `.env.example` to `.env`. Only `EXPO_PUBLIC_*` variables reach the app bundle.

## Notes

- `metro.config.js` watches the workspace root and resolves from both the app's and the root
  `node_modules` (`.npmrc` uses `node-linker=hoisted`).
- `app.config.ts` imports `@rocketcast/config/brand` (a `.ts` file); Expo evaluates it with
  Node's built-in TypeScript type stripping, hence the Node 26 requirement.
- No in-app purchase code lives here (CLAUDE.md hard rule).
