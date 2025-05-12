import { api } from '@/lib/api';
import { baseErrorHandler } from '@/lib/api';

export const musicHubService = {
  async getPlaylists() {
    try {
      const response = await api.get('/playlists/');
      return response.data;
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  },

  async createPlaylist(name: string) {
    try {
      const response = await api.post('/playlists/', { name });
      return response.data;
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  },

  async deletePlaylist(playlistId: string) {
    try {
      await api.delete(`/playlists/${playlistId}/`);
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  },

  async uploadTracks(files: FileList) {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      const response = await api.post('/tracks/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  }
};