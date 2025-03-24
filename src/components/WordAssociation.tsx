'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface WordPair {
  id: string;
  word: string;
  emoji: string;
  associatedWord: string;
  associatedEmoji: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const allWordPairs: WordPair[] = [
  // Easy pairs - direct associations
  {
    id: 'sun-flower',
    word: 'Sun',
    emoji: '☀️',
    associatedWord: 'Flower',
    associatedEmoji: '🌻',
    category: 'Nature',
    difficulty: 'easy'
  },
  {
    id: 'rain-umbrella',
    word: 'Rain',
    emoji: '🌧️',
    associatedWord: 'Umbrella',
    associatedEmoji: '☔',
    category: 'Weather',
    difficulty: 'easy'
  },
  {
    id: 'dog-bone',
    word: 'Dog',
    emoji: '🐕',
    associatedWord: 'Bone',
    associatedEmoji: '🦴',
    category: 'Animals',
    difficulty: 'easy'
  },
  // Medium pairs - functional associations
  {
    id: 'book-read',
    word: 'Book',
    emoji: '📚',
    associatedWord: 'Read',
    associatedEmoji: '📖',
    category: 'Activities',
    difficulty: 'medium'
  },
  {
    id: 'bed-sleep',
    word: 'Bed',
    emoji: '🛏️',
    associatedWord: 'Sleep',
    associatedEmoji: '😴',
    category: 'Daily Life',
    difficulty: 'medium'
  },
  {
    id: 'pencil-write',
    word: 'Pencil',
    emoji: '✏️',
    associatedWord: 'Write',
    associatedEmoji: '✍️',
    category: 'School',
    difficulty: 'medium'
  },
  // Hard pairs - abstract associations
  {
    id: 'cloud-rain',
    word: 'Cloud',
    emoji: '☁️',
    associatedWord: 'Rain',
    associatedEmoji: '🌧️',
    category: 'Weather',
    difficulty: 'hard'
  },
  {
    id: 'seed-plant',
    word: 'Seed',
    emoji: '🌱',
    associatedWord: 'Plant',
    associatedEmoji: '🌿',
    category: 'Nature',
    difficulty: 'hard'
  },
  {
    id: 'milk-cow',
    word: 'Milk',
    emoji: '🥛',
    associatedWord: 'Cow',
    associatedEmoji: '🐄',
    category: 'Food',
    difficulty: 'hard'
  }
];

interface Level {
  number: number;
  wordPairs: WordPair[];
  requiredScore: number;
  description: string;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const levels: Level[] = [
  {
    number: 1,
    wordPairs: allWordPairs.filter(w => w.difficulty === 'easy'),
    requiredScore: 3,
    description: 'Match simple word pairs!',
    difficulty: 'easy'
  },
  {
    number: 2,
    wordPairs: allWordPairs.filter(w => w.difficulty === 'easy'),
    requiredScore: 4,
    description: 'More simple word pairs!',
    difficulty: 'easy'
  },
  {
    number: 3,
    wordPairs: allWordPairs.filter(w => w.difficulty === 'medium'),
    requiredScore: 4,
    description: 'Match functional word pairs!',
    difficulty: 'medium'
  },
  {
    number: 4,
    wordPairs: allWordPairs.filter(w => w.difficulty === 'medium'),
    requiredScore: 5,
    description: 'More functional word pairs!',
    difficulty: 'medium'
  },
  {
    number: 5,
    wordPairs: allWordPairs.filter(w => w.difficulty === 'hard'),
    requiredScore: 4,
    description: 'Match abstract word pairs!',
    difficulty: 'hard'
  },
  {
    number: 6,
    wordPairs: allWordPairs.filter(w => w.difficulty === 'hard'),
    requiredScore: 5,
    description: 'More abstract word pairs!',
    difficulty: 'hard'
  },
  {
    number: 7,
    wordPairs: allWordPairs,
    requiredScore: 6,
    description: 'Mix of all word pairs!',
    timeLimit: 30,
    difficulty: 'medium'
  },
  {
    number: 8,
    wordPairs: allWordPairs,
    requiredScore: 8,
    description: 'Master level - complete quickly!',
    timeLimit: 20,
    difficulty: 'hard'
  }
];

export default function WordAssociation() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [currentWordPair, setCurrentWordPair] = useState(levels[0].wordPairs[Math.floor(Math.random() * levels[0].wordPairs.length)]);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [options, setOptions] = useState<WordPair[]>([]);
  const [streak, setStreak] = useState(0);

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
    // Generate options including the correct word pair and random word pairs
    const correctWordPair = currentWordPair;
    const otherWordPairs = levels[currentLevel].wordPairs
      .filter(w => w.id !== correctWordPair.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setOptions([correctWordPair, ...otherWordPairs].sort(() => Math.random() - 0.5));
  }, [currentWordPair, currentLevel]);

  const handleWordMatch = (selectedWordPair: WordPair) => {
    if (selectedWordPair.id === currentWordPair.id) {
      setScore(score + 1);
      setStreak(streak + 1);
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
      setStreak(0);
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
    setCurrentWordPair(levels[currentLevel].wordPairs[Math.floor(Math.random() * levels[currentLevel].wordPairs.length)]);
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setScore(0);
      setMessage(levels[currentLevel + 1].description);
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 right-4');
      setCurrentWordPair(levels[currentLevel + 1].wordPairs[Math.floor(Math.random() * levels[currentLevel + 1].wordPairs.length)]);
      setShowLevelComplete(false);
      setTimeLeft(levels[currentLevel + 1].timeLimit || null);
      setStreak(0);
    }
  };

  const handleResetLevel = () => {
    setScore(0);
    setMessage(levels[currentLevel].description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
    setCurrentWordPair(levels[currentLevel].wordPairs[Math.floor(Math.random() * levels[currentLevel].wordPairs.length)]);
    setShowLevelComplete(false);
    setTimeLeft(levels[currentLevel].timeLimit || null);
    setStreak(0);
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
          Word Association Game
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

        <div className="flex flex-col items-center mb-12">
          <div className="text-8xl mb-4 animate-bounce">
            {currentWordPair.emoji}
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-4">
            {currentWordPair.word}
          </p>
          <div className="text-sm text-gray-500">
            Category: {currentWordPair.category}
          </div>
          {streak > 0 && (
            <div className="mt-2 text-green-500 font-bold">
              Streak: {streak} 🔥
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {options.map((wordPair) => (
            <button
              key={wordPair.id}
              onClick={() => handleWordMatch(wordPair)}
              className="p-6 rounded-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] bg-blue-100 hover:bg-blue-200"
            >
              <span className="text-4xl block mb-2">{wordPair.associatedEmoji}</span>
              <span className="text-lg font-medium">{wordPair.associatedWord}</span>
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