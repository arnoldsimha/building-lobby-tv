# Building Lobby TV Display

A full-screen TV display application for building lobbies. Shows building messages, Shabbat enter/exit times, Israeli news headlines, rotating wallpapers, picture galleries, and plays ad-free background music. Designed for 1080p landscape displays with full RTL/Hebrew support and a light-colored theme.

## Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9 (ships with Node.js 18+)

## Quick Start

```bash
# 1. Install all dependencies (backend + frontend)
npm install

# 2. Copy and configure environment files
cp packages/backend/.env.example packages/backend/.env

# 3. Start both backend and frontend in development mode
npm run dev
```

- **Backend** → http://localhost:3001
- **Frontend** → http://localhost:3000

## Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all workspace dependencies |
| `npm run dev` | Start backend and frontend concurrently |
| `npm run dev:backend` | Start only the NestJS backend (watch mode) |
| `npm run dev:frontend` | Start only the Vite frontend dev server |
| `npm run build` | Build both backend and frontend for production |
| `npm run build:backend` | Build only the backend |
| `npm run build:frontend` | Build only the frontend |
| `npm run start` | Start the backend in production mode (serves built frontend) |

## Architecture Overview

```
building-lobby-tv/
├── package.json              # npm workspaces root
├── LICENSE                   # MIT License
├── packages/
│   ├── backend/              # NestJS REST API (TypeScript)
│   │   ├── src/
│   │   │   ├── main.ts               # Port 3001, /api prefix, CORS
│   │   │   ├── app.module.ts         # Root module importing all features
│   │   │   ├── messages/             # Building messages CRUD
│   │   │   ├── shabbat/              # Shabbat times via HebCal API
│   │   │   ├── news/                 # Israeli news RSS parsing
│   │   │   ├── wallpapers/           # Wallpaper management + image serving
│   │   │   ├── pictures/             # Picture gallery configuration
│   │   │   ├── music/                # Ad-free music config (radio + local MP3)
│   │   │   ├── settings/             # App settings
│   │   │   └── common/               # Shared interfaces, filters, repositories
│   │   │       ├── interfaces/       # Repository interfaces (IRepository<T>)
│   │   │       ├── repositories/     # JSON file repository implementations
│   │   │       └── filters/          # HTTP exception filter
│   │   └── data/                     # JSON file storage + wallpaper images
│   │       ├── messages.json
│   │       ├── settings.json
│   │       ├── music.json
│   │       ├── pictures.json
│   │       ├── wallpapers.json
│   │       └── wallpapers/           # Wallpaper image files
│   └── frontend/             # React 18 + Vite + Tailwind CSS
│       └── src/
│           ├── App.tsx
│           ├── main.tsx
│           ├── index.css             # Tailwind directives + scroll-rtl animation
│           ├── components/
│           │   ├── layout/           # DisplayScreen, TopBar, SidePanel, BottomTicker
│           │   │   ├── DisplayScreen.tsx     # Main container with 3-column grid
│           │   │   ├── WallpaperLayer.tsx    # Full-screen background layer
│           │   │   ├── TopBar.tsx            # Building header
│           │   │   ├── LeftPanel.tsx         # Left column: Clock + Shabbat
│           │   │   ├── CenterPanel.tsx       # Center column: Wallpaper slider
│           │   │   ├── RightPanel.tsx        # Right column: Messages
│           │   │   ├── BottomTicker.tsx      # News scrolling bar
│           │   │   └── SidePanel.tsx         # Reusable side panel
│           │   ├── widgets/          # Clock, Shabbat, Messages, News, Music, Wallpaper
│           │   │   ├── BuildingHeader.tsx    # Building name and logo
│           │   │   ├── ClockWidget.tsx       # Time + Hebrew date via @hebcal/core
│           │   │   ├── ShabbatWidget.tsx     # Candle lighting times
│           │   │   ├── MessagesWidget.tsx    # Rotating building messages
│           │   │   ├── NewsTicker.tsx        # Scrolling news headlines (80s RTL)
│           │   │   ├── WallpaperWidget.tsx   # Wallpaper display with crossfade
│           │   │   └── MusicPlayer.tsx       # Hidden HTML5 audio player
│           │   └── common/           # GlassPanel, FadeTransition, LoadingSpinner
│           │       ├── WidgetBox.tsx          # Reusable widget container with title
│           │       ├── GlassPanel.tsx         # Semi-transparent panel
│           │       ├── FadeTransition.tsx     # Crossfade animation wrapper
│           │       └── LoadingSpinner.tsx
│           ├── hooks/
│           │   └── useApi.ts         # React Query hooks for all API endpoints
│           ├── services/
│           │   ├── api.ts            # Axios API client configuration
│           │   └── types.ts          # TypeScript type definitions
│           └── i18n/
│               ├── index.ts          # i18next configuration
│               ├── he.json           # Hebrew translations
│               └── en.json           # English translations
└── plans/
    └── architecture.md       # Full architectural specification
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| Backend | NestJS + TypeScript |
| Data Storage | JSON files (Repository Pattern → DynamoDB later) |
| State Management | TanStack React Query |
| Music | HTML5 Audio — local MP3 files + web radio streams (ad-free) |
| Shabbat Times | HebCal REST API |
| News | RSS feed parsing (Ynet, Walla, Maariv) via `rss-parser` |
| i18n | i18next + react-i18next |
| Hebrew Calendar | @hebcal/core |
| Monorepo | npm workspaces |

## API Endpoints

All endpoints are prefixed with `/api`.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/messages` | GET | Building messages |
| `/api/shabbat` | GET | This week's Shabbat times (HebCal, cached 24h) |
| `/api/news` | GET | News headlines from active RSS source (cached 15min) |
| `/api/wallpapers` | GET | Wallpaper configuration |
| `/api/wallpapers/images/:filename` | GET | Serve wallpaper image file |
| `/api/pictures` | GET | Picture gallery configuration |
| `/api/pictures` | PUT | Update picture gallery configuration |
| `/api/music` | GET | Music configuration |
| `/api/settings` | GET | App settings |

