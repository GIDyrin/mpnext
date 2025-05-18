import { TrashIcon, PlayIcon } from '@heroicons/react/24/outline';
import { usePlayerActions } from '@/store/player-store'
import { Track } from '@/lib/models';
import { formatDuration } from "@/lib/utils"

type TrackItemProps = {
  track: Track;
  showDelete?: boolean;
  onDelete?: () => void;
};

export const TrackItem = ({ track, showDelete = false, onDelete }: TrackItemProps) => {
  const { play } = usePlayerActions();

  const handlePlay = () => {
    if (!track.hls_playlist) {
      console.error('HLS playlist not available for this track');
      return;
    }
    play(track);
  };

  return (
    <div className="group bg-gray-700 px-4 py-3 rounded-lg flex items-center justify-between hover:bg-gray-600 transition-colors">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={handlePlay}
          className="text-green-400 hover:text-green-300 p-1.5 rounded-md hover:bg-green-900/20 transition-colors"
          title="Play track"
        >
          <PlayIcon className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{track.title}</h3>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-20 flex justify-end">
          <span className="text-gray-400 text-sm transition-opacity duration-200 group-hover:opacity-0">
            {formatDuration(track.duration)}
          </span>
          
          {showDelete && (
            <button
              onClick={onDelete}
              className="absolute right-0 text-red-400 hover:text-red-300 p-1.5 rounded-md hover:bg-red-900/20 
                opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              title="Delete track"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

