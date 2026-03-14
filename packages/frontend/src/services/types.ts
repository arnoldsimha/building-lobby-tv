// ============================================================
// API Response Types - mirrors backend DTOs
// ============================================================

// --- Messages ---

export type MessageType = 'info' | 'warning' | 'urgent' | 'event';

export interface Message {
  id: string;
  title: string;
  content: string;
  type: MessageType;
  priority: number;
  active: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

// --- Shabbat Times ---

export interface ShabbatTimes {
  candleLighting: string;
  havdalah: string;
  parasha: string;
  parashaEnglish: string;
  date: string;
}

export interface ShabbatResponse {
  data: ShabbatTimes;
  cached: boolean;
  fetchedAt: string;
}

export interface ShabbatUpcomingResponse {
  data: ShabbatTimes[];
  cached: boolean;
  fetchedAt: string;
}

// --- News ---

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export interface NewsResponse {
  items: NewsItem[];
  source: string;
  fetchedAt: string;
}

export interface NewsSource {
  key: string;
  name: string;
  url: string;
  category: string;
}

// --- Wallpapers ---

export interface Wallpaper {
  id: string;
  filename: string;
  title: string;
  active: boolean;
}

export interface UnsplashSettings {
  query: string;
  count: number;
}

export interface UnsplashPhoto {
  id: string;
  url: string;
  author: string;
  description: string;
}

export interface WallpaperConfig {
  source: 'local' | 'unsplash';
  unsplash?: UnsplashSettings;
  wallpapers: Wallpaper[];
  rotationEnabled: boolean;
  rotationInterval: number;
}

// --- Pictures (center display - holidays/celebrations) ---

export interface Picture {
  id: string;
  url: string;
  title: string;
  active: boolean;
}

export interface PictureConfig {
  pictures: Picture[];
  rotationEnabled: boolean;
  rotationInterval: number;
}

// --- Music ---

export type MusicSource = 'local' | 'radio' | 'custom';

export interface LocalTrack {
  id: string;
  filename: string;
  title: string;
  artist: string;
}

export interface RadioStation {
  name: string;
  url: string;
}

export interface MusicConfig {
  enabled: boolean;
  volume: number;
  source: MusicSource;
  localPlaylist: LocalTrack[];
  radioStation: RadioStation;
  customStreamUrl: string | null;
  currentIndex: number;
  shuffle: boolean;
  autoplay: boolean;
}

// --- Settings ---

export interface Location {
  geonameid: number;
  city: string;
}

export interface NewsSettings {
  activeSource: string;
  refreshInterval: number;
}

export interface DisplaySettings {
  messageRotationInterval: number;
  wallpaperRotationInterval: number;
  shabbatCacheInterval: number;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  panelBackground: string;
  textColor: string;
}

export interface Settings {
  buildingName: string;
  buildingAddress: string;
  language: 'he' | 'en';
  location: Location;
  news: NewsSettings;
  display: DisplaySettings;
  theme: ThemeSettings;
}
