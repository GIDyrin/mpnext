import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PlaylistDetailed, Track } from '@/lib/models';
import { playlistConf } from '@/lib/services';
import Link from 'next/link';
import { AppLayout } from '@/modules';
import { TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/modules/PlaylistConfig/Modal';
import { TrackItem } from '@/modules/PlaylistConfig';
import { Player } from '@/modules/Player';



const PlaylistPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [playlist, setPlaylist] = useState<PlaylistDetailed | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [availableTracks, setAvailableTracks] = useState<Track[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<number[]>([]);

  // Загрузка данных плейлиста
    useEffect(() => {
        const loadData = async () => {
            try {
            if (typeof id !== 'string') return;
            const playlistId = parseInt(id);
            
            // Загрузка текущего плейлиста
            const playlistData = await playlistConf.getPlaylist(playlistId);
            setPlaylist({
                ...playlistData,
                tracks: [...playlistData.tracks]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            });
            
            // Загрузка треков из системного плейлиста
            if (!playlistData.is_system) {
                const systemPlaylist = await playlistConf.getSystemPlaylist();
                const existingTrackIds = new Set(playlistData.tracks.map(t => t.id));
                const filteredTracks = systemPlaylist.tracks
                .filter(t => !existingTrackIds.has(t.id))
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                
                setAvailableTracks(filteredTracks);
            }
            } catch (error) {
            console.error('Error loading data:', error);
            } finally {
            setLoading(false);
            }
        };

        if (id) loadData();
    }, [id]);

    // В обработчике добавления треков
    const handleAddTracks = async () => {
        if (!playlist || selectedTracks.length === 0) return;

        try {
        await playlistConf.addTracksToPlaylist(playlist.id, selectedTracks);

        // Обновляем списки с сортировкой
        const newTracks = availableTracks
            .filter(t => selectedTracks.includes(t.id))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setPlaylist({
            ...playlist,
            tracks: [...playlist.tracks, ...newTracks]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        });

        setAvailableTracks(prev => prev
            .filter(t => !selectedTracks.includes(t.id))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        );

        setIsAddModalOpen(false);
        setSelectedTracks([]);
        } catch (error) {
        console.error('Error adding tracks:', error);
        }
    };

    const handleDeleteTrack = async (trackId: number) => {
    if (!playlist || !id) return;
    
    try {
      await playlistConf.removeTrack(playlist.id, trackId);
      const updatedTracks = playlist.tracks.filter(t => t.id !== trackId);
      setPlaylist({ ...playlist, tracks: updatedTracks });
    } catch (error) {
      console.error('Error deleting track:', error);
    }
  };


  if (loading) return <div>Loading...</div>;
  if (!playlist) return <div>Playlist not found</div>;

  return (
    <AppLayout>
      <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl">
        <div className="max-w-3xl mx-auto">
          {/* Шапка */}
          <div className="mx-auto mb-6">
            <div className="flex justify-between items-center gap-10 sm:gap-24">
              <Link href="/usermp">
                <button className="text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors cursor-pointer">
                  <span className="text-lg">←</span>
                  <span className="text-sm">Back</span>
                </button>
              </Link>
              {!playlist.is_system && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg
                    flex items-center gap-2 transition-colors"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  <span>Add Tracks</span>
                </button>
              )}
            </div>
            <h1 className="text-2xl text-center font-semibold text-green-400 truncate mt-4">
              {playlist.name}
            </h1>
          </div>

          {/* Список треков */}
          <div className="space-y-2 w-full">
            {playlist.tracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                showDelete={!playlist.is_system}
                onDelete={() => handleDeleteTrack(track.id)}
              />
            ))}

            {playlist.tracks.length === 0 && (
              <div className="text-center text-gray-400 py-6 text-sm">
                No tracks in this playlist
              </div>
            )}
          </div>
        </div>

        {/* Модальное окно добавления треков */}
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <div className="p-6 bg-gray-800 rounded-lg max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4">Add Tracks</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableTracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                  onClick={() => {
                    setSelectedTracks(prev => 
                      prev.includes(track.id)
                        ? prev.filter(id => id !== track.id)
                        : [...prev, track.id]
                    );
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTracks.includes(track.id)}
                    readOnly
                    className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
                  />
                  <TrackItem track={track} />
                </div>
              ))}
              
              {availableTracks.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  No available tracks to add
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTracks}
                disabled={selectedTracks.length === 0}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg
                  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Selected ({selectedTracks.length})
              </button>
            </div>
          </div>
        </Modal>
      </div>
      <Player />
    </AppLayout>
  );
};

export default PlaylistPage;