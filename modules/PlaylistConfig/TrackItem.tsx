import { TrashIcon, PlayIcon, EllipsisVerticalIcon, ArrowDownTrayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { usePlayer, usePlayerActions } from '@/store/player-store'
import { PlaylistDetailed, Track } from '@/lib/models';
import { formatDuration, truncateText } from "@/lib/utils"
import { useEffect, useState } from 'react';
import { downloadingService } from '@/lib/services';



type TrackItemProps = {
  track: Track;
  showDelete?: boolean;
  onDelete?: () => void;
  queueIndex : number;
  playlist : PlaylistDetailed;
};

export const TrackItem = ({ track, showDelete = false, onDelete, queueIndex, playlist }: TrackItemProps) => {
  const { play } = usePlayerActions();
  const { currentIndex, isPlaying, playlistContext } = usePlayer();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px - обычная брейкпоинт для мобильных, ну ниже планшетов короче
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => { // Добавлен TouchEvent
      const target = e.target as Element;
      if (!target.closest('.menu-container')) {
        setIsMenuOpen(false);
      }
    };

    // Добавляем оба обработчика для тач и кликов
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

    // Обработчики действий
  const handleDownload = () => {
    // Заглушка для скачивания
    downloadingService.downloadTrack(track.id, `${track.artist} - ${track.title}.mp3`);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete?.();
    setIsMenuOpen(false);
  };

  
  // Определяем активен ли текущий трек
  const isActive = playlistContext?.playlist.id === playlist.id 
    && currentIndex === queueIndex;

  return (
    <div className="group bg-gray-700 px-2.5 py-2 gap-1.5 rounded-lg flex items-center justify-between hover:bg-gray-600 transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={() => play(track, { playlist, nowPlayingIndex: queueIndex })}
          className="text-green-400 hover:text-green-300 p-1 rounded-md hover:bg-green-900/20 transition-colors"
          title="Play track"
        >
          {isActive && isPlaying ? (
            <PauseIcon className="w-4 h-4" />
          ) : (
            <PlayIcon className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate ">{truncateText(track.title, truncateLength)}</h3>
          <p className="text-gray-400 text-xs truncate">{track.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
      {isMobile ? (
             <div className="menu-container"> 
                <div className="flex gap-1 items-center min-w-[60px] relative">
                  <span className="text-gray-400 text-xs">
                    {formatDuration(track.duration)}
                  </span>

                  <button 
                    onTouchEnd={(e) => {
                      e.stopPropagation(); // Предотвращаем всплытие
                      setIsMenuOpen(!isMenuOpen);
                    }}
                    className="p-1 text-gray-400"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>

                  {isMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-32 bg-gray-800 rounded-lg shadow-lg z-10  border border-gray-700">
                      <button
                        onClick={handleDownload}
                        onTouchEnd={handleDownload} // Добавляем touch-обработчик
                        className="w-full px-3 py-2 text-sm flex items-center gap-2"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>Скачать</span>
                      </button>
                      
                      {showDelete && (
                        <button
                          onClick={handleDelete}
                          className="w-full px-3 py-2 text-sm flex items-center gap-2 text-red-400"
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span>Удалить</span>
                        </button>
                      )}
                    </div>
                  )}
            </div>
            </div>
      ) : (
        <div className="relative flex justify-end min-w-[60px]">
          <span className="text-gray-400 text-xs transition-opacity duration-200 group-hover:opacity-0">
            {formatDuration(track.duration)}
          </span>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-0">
            <button
              onClick={handleDownload}
              className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700 transition-colors"
              title="Скачать"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
            </button>
            
            {showDelete && (
              <button
                onClick={onDelete}
                className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-900/20 transition-colors"
                title="Удалить"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
</div>
    </div>
  );
};