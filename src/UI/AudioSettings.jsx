import { useState } from "react";

export default function AudioSettings({
  musicVolume,
  setMusicVolume,
  sfxVolume,
  setSfxVolume,
  laserVolume,
  setLaserVolume,
  audioEnabled,
  setAudioEnabled,
}) {
  const [showVolumeSettings, setShowVolumeSettings] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowVolumeSettings((prev) => !prev)}
        className="absolute top-2 right-10 bg-gray-200 hover:bg-gray-300 px-1 rounded cursor-pointer"
      >
        🔊
      </button>
      {showVolumeSettings && (
        <div className="absolute top-12 right-4 bg-white shadow-lg p-4 rounded border border-gray-300 z-50">
          {/* SFX */}
          <div className="flex items-center gap-2 mb-2 text-black">
            <label htmlFor="sfx">Sound</label>
            <input
              id="sfx"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            />
          </div>
          {/* Laser Volume */}
          <div className="flex items-center gap-2 mb-2 text-black">
            <label htmlFor="laser">Shoot</label>
            <input
              id="laser"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={laserVolume}
              onChange={(e) => setLaserVolume(parseFloat(e.target.value))}
            />
          </div>
          {/* Background Music */}
          <div className="flex items-center gap-2 mb-2 text-black">
            <label htmlFor="music">Music</label>
            <input
              id="music"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            />
          </div>
          {/* Audio On/Off */}
          <button
            onClick={() => setAudioEnabled((prev) => !prev)}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded w-full"
          >
            {audioEnabled ? "🔊" : "🔇"}
          </button>
        </div>
      )}
    </>
  );
}
