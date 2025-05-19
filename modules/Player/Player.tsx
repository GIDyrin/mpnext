import { useEffect } from 'react';
import { usePlayer, usePlayerActions } from '@/store';
import { PauseIcon, PlayIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

export const Player = () => {
  const { currentTrack, isPlaying, progress, volume } = usePlayer();
  const { togglePlay, setVolume, setProgress, cleanup } = usePlayerActions();

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]); // Добавлена зависимость

  if (!currentTrack) return null;
  

  return (
    <div className="fixed bottom-2/6 left-0 right-0 bg-gray-800 border-t border-gray-700 rounded-2xl">
      <div className="mx-auto px-4 py-2">
        {/* Прогресс-бар */}
        <div 
          className="relative h-1 bg-gray-600 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            setProgress(Math.min(Math.max(percentage, 0), 100));
          }}>
          <div 
            className="absolute h-full bg-green-500 transition-all duration-200" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-4 mt-2">
          {/* Информация о треке */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{currentTrack.title}</h3>
            <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
          </div>

          {/* Кнопка управления */}
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
          >
            {!isPlaying ? (
              <PauseIcon className="w-5 h-5 text-white" />
            ) : (
              <PlayIcon className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Регулятор громкости */}
          <div className="flex items-center gap-2 w-32">
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
    </div>
  );
};