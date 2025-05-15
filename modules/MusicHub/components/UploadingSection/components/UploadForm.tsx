import { TrackUploadData } from '@/lib/services/musicHub';
import { useState, useCallback, useRef } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { AudioMetadataEditor } from './AudioMetadataEditor';

interface TrackUpload extends TrackUploadData {
  id: string;
  file: File;
}

export const UploadForm = ({ 
  isNew,
  uploadProgress,
  onUpload
}: {
  isNew: boolean;
  uploadProgress: number;
  onUpload: (tracks: TrackUploadData[]) => Promise<void>;
}) => {
  const [tracks, setTracks] = useState<TrackUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newTracks = acceptedFiles.map(file => ({
      id: Math.random().toString(36).slice(2, 9),
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: 'Unknown Artist',
      duration: 0
    }));
    
    setTracks(prev => [...prev, ...newTracks]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: {
      'audio/*': ['.flac', '.alac', '.wav', '.aiff', '.mp3', '.aac', '.ogg']
    },
    multiple: true,
    noClick: true 
  });

  const updateTrackMetadata = (id: string, data: Partial<TrackUpload>) => {
    setTracks(prev => prev.map(track => 
      track.id === id ? { ...track, ...data } : track
    ));
  };

  const removeTrack = (id: string) => {
    setTracks(prev => prev.filter(track => track.id !== id));
  };

const handleUpload = async () => {
    if (tracks.length === 0) return;
    try {
      await onUpload(tracks.map(({ file, title, artist, duration }) => ({
        file,
        title,
        artist,
        duration
      })));
      // Сбрасываем состояние и input
      setTracks([]);
      if (inputRef.current) {
        inputRef.current.value = ''; // Очищаем значение input
      }
    } catch (error) {
      // Оставляем файлы для повторной попытки
      console.error('Upload failed:', error);
    }
  };

  return (
    <div 
      {...getRootProps()}
      className={`bg-gray-800 rounded-xl border-dotted  p-3 mb-2 border-2 ${
        dragActive ? 'border-green-500' : 'border-gray-600'
      } transition-all duration-200`}
    >
      <input 
        {...getInputProps()}
        id="music-upload"
        ref={inputRef}
        className="hidden"
      />
      
      <div className="rounded-lg p-4 text-center">
        <div className="mb-2">
          <label 
            htmlFor="music-upload"
            className="cursor-pointer inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors mb-4"
          >
            {isNew ? 'Add your first tracks' : "Update your library"}
          </label>
          <p className="text-gray-400">Or drop here</p>
        </div>

        {tracks.length > 0 && (
          <div className="mt-6 space-y-4">
            {tracks.map(track => (
              <div key={track.id} className="relative group">
                <AudioMetadataEditor
                  file={track.file}
                  onMetadataChange={(data) => 
                    updateTrackMetadata(track.id, data)
                  }
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTrack(track.id);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors mt-6"
            >
              Upload {tracks.length} tracks
            </button>
          </div>
        )}

        {uploadProgress > 0 && (
          <div className="mt-6">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-gray-400 mt-2 text-sm">
              Uploading status: {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};