'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface Pattern {
  id: string;
  name: string;
  emoji: string;
  pattern: string[];
}

const allPatterns: Pattern[] = [
  {
    id: 'fruits',
    name: 'Fruits',
    emoji: '🍎',
    pattern: ['🍎', '🍌', '🍎', '🍌']
  },
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐶',
    pattern: ['🐶', '🐱', '🐶', '🐱']
  },
  {
    id: 'shapes',
    name: 'Shapes',
    emoji: '🔷',
    pattern: ['🔷', '🔶', '🔷', '🔶']
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    emoji: '🚗',
    pattern: ['🚗', '🚌', '🚗', '🚌']
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍕',
    pattern: ['🍕', '🍔', '🍕', '🍔']
  },
  {
    id: 'weather',
    name: 'Weather',
    emoji: '☀️',
    pattern: ['☀️', '🌧️', '☀️', '🌧️']
  },
  {
    id: 'sports',
    name: 'Sports',
    emoji: '⚽',
    pattern: ['⚽', '🏀', '⚽', '🏀']
  },
  {
    id: 'music',
    name: 'Music',
    emoji: '🎵',
    pattern: ['🎵', '🎸', '🎵', '🎸']
  }
];

interface Level {
  number: number;
  patterns: Pattern[];
  requiredScore: number;
  description: string;
  timeLimit?: number;
}

const levels: Level[] = [
  {
    number: 1,
    patterns: allPatterns.slice(0, 2),
    requiredScore: 4,
    description: 'Match simple patterns with fruits and animals!'
  },
  {
    number: 2,
    patterns: allPatterns.slice(0, 3),
    requiredScore: 6,
    description: 'Add shapes to the patterns!'
  },
  {
    number: 3,
    patterns: allPatterns.slice(0, 4),
    requiredScore: 8,
    description: 'Match patterns with vehicles!'
  },
  {
    number: 4,
    patterns: allPatterns.slice(0, 5),
    requiredScore: 10,
    description: 'Add food patterns to the mix!'
  },
  {
    number: 5,
    patterns: allPatterns.slice(0, 6),
    requiredScore: 12,
    description: 'Match weather patterns!'
  },
  {
    number: 6,
    patterns: allPatterns.slice(0, 7),
    requiredScore: 14,
    description: 'Add sports patterns!'
  },
  {
    number: 7,
    patterns: allPatterns,
    requiredScore: 16,
    description: 'All patterns together!',
    timeLimit: 30
  },
  {
    number: 8,
    patterns: allPatterns,
    requiredScore: 20,
    description: 'Master level - match all patterns!',
    timeLimit: 20
  }
];

export default function PatternMatching() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [currentPattern, setCurrentPattern] = useState(levels[0].patterns[Math.floor(Math.random() * levels[0].patterns.length)]);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [options, setOptions] = useState<Pattern[]>([]);

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

  useEffect(() => {
    // Generate options including the correct pattern and random patterns
    const correctPattern = currentPattern;
    const otherPatterns = levels[currentLevel].patterns
      .filter(p => p.id !== correctPattern.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setOptions([correctPattern, ...otherPatterns].sort(() => Math.random() - 0.5));
  }, [currentPattern, currentLevel]);

  const handlePatternMatch = (selectedPattern: Pattern) => {
    if (selectedPattern.id === currentPattern.id) {
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
    setCurrentPattern(levels[currentLevel].patterns[Math.floor(Math.random() * levels[currentLevel].patterns.length)]);
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setScore(0);
      setMessage(levels[currentLevel + 1].description);
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 right-4');
      setCurrentPattern(levels[currentLevel + 1].patterns[Math.floor(Math.random() * levels[currentLevel + 1].patterns.length)]);
      setShowLevelComplete(false);
      setTimeLeft(levels[currentLevel + 1].timeLimit || null);
    }
  };

  const handleResetLevel = () => {
    setScore(0);
    setMessage(levels[currentLevel].description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
    setCurrentPattern(levels[currentLevel].patterns[Math.floor(Math.random() * levels[currentLevel].patterns.length)]);
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
          Pattern Matching Game
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
          <div className="flex gap-4 text-4xl">
            {currentPattern.pattern.map((emoji, index) => (
              <span key={index} className="animate-bounce">{emoji}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {options.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handlePatternMatch(pattern)}
              className="p-6 rounded-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] bg-blue-100 hover:bg-blue-200"
            >
              <div className="flex justify-center gap-2 mb-2">
                {pattern.pattern.map((emoji, index) => (
                  <span key={index}>{emoji}</span>
                ))}
              </div>
              <span className="text-lg font-medium">{pattern.name}</span>
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