import { api } from '@/lib/api';
import { baseErrorHandler } from '@/lib/api';


export interface TrackUploadData {
  file: File;
  title: string;
  artist: string;
  duration: number;
}


export const musicHubService = {
  async getPlaylists() {
    try {
      const response = await api.get('/me/playlists/');
      return response.data;
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  },

  async createPlaylist(name: string) {
    try {
      const response = await api.post('/me/playlists/', { name });
      return response.data;
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  },

  async deletePlaylist(playlistId: number) {
    try {
      await api.delete(`/playlists/${playlistId}/`);
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  },

  async uploadTracks(
    tracksData: TrackUploadData[],
    onProgress?: (progress: number) => void
  ) {
    try {
      const formData = new FormData();
      
      tracksData.forEach((track, index) => {
        formData.append(`tracks[${index}].original_file`, track.file);
        formData.append(`tracks[${index}].title`, track.title);
        formData.append(`tracks[${index}].artist`, track.artist);
        formData.append(`tracks[${index}].duration`, track.duration.toString());
      });

      const response = await api.post('/tracks/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percent);
          }
        }
      });
      
      return response.data;
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  },

};
