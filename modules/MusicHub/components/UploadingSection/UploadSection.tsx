import { Playlist } from "@/lib/models";
import { useState } from 'react';
import { musicHubService, TrackUploadData } from "@/lib/services";
import { AboutLibrary, LibraryHeader, UploadForm } from "./components";


type UploadingSectionProps = {
  playlists: Playlist[];
  updateParent : () => void;
};

export const UploadingSection = ({
  playlists,
  updateParent
}: UploadingSectionProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const isNew = playlists.some(p => p.is_system && p.track_count === 0);

  const handleUpload = async (tracksData: TrackUploadData[]) => {
    try {
      await musicHubService.uploadTracks(tracksData, (progress) => {
        setUploadProgress(progress);
      });
      updateParent();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-3 sm:p-8 max-w-2xl mx-auto">
      {isNew ? (
        <>
          <h2 className="text-2xl font-bold text-green-400 mb-4">Get Started</h2> 
          <div className="text-center mb-6">
            <h1 className="text-[20px] sm:text-4xl font-bold text-green-400 mb-6">
              Welcome to Your Music Library
            </h1>
            <AboutLibrary />
            <UploadForm 
              isNew={isNew}
              uploadProgress={uploadProgress}
              onUpload={handleUpload}
            />
          </div>
        </>
      ) : (
        <>
          <LibraryHeader playlists={playlists} />
          <div className="bg-gray-800 rounded-xl p-1 sm:p-6">
            <UploadForm 
              isNew={isNew}
              uploadProgress={uploadProgress}
              onUpload={handleUpload}
            />
          </div>
        </>
      )}
    </div>
  );
};