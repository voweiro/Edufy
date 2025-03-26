'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface Level {
  number: number;
  sequenceLength: number;
  maxNumber: number;
  description: string;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const levels: Level[] = [
  {
    number: 1,
    sequenceLength: 3,
    maxNumber: 5,
    description: 'Complete the sequence with numbers up to 5!',
    difficulty: 'easy'
  },
  {
    number: 2,
    sequenceLength: 4,
    maxNumber: 8,
    description: 'Complete the sequence with numbers up to 8!',
    difficulty: 'easy'
  },
  {
    number: 3,
    sequenceLength: 5,
    maxNumber: 10,
    description: 'Complete the sequence with numbers up to 10!',
    difficulty: 'easy'
  },
  {
    number: 4,
    sequenceLength: 6,
    maxNumber: 15,
    description: 'Complete the sequence with numbers up to 15!',
    difficulty: 'medium'
  },
  {
    number: 5,
    sequenceLength: 7,
    maxNumber: 20,
    description: 'Complete the sequence with numbers up to 20!',
    difficulty: 'medium'
  },
  {
    number: 6,
    sequenceLength: 8,
    maxNumber: 25,
    description: 'Complete the sequence with numbers up to 25!',
    difficulty: 'medium'
  },
  {
    number: 7,
    sequenceLength: 9,
    maxNumber: 30,
    description: 'Complete the sequence with numbers up to 30!',
    timeLimit: 60,
    difficulty: 'hard'
  },
  {
    number: 8,
    sequenceLength: 10,
    maxNumber: 40,
    description: 'Master level - complete the sequence with numbers up to 40!',
    timeLimit: 45,
    difficulty: 'hard'
  }
];

export default function NumberSequence() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initializeLevel();
  }, [currentLevel]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft !== null && timeLeft > 0 && !isLevelComplete) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isLevelComplete]);

  const generateSequence = (length: number, max: number) => {
    const seq: number[] = [];
    for (let i = 0; i < length; i++) {
      seq.push(Math.floor(Math.random() * max) + 1);
    }
    return seq;
  };

  const initializeLevel = () => {
    const level = levels[currentLevel];
    const newSequence = generateSequence(level.sequenceLength, level.maxNumber);
    setSequence(newSequence);
    setUserSequence([]);
    setMessage(level.description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
    setShowLevelComplete(false);
    setIsLevelComplete(false);
    setTimeLeft(level.timeLimit || null);
    setMoves(0);
  };

  const handleTimeUp = () => {
    setMessage('Time\'s up! Try again!');
    setCharacterExpression('😟');
    setCharacterPosition('top-4 right-4');
    playSound('failure');
    toast.error('Time\'s Up!', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      className: 'bg-red-500 text-white font-bold text-lg rounded-lg shadow-lg',
    });
    handleResetLevel();
  };

  const handleNumberClick = (number: number) => {
    if (isLevelComplete) return;

    setMoves(prev => prev + 1);
    const newUserSequence = [...userSequence, number];
    setUserSequence(newUserSequence);

    // Check if the sequence is correct
    const isCorrect = newUserSequence.every((num, index) => num === sequence[index]);

    if (isCorrect) {
      if (newUserSequence.length === sequence.length) {
        // Level complete
        setIsLevelComplete(true);
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

        // Check if game is complete
        if (currentLevel === levels.length - 1) {
          setGameCompleted(true);
          toast.success('🎉 Congratulations! You\'ve completed all levels! 🎉', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            className: 'bg-green-500 text-white font-bold text-lg rounded-lg shadow-lg',
          });
        }
      } else {
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
      handleResetLevel();
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    }
  };

  const handleResetLevel = () => {
    initializeLevel();
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
          Number Sequence Game
        </h1>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Progress</span>
            <span className="text-lg font-semibold">{userSequence.length}/{sequence.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(userSequence.length / sequence.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {sequence.map((num, index) => (
            <div
              key={index}
              className={`w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg ${
                index < userSequence.length
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {index < userSequence.length ? userSequence[index] : '?'}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          {Array.from({ length: levels[currentLevel].maxNumber }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className={`p-4 text-2xl font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] ${
                isLevelComplete ? 'opacity-50 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'
              }`}
              disabled={isLevelComplete}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">
            {levels[currentLevel].description}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Difficulty: {levels[currentLevel].difficulty.charAt(0).toUpperCase() + levels[currentLevel].difficulty.slice(1)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Moves: {moves}
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
        {showLevelComplete && !gameCompleted && (
          <button 
            className="btn-primary bg-green-500 hover:bg-green-600"
            onClick={handleNextLevel}
          >
            Next Level →
          </button>
        )}
        {gameCompleted && (
          <button 
            className="btn-primary bg-yellow-500 hover:bg-yellow-600"
            onClick={() => window.location.reload()}
          >
            Play Again
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