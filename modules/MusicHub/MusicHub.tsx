import { useState, useEffect } from 'react';
import { Playlist } from '@/lib/models';
import { UploadingSection, LoadingState, PlaylistManagement } from '@/modules/MusicHub';
import { musicHubService } from '@/lib/services';

export const MusicHub = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const response = await musicHubService.getPlaylists();
        
        const formattedPlaylists = response.map((playlist: Playlist) => ({
          id: playlist.id.toString(),
          name: playlist.name,
          track_count: playlist.track_count,
          deletable: !playlist.is_system,
          created_at: playlist.created_at,
          is_system: playlist.is_system
        }));

        const systemPlaylist = formattedPlaylists.find( (p: Playlist) => p.is_system);
        const userPlaylists = formattedPlaylists.filter( (p: Playlist) => !p.is_system)
          .sort((a: Playlist, b: Playlist) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

        setPlaylists([systemPlaylist, ...userPlaylists].filter(Boolean));
        
      } catch (error) {
        console.error('Failed to load playlists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaylists();
  }, [isUploading]);



  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <UploadingSection
          playlists={playlists}
          updateParent={() => {setIsUploading(!isUploading)}}
        />

        <PlaylistManagement
          playlists={playlists}
          updateParent={() => {setIsUploading(!isUploading)}}
          updatePlaylist={ (param) => setPlaylists(param)}
        /> 
    </div>
  );
}