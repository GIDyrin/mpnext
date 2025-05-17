// services/playlistConf.ts
import { api, baseErrorHandler } from "../api";
import { PlaylistDetailed } from '@/lib/models';

export const playlistConf = {
  // Получение детальной информации о плейлисте
  async getPlaylist(playlistId: number): Promise<PlaylistDetailed> {
    try {
      const response = await api.get<PlaylistDetailed>(`/playlists/${playlistId}/`);
      return response.data;
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  },

  // Добавление треков в плейлист
  async addTracksToPlaylist(
    playlistId: number, 
    trackIds: number[]
  ): Promise<{ status: string }> {
    try {
      const response = await api.post<{ status: string }>(
        `/playlists/${playlistId}/add-tracks/`,
        { track_ids: trackIds }
      );
      return response.data;
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  },

  async removeTrack(
    playlistId: number,
    trackId: number
  ): Promise<void> {
    try {
      await api.delete(`/playlists/${playlistId}/tracks/${trackId}/`);
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  },


  async getSystemPlaylist(): Promise<PlaylistDetailed> {
    try {
      const response = await api.get<PlaylistDetailed>('/playlists/system/');
      return response.data;
    } catch (error) {
      baseErrorHandler(error);
      throw error;
    }
  }
};