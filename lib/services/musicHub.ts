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
    const CHUNK_SIZE = 50 * 1024 * 1024; // 50 MB

    const uploadFile = async (track: TrackUploadData) => {
        const file = track.file;
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const fileId = Math.random().toString(36).substr(2, 9);
        
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const formData = new FormData();
            const offset = chunkIndex * CHUNK_SIZE;
            const chunk = file.slice(offset, offset + CHUNK_SIZE);
            
            formData.append('file_id', fileId);
            formData.append('chunk_index', chunkIndex.toString());
            formData.append('total_chunks', totalChunks.toString());
            formData.append('chunk', chunk, file.name);
            formData.append('title', track.title);
            formData.append('artist', track.artist);
            formData.append('duration', track.duration.toString());
            formData.append('original_filename', file.name);

            await api.post('/tracks/upload/', formData, {
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const overallProgress = Math.round(
                            ((chunkIndex * CHUNK_SIZE + progressEvent.loaded) / file.size) * 100
                        );
                        onProgress(overallProgress);
                    }
                }
            });
        }
    };

    try {
        const results = [];
        for (const track of tracksData) {
            results.push(await uploadFile(track));
        }
        return results;
    } catch (error) {
        baseErrorHandler(error);
        throw error;
    }
}

};
