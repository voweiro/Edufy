'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sounds = [
  { id: 'dog', name: 'Dog Barking', icon: '🐶', sound: '/sounds/dog-bark.mp3' },
  { id: 'cat', name: 'Cat Meowing', icon: '🐱', sound: '/sounds/cat-meow.mp3' },
  { id: 'car', name: 'Car Horn', icon: '🚗', sound: '/sounds/car-horn.mp3' },
  { id: 'bell', name: 'Bell Ringing', icon: '🔔', sound: '/sounds/bell-ring.mp3' }
];

export default function SoundRecognition() {
  const [currentSound, setCurrentSound] = useState(sounds[Math.floor(Math.random() * sounds.length)]);
  const [score, setScore] = useState(0);

  const handleSoundSelection = (selectedSoundId: string) => {
    if (selectedSoundId === currentSound.id) {
      setScore(score + 1);
      toast.success('Correct!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        className: 'bg-green-500 text-white font-bold text-lg rounded-lg shadow-lg',
      });
      setCurrentSound(sounds[Math.floor(Math.random() * sounds.length)]);
    } else {
      toast.error('Try Again!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        className: 'bg-red-500 text-white font-bold text-lg rounded-lg shadow-lg',
      });
    }
  };

  return (
    <div className="game-container py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="flex items-center justify-between mb-8">
        <div className="text-2xl">Score: {score}</div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Identify the Sound!
        </h1>

        <div className="flex justify-center mb-8">
          <button className="btn-primary" onClick={() => new Audio(currentSound.sound).play()}>
            Play Sound
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => handleSoundSelection(sound.id)}
              className="p-6 rounded-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary]"
            >
              <span className="text-3xl mb-2 block">{sound.icon}</span>
              <span className="text-xl font-medium text-gray-800">{sound.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 