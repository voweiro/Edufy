'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface NumberItem {
  id: string;
  count: number;
  emoji: string;
}

const allNumbers: NumberItem[] = [
  { id: '1', count: 1, emoji: '1️⃣' },
  { id: '2', count: 2, emoji: '2️⃣' },
  { id: '3', count: 3, emoji: '3️⃣' },
  { id: '4', count: 4, emoji: '4️⃣' },
  { id: '5', count: 5, emoji: '5️⃣' },
  { id: '6', count: 6, emoji: '6️⃣' },
  { id: '7', count: 7, emoji: '7️⃣' },
  { id: '8', count: 8, emoji: '8️⃣' },
  { id: '9', count: 9, emoji: '9️⃣' },
  { id: '10', count: 10, emoji: '🔟' },
];

interface Level {
  number: number;
  maxNumber: number;
  requiredScore: number;
  description: string;
  timeLimit?: number;
}

const levels: Level[] = [
  {
    number: 1,
    maxNumber: 3,
    requiredScore: 4,
    description: 'Count up to 3!'
  },
  {
    number: 2,
    maxNumber: 5,
    requiredScore: 6,
    description: 'Count up to 5!'
  },
  {
    number: 3,
    maxNumber: 7,
    requiredScore: 8,
    description: 'Count up to 7!'
  },
  {
    number: 4,
    maxNumber: 9,
    requiredScore: 10,
    description: 'Count up to 9!'
  },
  {
    number: 5,
    maxNumber: 10,
    requiredScore: 12,
    description: 'Count up to 10!'
  },
  {
    number: 6,
    maxNumber: 10,
    requiredScore: 14,
    description: 'Count faster!',
    timeLimit: 30
  },
  {
    number: 7,
    maxNumber: 10,
    requiredScore: 16,
    description: 'Count even faster!',
    timeLimit: 25
  },
  {
    number: 8,
    maxNumber: 10,
    requiredScore: 20,
    description: 'Master level - count quickly!',
    timeLimit: 20
  }
];

export default function NumberCounting() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [currentNumber, setCurrentNumber] = useState<number>(1);
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

  const handleNumberClick = (selectedNumber: number) => {
    if (selectedNumber === currentNumber) {
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
    setCurrentNumber(Math.floor(Math.random() * levels[currentLevel].maxNumber) + 1);
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setScore(0);
      setMessage(levels[currentLevel + 1].description);
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 right-4');
      setCurrentNumber(Math.floor(Math.random() * levels[currentLevel + 1].maxNumber) + 1);
      setShowLevelComplete(false);
      setTimeLeft(levels[currentLevel + 1].timeLimit || null);
    }
  };

  const handleResetLevel = () => {
    setScore(0);
    setMessage(levels[currentLevel].description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
    setCurrentNumber(Math.floor(Math.random() * levels[currentLevel].maxNumber) + 1);
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
          Number Counting Game
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
          <div className="text-8xl animate-bounce">
            {Array(currentNumber).fill('⭐').join('')}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {allNumbers.slice(0, levels[currentLevel].maxNumber).map((number) => (
            <button
              key={number.id}
              onClick={() => handleNumberClick(number.count)}
              className="p-6 rounded-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] bg-blue-100 hover:bg-blue-200"
            >
              <span className="text-4xl block">{number.emoji}</span>
              <span className="text-xl font-medium">{number.count}</span>
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