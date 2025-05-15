import { useEffect, useState } from "react";

export interface AudioMetadataEditorProps {
  file: File;
  onMetadataChange: (data: { title: string; artist: string; duration: number }) => void;
}

export const AudioMetadataEditor = ({ file, onMetadataChange }: AudioMetadataEditorProps) => {
  const [metadata, setMetadata] = useState({
    title: file.name.replace(/\.[^/.]+$/, ""), // Удаляем расширение файла
    artist: 'Unknown Artist',
    duration: 0
  });

  // Автоматическое определение длительности
  useEffect(() => {
    const getDuration = async () => {
      const audioContext = new (window.AudioContext || window.AudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      setMetadata(prev => ({
        ...prev,
        duration: Math.round(audioBuffer.duration)
      }));
    };

    getDuration().catch(console.error);
  }, [file]);

  // Обновляем данные при изменении
  useEffect(() => {
    onMetadataChange(metadata);
  }, [metadata]);

  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-gray-800 rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Artist</label>
          <input
            type="text"
            value={metadata.artist}
            onChange={(e) => setMetadata(prev => ({ ...prev, artist: e.target.value }))}
            className="w-full bg-gray-800 rounded px-3 py-2"
          />
        </div>
      </div>
      
      <div className="mt-2 text-sm text-gray-400">
        Duration: {Math.floor(metadata.duration / 60)}:{String(metadata.duration % 60).padStart(2, '0')}
      </div>
    </div>
  );
};