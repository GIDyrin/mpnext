import { Playlist } from '@/lib/models/playlist';

type LibraryHeaderProps = {
  playlists: Playlist[];
};

export const LibraryHeader = ({ playlists }: LibraryHeaderProps) => (
  <div className="mb-2.5 text-center">
    <h1 className="text-[22px] sm:text-4xl font-bold text-green-400 mb-2">Your Music Library</h1>
    <p className="text-gray-300 max-w-2xl mx-auto">
      {playlists[0].track_count} tracks at your library
    </p>
  </div>
);