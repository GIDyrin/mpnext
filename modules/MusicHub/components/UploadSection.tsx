import { musicHubService } from "@/lib/services/musicHub";

type UploadSectionProps = {
  onUploadProgress: (progress: number) => void;
  onUploadComplete: (uploadedCount: number) => void;
};

export const UploadSection = ({ 
  onUploadProgress, 
  onUploadComplete 
}: UploadSectionProps) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      onUploadProgress(0);
      const response = await musicHubService.uploadTracks(files);
      onUploadComplete(response.uploaded_count);
    } catch (error) {
      onUploadProgress(0);
    }
  };

  return (
<div className="bg-gray-800 rounded-xl p-8 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-green-400 mb-4">Get Started</h2>
    <p className="text-gray-300 mb-6">
      Upload your first tracks to begin building your personal music library
    </p>
    <input 
      type="file" 
      id="music-upload"
      className="hidden" 
      accept=".flac,.alac,.wav,.aiff,.mp3,.aac,.ogg"
      multiple
      onChange={handleFileUpload}
    />
    <label 
      htmlFor="music-upload"
      className="cursor-pointer inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg transition-colors text-lg"
    >
      Upload Your First Tracks
    </label>
</div>
  );
};