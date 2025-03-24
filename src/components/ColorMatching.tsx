'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

const colors = [
  { id: 'red', name: 'Red', hex: '#FF0000', emoji: '🔴' },
  { id: 'blue', name: 'Blue', hex: '#0000FF', emoji: '🔵' },
  { id: 'green', name: 'Green', hex: '#00FF00', emoji: '🟢' },
  { id: 'yellow', name: 'Yellow', hex: '#FFFF00', emoji: '🟡' },
  { id: 'purple', name: 'Purple', hex: '#800080', emoji: '🟣' },
  { id: 'orange', name: 'Orange', hex: '#FFA500', emoji: '🟠' }
];

export default function ColorMatching() {
  const [currentColor, setCurrentColor] = useState(colors[Math.floor(Math.random() * colors.length)]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Match the color!');
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');

  const handleColorMatch = (selectedColor: typeof colors[0]) => {
    if (selectedColor.id === currentColor.id) {
      setScore(score + 1);
      setMessage('Great job! Keep going!');
      setCharacterExpression('😄');
      setCharacterPosition('bottom-4 left-4');
      playSound('success');
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
    } else {
      setMessage('Try again!');
      setCharacterExpression('😟');
      setCharacterPosition('top-4 right-4');
      playSound('failure');
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
    setCurrentColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  return (
    <div className="game-container py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-primary">
          ← Back to Games
        </Link>
        <div className="text-2xl">Score: {score}</div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Match the Color!
        </h1>

        <div className="flex justify-center mb-12">
          <div 
            className="w-32 h-32 rounded-full shadow-lg animate-bounce"
            style={{ backgroundColor: currentColor.hex }}
          >
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {currentColor.emoji}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorMatch(color)}
              className="p-6 rounded-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary]"
              style={{ backgroundColor: color.hex }}
            >
              <span className="text-3xl mb-2 block">{color.emoji}</span>
              <span className="text-xl font-medium text-white">{color.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">
            Click on the color that matches the circle above!
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button className="btn-primary">
          Need Help?
        </button>
        <button className="btn-primary">
          Skip Question
        </button>
      </div>

      <CartoonCharacter 
        message={message} 
        position={characterPosition}
        expression={characterExpression}
      />
    </div>
  );
} 