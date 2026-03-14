import { useRef, useEffect, useCallback, useState } from 'react';
import { useMusic } from '../../hooks/useApi';
import type { MusicConfig } from '../../services/types';

const MAX_RETRIES = 20;
const RETRY_BASE_MS = 1000;

/**
 * Attempts to unlock the Web Audio context by playing a silent buffer.
 * Some browsers/TV devices allow audio after this trick.
 */
function unlockAudioContext(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }
      const ctx = new AudioCtx();
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      // Resume in case it's suspended
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => resolve()).catch(() => resolve());
      } else {
        resolve();
      }
    } catch {
      resolve();
    }
  });
}

/**
 * Hidden audio player for background music.
 * Uses silent AudioContext trick + exponential retry to bypass
 * browser autoplay restrictions on lobby TV displays.
 * Supports local MP3 files, web radio streams, custom stream URLs.
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { data: config } = useMusic();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getAudioSource = useCallback(
    (musicConfig: MusicConfig, trackIndex: number): string | null => {
      if (!musicConfig.enabled) return null;

      switch (musicConfig.source) {
        case 'radio':
          return musicConfig.radioStation?.url ?? null;
        case 'custom':
          return musicConfig.customStreamUrl ?? null;
        case 'local': {
          const playlist = musicConfig.localPlaylist ?? [];
          if (playlist.length === 0) return null;
          const idx = trackIndex % playlist.length;
          const track = playlist[idx];
          return `/api/music/stream/${track.filename}`;
        }
        default:
          return null;
      }
    },
    [],
  );

  // Attempt to play with retry logic
  const attemptPlay = useCallback((audio: HTMLAudioElement) => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        retryCountRef.current = 0;
      })
      .catch((err) => {
        setIsPlaying(false);
        if (retryCountRef.current < MAX_RETRIES) {
          const delay = Math.min(
            RETRY_BASE_MS * Math.pow(1.5, retryCountRef.current),
            30_000,
          );
          retryCountRef.current += 1;
          console.info(
            `[MusicPlayer] Autoplay blocked, retry ${retryCountRef.current}/${MAX_RETRIES} in ${Math.round(delay)}ms: ${err.message}`,
          );
          retryTimerRef.current = setTimeout(() => attemptPlay(audio), delay);
        } else {
          console.warn('[MusicPlayer] Autoplay failed after max retries');
        }
      });
  }, []);

  // Set volume when config changes
  useEffect(() => {
    if (audioRef.current && config) {
      audioRef.current.volume = Math.min(100, Math.max(0, config.volume)) / 100;
    }
  }, [config?.volume, config]);

  // Try to unlock audio context once on mount
  useEffect(() => {
    unlockAudioContext();
  }, []);

  // Set source and play
  useEffect(() => {
    if (!audioRef.current || !config) return;
    if (!config.enabled) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    const src = getAudioSource(config, currentTrackIndex);
    if (!src) return;

    const audio = audioRef.current;
    if (audio.src !== src) {
      audio.src = src;
    }

    if (config.autoplay) {
      retryCountRef.current = 0;
      attemptPlay(audio);
    }

    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [config, currentTrackIndex, getAudioSource, attemptPlay]);

  // Also try to play on any user interaction (click / touch anywhere)
  useEffect(() => {
    if (isPlaying) return;

    const handleInteraction = () => {
      if (audioRef.current && config?.enabled && config?.autoplay) {
        attemptPlay(audioRef.current);
      }
    };

    window.addEventListener('click', handleInteraction, { once: true, capture: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, capture: true });
    window.addEventListener('keydown', handleInteraction, { once: true, capture: true });

    return () => {
      window.removeEventListener('click', handleInteraction, true);
      window.removeEventListener('touchstart', handleInteraction, true);
      window.removeEventListener('keydown', handleInteraction, true);
    };
  }, [isPlaying, config, attemptPlay]);

  const handleTrackEnded = useCallback(() => {
    if (!config || config.source !== 'local') return;

    const playlist = config.localPlaylist ?? [];
    if (playlist.length === 0) return;

    if (config.shuffle) {
      const nextIdx = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(nextIdx);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    }
  }, [config]);

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={handleTrackEnded}
        preload="auto"
        className="hidden"
      />
      {/* Small floating indicator */}
      {isPlaying && (
        <div className="fixed bottom-20 left-4 z-50 glass-dark rounded-full px-4 py-2 flex items-center gap-2">
          <span className="animate-pulse-soft text-lg">🎵</span>
          <span className="text-white/70 text-sm">
            {config?.source === 'radio' ? config.radioStation?.name : 'Playing'}
          </span>
        </div>
      )}
    </>
  );
}
