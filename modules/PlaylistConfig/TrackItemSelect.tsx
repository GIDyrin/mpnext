import { Track } from "@/lib/models"
import { formatDuration } from "@/lib/utils"

interface TrackItemSelectProps{
    track: Track;
    selectedTracks: number[];
}

export const TrackItemSelect = ({track, selectedTracks } : TrackItemSelectProps) => {
    return(
    <div className="group bg-gray-700 px-4 py-3 gap-5 rounded-lg flex items-center justify-between hover:bg-gray-600 transition-colors w-full">
        <input
        type="checkbox"
        checked={selectedTracks.includes(track.id)}
        readOnly
        className="w-5 h-5 text-green-500 rounded focus:ring-green-500 ring-1"
        />
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{track.title}</h3>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-20 flex justify-end">
          <span className="text-gray-400 text-sm group">
            {formatDuration(track.duration)}
          </span>
          
        </div>
      </div>
    </div>
    ) 
}