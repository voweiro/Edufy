'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface Color {
  id: string;
  name: string;
  hex: string;
  emoji: string;
}

const allColors: Color[] = [
  { id: 'red', name: 'Red', hex: '#FF0000', emoji: '🔴' },
  { id: 'blue', name: 'Blue', hex: '#0000FF', emoji: '🔵' },
  { id: 'green', name: 'Green', hex: '#00FF00', emoji: '🟢' },
  { id: 'yellow', name: 'Yellow', hex: '#FFFF00', emoji: '🟡' },
  { id: 'purple', name: 'Purple', hex: '#800080', emoji: '🟣' },
  { id: 'orange', name: 'Orange', hex: '#FFA500', emoji: '🟠' },
  { id: 'pink', name: 'Pink', hex: '#FFC0CB', emoji: '💖' },
  { id: 'brown', name: 'Brown', hex: '#A52A2A', emoji: '🟫' },
];

interface Level {
  number: number;
  colors: Color[];
  requiredScore: number;
  description: string;
  timeLimit?: number; // Optional time limit in seconds
}

const levels: Level[] = [
  {
    number: 1,
    colors: allColors.slice(0, 2), // Red and Blue
    requiredScore: 4,
    description: 'Match red and blue colors!'
  },
  {
    number: 2,
    colors: allColors.slice(0, 3), // Red, Blue, Green
    requiredScore: 6,
    description: 'Add green to the mix!'
  },
  {
    number: 3,
    colors: allColors.slice(0, 4), // Red, Blue, Green, Yellow
    requiredScore: 8,
    description: 'Now with yellow!'
  },
  {
    number: 4,
    colors: allColors.slice(0, 5), // Red, Blue, Green, Yellow, Purple
    requiredScore: 10,
    description: 'Add purple to the challenge!'
  },
  {
    number: 5,
    colors: allColors.slice(0, 6), // Red, Blue, Green, Yellow, Purple, Orange
    requiredScore: 12,
    description: 'All basic colors together!'
  },
  {
    number: 6,
    colors: allColors.slice(0, 7), // Add Pink
    requiredScore: 14,
    description: 'Add pink to the rainbow!'
  },
  {
    number: 7,
    colors: allColors, // All colors
    requiredScore: 16,
    description: 'All colors together!',
    timeLimit: 30
  },
  {
    number: 8,
    colors: allColors,
    requiredScore: 20,
    description: 'Master level - match all colors!',
    timeLimit: 20
  }
];

export default function ColorMatching() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [currentColor, setCurrentColor] = useState(levels[0].colors[Math.floor(Math.random() * levels[0].colors.length)]);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleColorMatch = (selectedColor: Color) => {
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

      // Check if level is complete
      if (score + 1 >= levels[currentLevel].requiredScore) {
        setShowLevelComplete(true);
        playSound('achievement');
        toast.success('Level Complete! 🎉', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          className: 'bg-yellow-500 text-white font-bold text-lg rounded-lg shadow-lg',
        });
      }
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
    setCurrentColor(levels[currentLevel].colors[Math.floor(Math.random() * levels[currentLevel].colors.length)]);
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setScore(0);
      setMessage(levels[currentLevel + 1].description);
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 right-4');
      setCurrentColor(levels[currentLevel + 1].colors[Math.floor(Math.random() * levels[currentLevel + 1].colors.length)]);
      setShowLevelComplete(false);
      setTimeLeft(levels[currentLevel + 1].timeLimit || null);
    }
  };

  const handleResetLevel = () => {
    setScore(0);
    setMessage(levels[currentLevel].description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
    setCurrentColor(levels[currentLevel].colors[Math.floor(Math.random() * levels[currentLevel].colors.length)]);
    setShowLevelComplete(false);
    setTimeLeft(levels[currentLevel].timeLimit || null);
  };

  return (
    <div className="game-container py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-primary">
          ← Back to Games
        </Link>
        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <div className="text-xl font-bold text-red-500">
              Time: {timeLeft}s
            </div>
          )}
          <div className="text-2xl">Level {currentLevel + 1}/8</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Color Matching Game
        </h1>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Progress</span>
            <span className="text-lg font-semibold">{score}/{levels[currentLevel].requiredScore}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(score / levels[currentLevel].requiredScore) * 100}%` }}
            />
          </div>
        </div>

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {levels[currentLevel].colors.map((color) => (
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
            {levels[currentLevel].description}
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button 
          className="btn-primary"
          onClick={handleResetLevel}
        >
          Reset Level
        </button>
        {showLevelComplete && currentLevel < levels.length - 1 && (
          <button 
            className="btn-primary bg-green-500 hover:bg-green-600"
            onClick={handleNextLevel}
          >
            Next Level →
          </button>
        )}
        <button className="btn-primary">
          Need Help?
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