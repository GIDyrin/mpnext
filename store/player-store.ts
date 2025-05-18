import { create } from 'zustand';
import { Track } from '@/lib/models';
import Hls from 'hls.js';
import { api, baseErrorHandler } from '@/lib/api';
import { useShallow } from 'zustand/shallow';

type PlayerState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
};

type PlayerActions = {
  play: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  cleanup: () => void;
};

// SINGLETON AD
class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private hls: Hls | null = null;
  private updateProgress: ((progress: number) => void) | null = null;
  private updateIsPlaying: ((isPlaying: boolean) => void) | null = null;
  private currentVolume = 1;
  private onTimeUpdate: ((progress: number) => void) | null = null;

  private constructor() {
    this.audio = typeof window !== 'undefined' ? new Audio() : null;
    if (this.audio) {
      this.audio.volume = this.currentVolume;
    }
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  initializeHls(url: string, track: Track, handleProgress: (progress: number) => void) {
    this.cleanup();
    
    if (!this.audio) return;
    
    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(url);
      this.hls.attachMedia(this.audio);
      
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.audio?.play().then(() => {
          this.updateIsPlaying?.(true);
        });
      });
    } else if (this.audio.canPlayType('application/vnd.apple.mpegurl')) {
      this.audio.src = url;
      this.audio.play().then(() => {
        this.updateIsPlaying?.(true);
      });
    }

    this.onTimeUpdate = handleProgress;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.audio) return;

    const handleTimeUpdate = () => {
      if (this.audio && this.audio.duration) {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.updateProgress?.(progress);
        this.onTimeUpdate?.(progress);
      }
    };

    this.audio.addEventListener('timeupdate', handleTimeUpdate);
    this.audio.addEventListener('play', () => this.updateIsPlaying?.(true));
    this.audio.addEventListener('pause', () => this.updateIsPlaying?.(false));
  }

  togglePlay() {
    if (!this.audio) return;
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  setVolume(volume: number) {
    this.currentVolume = volume;
    if (this.audio) {
      this.audio.volume = volume;
    }
  }

  setProgress(progress: number) {
    if (!this.audio || !this.audio.duration) return;
    this.audio.currentTime = (progress / 100) * this.audio.duration;
  }

  registerCallbacks(
    updateProgress: (progress: number) => void,
    updateIsPlaying: (isPlaying: boolean) => void
  ) {
    this.updateProgress = updateProgress;
    this.updateIsPlaying = updateIsPlaying;
  }

  cleanup() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    }
    this.updateProgress = null;
    this.updateIsPlaying = null;
  }
}

const usePlayerStore = create<PlayerState & { actions: PlayerActions }>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  progress: 0,

  actions: {
    play: async (track) => {
      try {
        const response = await api.get(`/tracks/${track.id}/hls/`);
        const audioManager = AudioManager.getInstance();
        audioManager.registerCallbacks(
          (progress) => set({ progress }),
          (isPlaying) => set({ isPlaying })
        );
        audioManager.initializeHls(response.data.hls_url, track, (newProgress: number) => {set( (state: PlayerState) => ({progress: newProgress}))});
        set({ currentTrack: track });
      } catch (error) {
        baseErrorHandler(error);
      }
    },

    togglePlay: () => {
      const audioManager = AudioManager.getInstance();
      audioManager.togglePlay();
      set( (state: PlayerState) => ({isPlaying: !state.isPlaying}))
    },

    setVolume: (volume) => {
      const audioManager = AudioManager.getInstance();
      audioManager.setVolume(volume);
      set({ volume });
    },

    setProgress: (progress) => {
      const audioManager = AudioManager.getInstance();
      audioManager.setProgress(progress);
      set({progress});
    },

    cleanup: () => {
      const audioManager = AudioManager.getInstance();
      audioManager.cleanup();
      set({ currentTrack: null, isPlaying: false, progress: 0 });
    }
  }
}));

export const usePlayer = () => 
  usePlayerStore(useShallow( (state: PlayerState) => ({
    currentTrack: state.currentTrack,
    isPlaying: state.isPlaying,
    volume: state.volume,
    progress: state.progress
  })));

export const usePlayerActions = () => usePlayerStore(state => state.actions);