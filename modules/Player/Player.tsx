'use client'

import { useEffect, useState } from 'react';
import { usePlayer, usePlayerActions } from '@/store';
import { 
  PauseIcon, 
  PlayIcon, 
  SpeakerWaveIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ForwardIcon,
  BackwardIcon
} from '@heroicons/react/24/solid';
import { truncateText } from '@/lib/utils';

export const Player = () => {
  const { isPlaying, progress, volume, queue, currentIndex, playlistContext } = usePlayer();
  const { togglePlay, setVolume, setProgress, cleanup, nextTrack, previousTrack } = usePlayerActions();
  const [isMinimized, setIsMinimized] = useState(false);
  const [truncateLength, setTruncateLength] = useState(45);

  
  useEffect(() => {
    const updateTruncate = () => {
      const width = window.innerWidth;
      setTruncateLength(
        width < 375 ? 25 :
        width < 425 ? 30 : 45
      );
    };
    
    updateTruncate();
    window.addEventListener('resize', updateTruncate);
    return () => window.removeEventListener('resize', updateTruncate);
  }, []);

  const currentTrack = queue[currentIndex] || null;

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const handleClose = () => {
    cleanup();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };



  if (!currentTrack) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 rounded-t-2xl
      transition-all duration-300 ${isMinimized ? 'translate-y-[calc(100%-60px)]' : 'translate-y-0'}
      shadow-lg max-w-2xl mx-auto sm:bottom-4 sm:left-4 sm:right-auto sm:rounded-2xl`}>
      
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMinimize}
            className="p-1 text-gray-400 hover:text-white transition-colors">
            {isMinimized ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
          {currentTrack.title.length >= 30 ? (
            <div className='marquee'>
              <div className='marquee-inner pl-2.5'>
                <h3 className="text-sm font-medium">
                {currentTrack.title}
          </h3>
              </div>
            </div>
          ) : (
          <h3 className="text-sm font-medium truncate max-w-[160px] sm:max-w-none">
            {truncateText(currentTrack.title, 30)}
          </h3>
          )}

        </div>
        <button
          onClick={handleClose}
          className="p-1 text-gray-400 hover:text-white transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {!isMinimized && (
        <div className="p-4">
          {/* Progress bar */}
          <div 
            className="relative h-1 bg-gray-600 cursor-pointer mb-4"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percentage = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(Math.min(Math.max(percentage, 0), 100));
            }}>
            <div 
              className="absolute h-full bg-green-500 transition-all" 
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Main controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Track info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{truncateText(currentTrack.title, truncateLength)}</h3>
                <p className="text-gray-400 text-xs truncate">
                  {currentTrack.artist}
                  {playlistContext && ` • ${playlistContext.playlist.name}`}
                </p>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={previousTrack}
                  disabled={currentIndex === 0}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-30">
                  <BackwardIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors">
                  {isPlaying ? (
                    <PauseIcon className="w-5 h-5 text-white" />
                  ) : (
                    <PlayIcon className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  disabled={currentIndex === queue.length - 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-30">
                  <ForwardIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Volume control */}
            <div className="hidden sm:flex items-center gap-2 w-32">
              <SpeakerWaveIcon className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm 
                [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile volume control */}
      {!isMinimized && (
        <div className="sm:hidden p-4 pt-0">
          <div className="flex items-center gap-2">
            <SpeakerWaveIcon className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm 
              [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
              [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
