'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface Emotion {
  id: string;
  name: string;
  emoji: string;
  description: string;
  examples: string[];
}

const allEmotions: Emotion[] = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    description: 'Feeling joyful and pleased',
    examples: ['🎉', '🎈', '🎪']
  },
  {
    id: 'sad',
    name: 'Sad',
    emoji: '😢',
    description: 'Feeling down or unhappy',
    examples: ['🌧️', '☔', '💧']
  },
  {
    id: 'angry',
    name: 'Angry',
    emoji: '😠',
    description: 'Feeling mad or upset',
    examples: ['💢', '⚡', '🔥']
  },
  {
    id: 'scared',
    name: 'Scared',
    emoji: '😨',
    description: 'Feeling afraid or frightened',
    examples: ['👻', '🕷️', '🦇']
  },
  {
    id: 'surprised',
    name: 'Surprised',
    emoji: '😮',
    description: 'Feeling shocked or amazed',
    examples: ['🎁', '✨', '🎪']
  },
  {
    id: 'excited',
    name: 'Excited',
    emoji: '🤩',
    description: 'Feeling very happy and enthusiastic',
    examples: ['🎢', '🎪', '🎯']
  },
  {
    id: 'proud',
    name: 'Proud',
    emoji: '😌',
    description: 'Feeling satisfied with achievements',
    examples: ['🏆', '🌟', '🎓']
  },
  {
    id: 'love',
    name: 'Love',
    emoji: '❤️',
    description: 'Feeling deep affection',
    examples: ['💝', '💖', '💕']
  }
];

interface Level {
  number: number;
  emotions: Emotion[];
  requiredScore: number;
  description: string;
  timeLimit?: number;
}

const levels: Level[] = [
  {
    number: 1,
    emotions: allEmotions.slice(0, 2),
    requiredScore: 4,
    description: 'Learn about happy and sad emotions!'
  },
  {
    number: 2,
    emotions: allEmotions.slice(0, 3),
    requiredScore: 6,
    description: 'Add angry emotions to the mix!'
  },
  {
    number: 3,
    emotions: allEmotions.slice(0, 4),
    requiredScore: 8,
    description: 'Learn about scared emotions!'
  },
  {
    number: 4,
    emotions: allEmotions.slice(0, 5),
    requiredScore: 10,
    description: 'Add surprised emotions!'
  },
  {
    number: 5,
    emotions: allEmotions.slice(0, 6),
    requiredScore: 12,
    description: 'Learn about excited emotions!'
  },
  {
    number: 6,
    emotions: allEmotions.slice(0, 7),
    requiredScore: 14,
    description: 'Add proud emotions!'
  },
  {
    number: 7,
    emotions: allEmotions,
    requiredScore: 16,
    description: 'All emotions together!',
    timeLimit: 30
  },
  {
    number: 8,
    emotions: allEmotions,
    requiredScore: 20,
    description: 'Master level - recognize all emotions!',
    timeLimit: 20
  }
];

export default function EmotionRecognition() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [currentEmotion, setCurrentEmotion] = useState(levels[0].emotions[Math.floor(Math.random() * levels[0].emotions.length)]);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [options, setOptions] = useState<Emotion[]>([]);

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
    // Generate options including the correct emotion and random emotions
    const correctEmotion = currentEmotion;
    const otherEmotions = levels[currentLevel].emotions
      .filter(e => e.id !== correctEmotion.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setOptions([correctEmotion, ...otherEmotions].sort(() => Math.random() - 0.5));
  }, [currentEmotion, currentLevel]);

  const handleEmotionMatch = (selectedEmotion: Emotion) => {
    if (selectedEmotion.id === currentEmotion.id) {
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
    setCurrentEmotion(levels[currentLevel].emotions[Math.floor(Math.random() * levels[currentLevel].emotions.length)]);
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setScore(0);
      setMessage(levels[currentLevel + 1].description);
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 right-4');
      setCurrentEmotion(levels[currentLevel + 1].emotions[Math.floor(Math.random() * levels[currentLevel + 1].emotions.length)]);
      setShowLevelComplete(false);
      setTimeLeft(levels[currentLevel + 1].timeLimit || null);
    }
  };

  const handleResetLevel = () => {
    setScore(0);
    setMessage(levels[currentLevel].description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
    setCurrentEmotion(levels[currentLevel].emotions[Math.floor(Math.random() * levels[currentLevel].emotions.length)]);
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
          Emotion Recognition Game
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
            {currentEmotion.emoji}
          </div>
          <div className="flex gap-4 text-4xl">
            {currentEmotion.examples.map((example, index) => (
              <span key={index} className="animate-pulse">{example}</span>
            ))}
          </div>
          <p className="text-lg text-gray-600 mt-4">
            {currentEmotion.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {options.map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => handleEmotionMatch(emotion)}
              className="p-6 rounded-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] bg-blue-100 hover:bg-blue-200"
            >
              <span className="text-4xl block mb-2">{emotion.emoji}</span>
              <span className="text-lg font-medium">{emotion.name}</span>
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