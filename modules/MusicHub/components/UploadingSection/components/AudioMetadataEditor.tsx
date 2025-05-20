import { useEffect, useState } from "react";
import { parseBlob } from "music-metadata-browser";
import { ArrowPathIcon } from "@heroicons/react/24/outline"; // Иконки Heroicons

export interface AudioMetadataEditorProps {
  file: File;
  onMetadataChange: (data: { title: string; artist: string; duration: number }) => void;
}

export const AudioMetadataEditor = ({ file, onMetadataChange }: AudioMetadataEditorProps) => {
  const [metadata, setMetadata] = useState({
    title: "",
    artist: "",
    duration: 0,
  });

  // Автоматическое извлечение метаданных
  useEffect(() => {
    const extractMetadata = async () => {
      try {
        const metadataFromFile = await parseBlob(file); // Читаем метаданные из файла
        const common = metadataFromFile.common;
        const audioContext = new (window.AudioContext)();

        // Если артист или название не указаны
        const titleFromFileName = file.name.replace(/\.[^/.]+$/, ""); // Удаляем расширение файла
        const [potentialArtist, potentialTitle] = titleFromFileName.split(" - ").map((s) => s.trim());

        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        setMetadata({
          title: common.title || potentialTitle || titleFromFileName,
          artist: common.artist || potentialArtist || "Unknown Artist",
          duration: Math.round(audioBuffer.duration),
        });
      } catch (error) {
        console.error("Ошибка при чтении метаданных:", error);
        // Если что-то пошло не так, выставляем базовые значения
        const titleFromFileName = file.name.replace(/\.[^/.]+$/, ""); // Удаляем расширение файла
        const [potentialArtist, potentialTitle] = titleFromFileName.split(" - ").map((s) => s.trim());

        setMetadata({
          title: potentialTitle || titleFromFileName,
          artist: potentialArtist || "Unknown Artist",
          duration: 0,
        });
      }
    };

    extractMetadata();
  }, [file]);

  // Уведомляем родителя об изменении
  useEffect(() => {
    onMetadataChange(metadata);
  }, [metadata]);

  // Обработчик кнопки "Свап"
  const handleSwap = () => {
    setMetadata((prev) => ({
      ...prev,
      title: prev.artist,
      artist: prev.title,
    }));
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4">
      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) =>
              setMetadata((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full bg-gray-800 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Artist</label>
          <input
            type="text"
            value={metadata.artist}
            onChange={(e) =>
              setMetadata((prev) => ({ ...prev, artist: e.target.value }))
            }
            className="w-full bg-gray-800 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Duration: {Math.floor(metadata.duration / 60)}:{String(metadata.duration % 60).padStart(2, "0")}
        </div>

        {/* Кнопка Свап */}
        <button
          onClick={handleSwap}
          className="flex items-center bg-gray-900 hover:bg-gray-800 text-gray-300 px-3 py-2 rounded-lg transition"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Swap
        </button>
      </div>
    </div>
  );
};
