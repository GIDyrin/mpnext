import React from 'react'

export const AboutLibrary = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-800 p-6 rounded-xl">
        <div className="text-green-400 text-2xl mb-3">🎵</div>
        <h3 className="text-xl font-semibold mb-2">Upload Music</h3>
        <p className="text-gray-400">
          Supports high-quality formats including FLAC, WAV, and MP3
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <div className="text-green-400 text-2xl mb-3">📁</div>
        <h3 className="text-xl font-semibold mb-2">Organize</h3>
        <p className="text-gray-400">
          Create custom playlists for different moods and activities
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <div className="text-green-400 text-2xl mb-3">🔗</div>
        <h3 className="text-xl font-semibold mb-2">Stream Anywhere</h3>
        <p className="text-gray-400">
          Access your music collection from any device
        </p>
      </div>
    </div>
  )
}


