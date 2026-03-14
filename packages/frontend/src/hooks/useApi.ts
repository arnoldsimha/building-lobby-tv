import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type {
  Message,
  ShabbatResponse,
  ShabbatUpcomingResponse,
  NewsResponse,
  NewsSource,
  WallpaperConfig,
  UnsplashPhoto,
  PictureConfig,
  MusicConfig,
  Settings,
} from '../services/types';

// --- Messages ---

export function useMessages() {
  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data } = await api.get<Message[]>('/messages');
      return data;
    },
    refetchInterval: 60_000, // Refresh every 60 seconds
  });
}

// --- Shabbat Times ---

export function useShabbatTimes() {
  return useQuery<ShabbatResponse>({
    queryKey: ['shabbat'],
    queryFn: async () => {
      const { data } = await api.get<ShabbatResponse>('/shabbat');
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour stale time
    refetchInterval: 1000 * 60 * 60 * 24, // Refetch daily
    retry: 2, // Retry twice before giving up
    retryDelay: 5000, // Wait 5s between retries
  });
}

export function useShabbatUpcoming() {
  return useQuery<ShabbatUpcomingResponse>({
    queryKey: ['shabbat', 'upcoming'],
    queryFn: async () => {
      const { data } = await api.get<ShabbatUpcomingResponse>('/shabbat/upcoming');
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// --- News ---

export function useNews() {
  return useQuery<NewsResponse>({
    queryKey: ['news'],
    queryFn: async () => {
      const { data } = await api.get<NewsResponse>('/news');
      return data;
    },
    refetchInterval: 1000 * 60 * 15, // Refresh every 15 minutes
  });
}

export function useNewsSources() {
  return useQuery<NewsSource[]>({
    queryKey: ['news', 'sources'],
    queryFn: async () => {
      const { data } = await api.get<NewsSource[]>('/news/sources');
      return data;
    },
  });
}

// --- Wallpapers ---

export function useWallpapers() {
  return useQuery<WallpaperConfig>({
    queryKey: ['wallpapers'],
    queryFn: async () => {
      const { data } = await api.get<WallpaperConfig>('/wallpapers');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUnsplashPhotos(enabled: boolean) {
  return useQuery<UnsplashPhoto[]>({
    queryKey: ['wallpapers', 'unsplash'],
    queryFn: async () => {
      const { data } = await api.get<UnsplashPhoto[]>('/wallpapers/unsplash');
      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });
}

// --- Pictures (center display - holidays/celebrations) ---

export function usePictures() {
  return useQuery<PictureConfig>({
    queryKey: ['pictures'],
    queryFn: async () => {
      const { data } = await api.get<PictureConfig>('/pictures');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// --- Music ---

export function useMusic() {
  return useQuery<MusicConfig>({
    queryKey: ['music'],
    queryFn: async () => {
      const { data } = await api.get<MusicConfig>('/music');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// --- Settings ---

export function useSettings() {
  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get<Settings>('/settings');
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
