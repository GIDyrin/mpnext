

export const Welcome = () => {
  return (
    <>
          <div className="mb-8 space-y-6">
            <h1 className="sm:text-3xl text-2xl font-bold text-green-400 mt-2.5 sm:mb-6 mb-3">
            Welcome to GlebbassMP
            </h1>
            <div className="bg-gray-800 rounded-xl  p-6 shadow-xl">
              <h2 className="text-2xl font-semibold text-green-400 mb-4">
                Your Personal Music Universe
              </h2>
              <div className="grid sm:grid-cols-2 gap-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 text-green-400 mt-1">🎵</div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-100">Upload & Organize</h3>
                      <p className="text-gray-400">
                        Store your music collection in lossless quality. Supported formats: 
                        FLAC, WAV, MP3, AAC
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 text-green-400 mt-1">🎧</div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-100">Smart Streaming</h3>
                      <p className="text-gray-400">
                        Adaptive HSL streaming with Opus transcoding for perfect playback
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 text-green-400 mt-1">📱</div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-100">Cross-Platform</h3>
                      <p className="text-gray-400">
                        Access your music from any device. Progressive Web App ready
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 text-green-400 mt-1">🔒</div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-100">Secure Storage</h3>
                      <p className="text-gray-400">
                        Military-grade encryption for both metadata and media files
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-green-400 mb-3">
                Tech Stack Highlights
              </h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="px-3 py-1 bg-gray-700 rounded-full">Django 5.2.1</span>
                <span className="px-3 py-1 bg-gray-700 rounded-full">PostgreSQL 14</span>
                <span className="px-3 py-1 bg-gray-700 rounded-full">FFmpeg 6.1</span>
                <span className="px-3 py-1 bg-gray-700 rounded-full">HSL Streaming</span>
                <span className="px-3 py-1 bg-gray-700 rounded-full">Celery + Redis</span>
                <span className="px-3 py-1 bg-gray-700 rounded-full">JWT Auth</span>
              </div>
            </div>
          </div>
          </>
  )
}


