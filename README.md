# AniApp

A personal anime-watching app for iOS — React Native + TypeScript, built on the
[`ani-cli`](https://github.com/pystardust/ani-cli) allanime scraper ported to TypeScript.

> **Personal use only.** AniApp streams from allanime, an unlicensed source. It is
> sideloaded for personal use and is **not** distributed on the App Store.

## Features

- **Home** — a cinematic hero (top trending show), a Trending grid, and a Recently
  Updated carousel
- **Search** — search the allanime catalogue
- **Anime info screen** — banner, synopsis, genres, rating, and the full episode grid
- **Player** — VLC-based playback (broad codec support) with custom controls: skip
  ±5s, pause, a draggable seek bar, and a source switcher
- **Continue Watching** — local watch history; resumes each episode at the saved spot
- **Library** — save shows to a personal watchlist

## Tech stack

- React Native 0.85 · React 19 · TypeScript — New Architecture enabled
- React Navigation — native-stack + bottom-tabs
- `react-native-vlc-media-player` — video playback
- `@react-native-async-storage/async-storage` — watch history & watchlist
- `react-native-linear-gradient`, `@react-native-community/blur` — UI
- `crypto-js` — provider source-ID decoding

## Project structure

```
src/
├── scraper/      allanime GraphQL client — search, episodes, sources, discovery
├── screens/      Home · Search · Episodes (anime info) · Player · Library
├── components/   AnimeCard · Button · ContinueCard · GenreChip · Icon · ProgressBar
├── storage/      AsyncStorage layer — watch history + watchlist
├── theme/        "Cinematic Pulse" design tokens (see DESIGN.md)
└── navigation.ts route param types
```

Fonts (Inter, Montserrat) and the IcoMoon icon font live in `src/assets/` and are
linked natively via `react-native-asset`.

## Getting started

**Prerequisites:** Node ≥ 22.11, Xcode, Ruby + Bundler, CocoaPods.

```sh
yarn install                       # JS dependencies
bundle install                     # CocoaPods (first time only)
bundle exec pod install --project-directory=ios
```

### Run in development

```sh
yarn start                         # Metro
yarn ios                           # build + run on a connected device/simulator
yarn ios:simulator                 # force the iPhone 17 Pro simulator
```

### Run a release build (sideload to a device)

```sh
yarn ios:release                   # Release build, installed to the configured device
```

A release build embeds the JS bundle and runs standalone — no Metro needed.
First, set a signing **Team** on the `AniApp` target in `ios/AniApp.xcworkspace`.

> Signing expiry: a free Apple ID profile lasts **7 days** (rebuild weekly); a paid
> Apple Developer account lasts **1 year**. `yarn ios:release` targets a specific
> device UDID — update it in `package.json` if you switch phones.

## Notes & known issues

- **iOS-first.** Android wiring exists but is untested.
- **Player teardown.** `react-native-vlc-media-player` can hang if its native view
  is destroyed alongside the screen; the Player unmounts the VLC view on blur to
  avoid this.
- **`fastSearch` is unused** — that allanime endpoint is broken upstream, so search
  uses the standard `shows` query.

## Related docs

- `DESIGN.md` — the "Cinematic Pulse" design system
- `roadmap.html` — milestones and progress
- `api-reference.html` — allanime GraphQL API reference
