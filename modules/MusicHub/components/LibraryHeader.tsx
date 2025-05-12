import { Playlist } from '@/lib/models/playlist';

type LibraryHeaderProps = {
  playlists: Playlist[];
};

export const LibraryHeader = ({ playlists }: LibraryHeaderProps) => (
  <div className="mb-10 text-center">
    <h1 className="text-4xl font-bold text-green-400 mb-4">Your Music Library</h1>
    <p className="text-gray-300 max-w-2xl mx-auto">
      {playlists.find(p => p.id === 'default')?.tracks} tracks organized in {playlists.length - 1} playlists
    </p>
  </div>
);