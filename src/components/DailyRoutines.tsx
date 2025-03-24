'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface Routine {
  id: string;
  name: string;
  emoji: string;
  description: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  sequence: number;
}

const allRoutines: Routine[] = [
  {
    id: 'wake-up',
    name: 'Wake Up',
    emoji: '🌅',
    description: 'Start the day by waking up',
    timeOfDay: 'morning',
    sequence: 1
  },
  {
    id: 'brush-teeth',
    name: 'Brush Teeth',
    emoji: '🦷',
    description: 'Clean your teeth',
    timeOfDay: 'morning',
    sequence: 2
  },
  {
    id: 'get-dressed',
    name: 'Get Dressed',
    emoji: '👕',
    description: 'Put on your clothes',
    timeOfDay: 'morning',
    sequence: 3
  },
  {
    id: 'eat-breakfast',
    name: 'Eat Breakfast',
    emoji: '🍳',
    description: 'Have your morning meal',
    timeOfDay: 'morning',
    sequence: 4
  },
  {
    id: 'go-to-school',
    name: 'Go to School',
    emoji: '🏫',
    description: 'Time for learning',
    timeOfDay: 'morning',
    sequence: 5
  },
  {
    id: 'eat-lunch',
    name: 'Eat Lunch',
    emoji: '🥪',
    description: 'Have your midday meal',
    timeOfDay: 'afternoon',
    sequence: 6
  },
  {
    id: 'play-time',
    name: 'Play Time',
    emoji: '🎮',
    description: 'Time for fun activities',
    timeOfDay: 'afternoon',
    sequence: 7
  },
  {
    id: 'do-homework',
    name: 'Do Homework',
    emoji: '📚',
    description: 'Complete your school work',
    timeOfDay: 'afternoon',
    sequence: 8
  },
  {
    id: 'eat-dinner',
    name: 'Eat Dinner',
    emoji: '🍽️',
    description: 'Have your evening meal',
    timeOfDay: 'evening',
    sequence: 9
  },
  {
    id: 'take-bath',
    name: 'Take a Bath',
    emoji: '🛁',
    description: 'Get clean before bed',
    timeOfDay: 'evening',
    sequence: 10
  },
  {
    id: 'read-book',
    name: 'Read a Book',
    emoji: '📖',
    description: 'Read before bedtime',
    timeOfDay: 'evening',
    sequence: 11
  },
  {
    id: 'go-to-bed',
    name: 'Go to Bed',
    emoji: '🌙',
    description: 'Time to sleep',
    timeOfDay: 'evening',
    sequence: 12
  }
];

interface Level {
  number: number;
  routines: Routine[];
  requiredScore: number;
  description: string;
  timeLimit?: number;
}

const levels: Level[] = [
  {
    number: 1,
    routines: allRoutines.filter(r => r.timeOfDay === 'morning'),
    requiredScore: 4,
    description: 'Learn morning routines!'
  },
  {
    number: 2,
    routines: allRoutines.filter(r => r.timeOfDay === 'afternoon'),
    requiredScore: 6,
    description: 'Learn afternoon routines!'
  },
  {
    number: 3,
    routines: allRoutines.filter(r => r.timeOfDay === 'evening'),
    requiredScore: 8,
    description: 'Learn evening routines!'
  },
  {
    number: 4,
    routines: allRoutines.slice(0, 6),
    requiredScore: 10,
    description: 'Mix morning and afternoon routines!'
  },
  {
    number: 5,
    routines: allRoutines.slice(6),
    requiredScore: 12,
    description: 'Mix afternoon and evening routines!'
  },
  {
    number: 6,
    routines: allRoutines,
    requiredScore: 14,
    description: 'All routines together!'
  },
  {
    number: 7,
    routines: allRoutines,
    requiredScore: 16,
    description: 'Complete the day faster!',
    timeLimit: 30
  },
  {
    number: 8,
    routines: allRoutines,
    requiredScore: 20,
    description: 'Master level - complete the day quickly!',
    timeLimit: 20
  }
];

export default function DailyRoutines() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [currentRoutine, setCurrentRoutine] = useState(levels[0].routines[Math.floor(Math.random() * levels[0].routines.length)]);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [options, setOptions] = useState<Routine[]>([]);
  const [sequence, setSequence] = useState<Routine[]>([]);

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
    // Generate options including the correct routine and random routines
    const correctRoutine = currentRoutine;
    const otherRoutines = levels[currentLevel].routines
      .filter(r => r.id !== correctRoutine.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setOptions([correctRoutine, ...otherRoutines].sort(() => Math.random() - 0.5));
  }, [currentRoutine, currentLevel]);

  const handleRoutineMatch = (selectedRoutine: Routine) => {
    if (selectedRoutine.id === currentRoutine.id) {
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

      // Add to sequence if it's the next in order
      if (sequence.length === 0 || selectedRoutine.sequence === sequence[sequence.length - 1].sequence + 1) {
        setSequence([...sequence, selectedRoutine]);
      }

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
    setCurrentRoutine(levels[currentLevel].routines[Math.floor(Math.random() * levels[currentLevel].routines.length)]);
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setScore(0);
      setMessage(levels[currentLevel + 1].description);
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 right-4');
      setCurrentRoutine(levels[currentLevel + 1].routines[Math.floor(Math.random() * levels[currentLevel + 1].routines.length)]);
      setShowLevelComplete(false);
      setTimeLeft(levels[currentLevel + 1].timeLimit || null);
      setSequence([]);
    }
  };

  const handleResetLevel = () => {
    setScore(0);
    setMessage(levels[currentLevel].description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
    setCurrentRoutine(levels[currentLevel].routines[Math.floor(Math.random() * levels[currentLevel].routines.length)]);
    setShowLevelComplete(false);
    setTimeLeft(levels[currentLevel].timeLimit || null);
    setSequence([]);
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
          Daily Routines Game
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
            {currentRoutine.emoji}
          </div>
          <p className="text-lg text-gray-600 mb-4">
            {currentRoutine.description}
          </p>
          <div className="text-sm text-gray-500">
            Time of Day: {currentRoutine.timeOfDay.charAt(0).toUpperCase() + currentRoutine.timeOfDay.slice(1)}
          </div>
        </div>

        {sequence.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Your Sequence:</h3>
            <div className="flex flex-wrap gap-2">
              {sequence.map((routine, index) => (
                <div key={routine.id} className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                  <span className="text-sm">{index + 1}.</span>
                  <span>{routine.emoji}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {options.map((routine) => (
            <button
              key={routine.id}
              onClick={() => handleRoutineMatch(routine)}
              className="p-6 rounded-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] bg-blue-100 hover:bg-blue-200"
            >
              <span className="text-4xl block mb-2">{routine.emoji}</span>
              <span className="text-lg font-medium">{routine.name}</span>
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