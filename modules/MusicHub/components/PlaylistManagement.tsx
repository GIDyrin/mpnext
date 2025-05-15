import { useRouter } from "next/router";
import { useState } from "react";
import { Playlist } from "@/lib/models";
import { musicHubService } from "@/lib/services";

interface PlaylistManagementProps {
  playlists: Playlist[];
  updatePlaylist: (param: Playlist[]) => void;
  updateParent: () => void;
}


export const PlaylistManagement = ({
  playlists,
  updatePlaylist,
  updateParent
}: PlaylistManagementProps) => {
  const [activeTab, setActiveTab] = useState('library');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const router = useRouter();

  const [systemPlaylist, ...userPlaylists] = playlists;

      const createPlaylist = async () => {
      if (!newPlaylistName.trim()) return;
      
      try {
        const newPlaylist = await musicHubService.createPlaylist(newPlaylistName);
        setNewPlaylistName('');
        updatePlaylist([systemPlaylist, ...userPlaylists, newPlaylist])
      } catch (error) {
        console.error('Failed to create playlist:', error);
      }
    };
  
    const deletePlaylist = async (playlistId: number) => {
      try {
        await musicHubService.deletePlaylist(playlistId);
        updateParent()
      } catch (error) {
        console.error('Failed to delete playlist:', error);
      }
    };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-400">Your Playlists</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'library' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            My Library
          </button>
          <button 
            onClick={() => setActiveTab('playlists')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'playlists' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Custom Playlists
          </button>
        </div>
      </div>

        <div className="bg-gray-700 p-4 rounded-lg mb-3">
          <div className="flex items-center justify-between ">
            <div>
              <h3 className="text-xl font-semibold">{systemPlaylist.name}</h3>
              <p className="text-gray-400">
                {systemPlaylist.track_count} tracks
              </p>
            </div>
            <span className="px-3 py-1 bg-gray-600 rounded-full text-sm">
              System Playlist
            </span>
          </div>
          <p className="mt-3 text-gray-300">
            All your uploaded tracks appear here automatically. Use this collection to organize tracks into custom playlists.
          </p>
        </div>
      {(activeTab === 'playlists' ? userPlaylists : [systemPlaylist])
        .filter((playlist): playlist is NonNullable<typeof playlist> => Boolean(playlist))
        .map(playlist => (
          <div 
            key={playlist.id} 
            className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer px-4 mb-2.5"
            onClick={() => router.push(`/playlist/${playlist.id}`)}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">{playlist.name}</h3>
              {!playlist.is_system && (
                <button 
                  className="text-gray-400 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist(playlist.id);
                  }}
                >
                  ×
                </button>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {playlist.track_count} tracks
            </p>
          </div>
        ))}


      <div className="flex items-center mt-6">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name"
          className="flex-grow px-4 py-2 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-green-400"
          onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
        />
        <button
          onClick={createPlaylist}
          disabled={!newPlaylistName.trim()}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-r-lg transition-colors disabled:opacity-50"
        >
          Create
        </button>
      </div>
    </div>
  );
};