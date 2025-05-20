import { api, baseErrorHandler } from '../api'
import {saveAs} from 'file-saver'

export const downloadingService = {
  async downloadTrack(trackId: number, fileName?: string) {
    try {
      const response = await api.get(`/tracks/${trackId}/download/`, {
        responseType: 'blob',
      })

      // Получаем имя файла из headers или генерируем
      const contentDisposition = response.headers['content-disposition']
      const finalFileName =
        fileName ||
        this.getFileNameFromHeaders(contentDisposition) ||
        `track_${trackId}.mp3`

      // Сохраняем файл
      saveAs(new Blob([response.data]), finalFileName)
    } catch (error) {
      baseErrorHandler(error)
    }
  },

  async downloadPlaylist(playlistId: number, fileName?: string) {
    try {
      const response = await api.get(`/playlists/${playlistId}/download/`, {
        responseType: 'blob',
      })

      const contentDisposition = response.headers['content-disposition']
      const finalFileName =
        fileName ||
        this.getFileNameFromHeaders(contentDisposition) ||
        `playlist_${playlistId}.zip`

      saveAs(new Blob([response.data]), finalFileName)
    } catch (error) {
      baseErrorHandler(error)
    }
  },

  getFileNameFromHeaders(contentDisposition?: string): string | null {
    if (!contentDisposition) return null
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    const matches = filenameRegex.exec(contentDisposition)
    if (matches?.[1]) {
      return matches[1].replace(/['"]/g, '')
    }
    return null
  },
}