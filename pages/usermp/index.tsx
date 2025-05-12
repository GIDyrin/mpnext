import { useState, useEffect } from 'react';
import { AppLayout } from "@/modules";
import { api } from '@/lib/api';
import Router from 'next/router';
import { Playlist } from '@/lib/models';
import { AboutLibrary, UploadSection, LoadingState, LibraryHeader } from '@/modules/MusicHub';

export default function User() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [activeTab, setActiveTab] = useState('library');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка плейлистов с сервера
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const response = await api.get('/playlists/');
        const defaultLibrary = {
          id: 'default',
          name: 'My Library',
          tracks: response.data.total_tracks || 0,
          deletable: false
        };
        setPlaylists([defaultLibrary, ...response.data.playlists]);
      } catch (error) {
        console.error('Failed to load playlists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  // Создание нового плейлиста
  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    try {
      const response = await api.post('/playlists/', { name: newPlaylistName });
      const newPlaylist = {
        id: response.data.id,
        name: response.data.name,
        tracks: 0,
        deletable: true
      };
      
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  // Удаление плейлиста
  const deletePlaylist = async (playlistId: string) => {
    try {
      await api.delete(`/playlists/${playlistId}/`);
      setPlaylists(playlists.filter(p => p.id !== playlistId));
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };


  // Проверка пустой библиотеки
  const isLibraryEmpty = playlists.find(p => p.id === 'default')?.tracks === 0;

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLibraryEmpty ? (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-400 mb-6">Welcome to Your Music Library</h1>
            <AboutLibrary />
            <UploadSection 
            onUploadProgress={function (progress: number): void {
              throw new Error('Function not implemented.');
            } } 
            onUploadComplete={function (uploadedCount: number): void {
              throw new Error('Function not implemented.');
            } }            
            />
            
          </div>
        ) : (
          <>
            <LibraryHeader
            playlists={[]}
            />

            <div className="bg-gray-800 rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-bold text-green-400 mb-4">Upload More Tracks</h2>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <input 
                  type="file" 
                  id="music-upload"
                  className="hidden" 
                  accept=".flac,.alac,.wav,.aiff,.mp3,.aac,.ogg"
                  multiple
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="music-upload"
                  className="cursor-pointer inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors mb-4"
                >
                  Select Files
                </label>
                <p className="text-gray-400 mb-2">or drag & drop files here</p>
                
                {uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 mt-2">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Управление плейлистами */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-400">Your Playlists</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'library' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                My Library
              </button>
              <button 
                onClick={() => setActiveTab('playlists')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'playlists' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Custom Playlists
              </button>
            </div>
          </div>

          {activeTab === 'library' && (
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">My Library</h3>
                  <p className="text-gray-400">
                    {playlists.find(p => p.id === 'default')?.tracks} tracks
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
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {playlists
              .filter(p => activeTab === 'playlists' ? p.deletable : !p.deletable)
              .map(playlist => (
                <div 
                  key={playlist.id} 
                  className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => playlist.id !== 'default' && Router.push(`/playlist/${playlist.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">{playlist.name}</h3>
                    {playlist.deletable && (
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
                    {playlist.tracks} tracks
                  </p>
                </div>
              ))}
          </div>

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
      </div>
    </AppLayout>
  );
}