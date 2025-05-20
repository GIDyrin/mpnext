import { create } from 'zustand';
import { Playlist, PlaylistDetailed, Track } from '@/lib/models';
import Hls from 'hls.js';
import { api, baseErrorHandler } from '@/lib/api';
import { useShallow } from 'zustand/shallow';

export type PlaylistContext = {
  playlist: PlaylistDetailed;
  nowPlayingIndex: number; 
}


type PlayerState = {
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  playlistContext: PlaylistContext | null;
};

type PlayerActions = {
  play: (track: Track, playlistContext?: PlaylistContext) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  cleanup: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  getCurrentIndex: () => number;
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
  private onEnded: (() => void) | null = null;

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
    this.audio.addEventListener('ended', () => {
      this.onEnded?.();
    });
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
    updateIsPlaying: (isPlaying: boolean) => void,
    onEnded: () => void
  ) {
    this.updateProgress = updateProgress;
    this.updateIsPlaying = updateIsPlaying;
    this.onEnded = onEnded;
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

const usePlayerStore = create<PlayerState & { actions: PlayerActions }>((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  volume: 1,
  progress: 0,
  playlistContext: null,

  actions: {
    play: async (track, playlistContext) => {
      try {
        const response = await api.get(`/tracks/${track.id}/hls/`);
        const audioManager = AudioManager.getInstance();

        audioManager.registerCallbacks(
          (progress) => set({ progress }),
          (isPlaying) => set({ isPlaying }),
          () => get().actions.nextTrack()
        );

        audioManager.initializeHls(response.data.hls_url, track, (p) => set({ progress: p }));

        set({
          queue: playlistContext?.playlist.tracks || [track],
          currentIndex: playlistContext?.nowPlayingIndex || 0,
          playlistContext: playlistContext || null,
          isPlaying: true
        });

      } catch (error) {
        baseErrorHandler(error);
      }
    },

    togglePlay: () => {
      const audioManager = AudioManager.getInstance();
      audioManager.togglePlay();
      set(state => ({ isPlaying: !state.isPlaying }));
    },

    setVolume: (volume) => {
      const audioManager = AudioManager.getInstance();
      audioManager.setVolume(volume);
      set({ volume });
    },

    setProgress: (progress) => {
      const audioManager = AudioManager.getInstance();
      audioManager.setProgress(progress);
      set({ progress });
    },

    nextTrack: () => {
      const { queue, currentIndex, playlistContext } = get();
      if (currentIndex < queue.length - 1) {
        const newIndex = currentIndex + 1;
        const nextTrack = queue[newIndex];
        
        set({ currentIndex: newIndex });
        get().actions.play(nextTrack, 
          playlistContext 
            ? { ...playlistContext, nowPlayingIndex: newIndex } 
            : undefined
        );
      } else {
        get().actions.cleanup();
      }
    },

    previousTrack: () => {
      const { queue, currentIndex, playlistContext } = get();
      if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        const prevTrack = queue[newIndex];
        
        set({ currentIndex: newIndex });
        get().actions.play(prevTrack, 
          playlistContext 
            ? { ...playlistContext, nowPlayingIndex: newIndex } 
            : undefined
        );
      }
    },

    cleanup: () => {
      const audioManager = AudioManager.getInstance();
      audioManager.cleanup();
      set({ 
        queue: [],
        currentIndex: -1,
        playlistContext: null,
        isPlaying: false, 
        progress: 0 
      });
    },

  getCurrentIndex: () => get().currentIndex
  }
}));

export const usePlayer = () => 
  usePlayerStore(useShallow((state) => ({
    isPlaying: state.isPlaying,
    volume: state.volume,
    progress: state.progress,
    queue: state.queue,
    currentIndex: state.currentIndex,
    playlistContext: state.playlistContext
  })));

export const usePlayerActions = () => usePlayerStore(state => state.actions);