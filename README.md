# Home Display

A full-screen TV display application for building lobbies. Shows building messages, Shabbat enter/exit times, Israeli news headlines, rotating wallpapers, and plays ad-free background music. Designed for 1080p landscape displays with full RTL/Hebrew support and a light-colored theme.

## Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9 (ships with Node.js 18+)

## Quick Start

```bash
# 1. Install all dependencies (backend + frontend)
npm install

# 2. Start both backend and frontend in development mode
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
home-display/
├── package.json              # npm workspaces root
├── packages/
│   ├── backend/              # NestJS REST API (TypeScript)
│   │   ├── src/
│   │   │   ├── messages/     # Building messages CRUD
│   │   │   ├── shabbat/      # Shabbat times via HebCal API
│   │   │   ├── news/         # Israeli news RSS parsing
│   │   │   ├── wallpapers/   # Wallpaper management
│   │   │   ├── music/        # Ad-free music config
│   │   │   ├── settings/     # App settings
│   │   │   └── common/       # Shared interfaces, filters, repositories
│   │   └── data/             # JSON file storage + wallpaper images
│   └── frontend/             # React 18 + Vite + Tailwind CSS
│       └── src/
│           ├── components/
│           │   ├── layout/   # DisplayScreen, TopBar, SidePanel, BottomTicker
│           │   ├── widgets/  # Clock, Shabbat, Messages, News, Music
│           │   └── common/   # GlassPanel, FadeTransition, LoadingSpinner
│           ├── hooks/        # useApi, custom React hooks
│           ├── services/     # API client layer
│           └── i18n/         # Hebrew + English translations
└── plans/
    └── architecture.md       # Full architectural specification
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| Backend | NestJS + TypeScript |
| Data Storage | JSON files (Repository Pattern → DynamoDB later) |
| State Management | TanStack React Query |
| Music | HTML5 Audio — local MP3 files + web radio streams (ad-free) |
| Shabbat Times | HebCal REST API |
| News | RSS feed parsing (Ynet, Walla, Maariv) |
| i18n | i18next + react-i18next |
| Monorepo | npm workspaces |

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/messages` | Building messages |
| `GET /api/shabbat` | This week's Shabbat times |
| `GET /api/news` | News headlines from active RSS source |
| `GET /api/wallpapers` | Wallpaper configuration |
| `GET /api/wallpapers/images/:filename` | Serve wallpaper image |
| `GET /api/music` | Music configuration |
| `GET /api/settings` | App settings |

## License

UNLICENSED — Private project.
