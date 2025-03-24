import React, { useState } from 'react';
import { playSound, toggleBackgroundMusic, setVolume } from '../utils/sound';

const SoundControl = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    toggleBackgroundMusic();
    playSound('click');
  };

  return (
    <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg flex items-center gap-3 z-50">
      <button
        onClick={handleMuteToggle}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default SoundControl; 