## Display Layout

The display uses a **3-column layout** with a full-screen wallpaper background and light-colored semi-transparent widget boxes:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ┌────────────────────┐                           │
│                    │  🏠 Building Name  │                           │
│                    └────────────────────┘                           │
│  ┌──────────────┐  ┌────────────────────┐  ┌────────────────────┐  │
│  │ 🕐 Clock     │  │                    │  │ 📋 Messages        │  │
│  │   14:30      │  │  🖼️ Wallpaper      │  │  • Message 1       │  │
│  │  Wednesday   │  │     Slider         │  │  • Message 2       │  │
│  │  11 March    │  │  (Center Panel)    │  │  • Message 3       │  │
│  └──────────────┘  │                    │  │                    │  │
│  ┌──────────────┐  │                    │  │                    │  │
│  │ 🕯️ Shabbat   │  │                    │  │                    │  │
│  │ In:  17:15   │  │                    │  │                    │  │
│  │ Out: 18:20   │  └────────────────────┘  └────────────────────┘  │
│  └──────────────┘                                                   │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📰 News ◄ Headline 1 | Headline 2 | Headline 3                │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
           🎵 Hidden Music Player - Background Audio
```

## Key Features

- **RTL/Hebrew support** — Full right-to-left layout with Hebrew translations
- **Light theme** — High contrast panels for TV readability (WCAG AA compliant)
- **Ad-free music** — Web radio streams (Galgalatz, 88FM, Eco99FM, etc.) or local MP3 files via HTML5 Audio
- **Shabbat times** — Automatic candle lighting and havdalah times via HebCal API with 24h cache
- **News ticker** — Scrolling RTL headlines from configurable Israeli RSS feeds (Ynet, Walla, Maariv)
- **Wallpaper rotation** — Crossfade transitions with configurable intervals
- **Message rotation** — Building messages rotate every 10 seconds
- **Repository pattern** — JSON file storage with clean migration path to DynamoDB
- **Error boundaries** — Individual widget failures don't crash the whole display

## Configuration

### Environment Variables

Copy `packages/backend/.env.example` to `packages/backend/.env` and configure as needed.

### Data Files

All configuration data is stored as JSON files in `packages/backend/data/`:

| File | Purpose |
|------|---------|
| `messages.json` | Building messages |
| `settings.json` | App settings (building name, news source, display intervals) |
| `music.json` | Music configuration (source, volume, radio station) |
| `wallpapers.json` | Wallpaper configuration and rotation settings |
| `pictures.json` | Picture gallery configuration |

### Wallpaper Images

Place wallpaper image files in `packages/backend/data/wallpapers/`. Supported formats: JPG, PNG.

## Roadmap

- [x] **Phase 1: Core Display** — Project scaffolding, all API modules, 3-column display, RTL support, music, wallpapers, news ticker
- [ ] **Phase 2: Polish** — Admin panel, DynamoDB migration, weather widget, animations
- [ ] **Phase 3: Packaging** — Android APK via Capacitor, kiosk mode, auto-start on boot

## License

This project is licensed under the [MIT License](LICENSE).
