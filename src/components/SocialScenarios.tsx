'use client';

import { useState,  } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface Scenario {
  id: string;
  situation: string;
  options: string[];
  correctOption: number;
  explanation: string;
  image: string;
}

const scenarios: Scenario[] = [
  {
    id: 'greeting',
    situation: 'Someone new comes to your class. What should you do?',
    options: [
      'Ignore them',
      'Say "Hello" and introduce yourself',
      'Run away',
      'Start talking about your favorite topic'
    ],
    correctOption: 1,
    explanation: 'It\'s polite to greet new people and introduce yourself. This helps make them feel welcome.',
    image: '👋'
  },
  {
    id: 'sharing',
    situation: 'Your friend wants to play with your favorite toy. What should you do?',
    options: [
      'Keep it all to yourself',
      'Share for a few minutes',
      'Throw the toy',
      'Tell them to go away'
    ],
    correctOption: 1,
    explanation: 'Sharing is important for making friends. You can take turns playing with the toy.',
    image: '🎮'
  },
  {
    id: 'personal-space',
    situation: 'Someone is standing too close to you. What should you do?',
    options: [
      'Push them away',
      'Say "Please give me some space"',
      'Start crying',
      'Run away'
    ],
    correctOption: 1,
    explanation: 'It\'s okay to ask for personal space in a polite way. This helps you feel comfortable.',
    image: '👥'
  },
  {
    id: 'turn-taking',
    situation: 'You want to speak but someone else is talking. What should you do?',
    options: [
      'Interrupt them',
      'Wait for them to finish',
      'Start talking loudly',
      'Leave the room'
    ],
    correctOption: 1,
    explanation: 'Taking turns to speak is important in conversations. Wait for others to finish before speaking.',
    image: '🗣️'
  },
  {
    id: 'feelings',
    situation: 'Your friend looks sad. What should you do?',
    options: [
      'Ignore them',
      'Ask if they\'re okay',
      'Laugh at them',
      'Tell them to stop being sad'
    ],
    correctOption: 1,
    explanation: 'It\'s kind to check on friends when they look sad. This shows you care about their feelings.',
    image: '😢'
  }
];

interface Level {
  number: number;
  scenarios: Scenario[];
  requiredScore: number;
  description: string;
}

const levels: Level[] = [
  {
    number: 1,
    scenarios: scenarios.slice(0, 2),
    requiredScore: 2,
    description: 'Learn basic social interactions'
  },
  {
    number: 2,
    scenarios: scenarios.slice(0, 3),
    requiredScore: 3,
    description: 'Practice more social situations'
  },
  {
    number: 3,
    scenarios: scenarios,
    requiredScore: 4,
    description: 'Master all social scenarios'
  }
];

export default function SocialScenarios() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');

  const currentLevelScenarios = levels[currentLevel].scenarios;
  const currentScenarioData = currentLevelScenarios[currentScenario];

  const handleOptionClick = (optionIndex: number) => {
    if (showExplanation) return;

    if (optionIndex === currentScenarioData.correctOption) {
      setScore(prev => prev + 1);
      setMessage('Great job! That\'s a good choice!');
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
      setMessage('Let\'s try to understand why this might not be the best choice.');
      setCharacterExpression('😟');
      setCharacterPosition('top-4 right-4');
      playSound('failure');
      toast.error('Let\'s try again!', {
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

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentScenario < currentLevelScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setShowExplanation(false);
      setMessage(levels[currentLevel].description);
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 right-4');
    } else if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setCurrentScenario(0);
      setShowExplanation(false);
      setMessage(levels[currentLevel + 1].description);
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 right-4');
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
  };

  const handleResetLevel = () => {
    setCurrentScenario(0);
    setScore(0);
    setShowExplanation(false);
    setMessage(levels[currentLevel].description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
  };

  return (
    <div className="game-container py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-primary">
          ← Back to Games
        </Link>
        <div className="text-2xl">Level {currentLevel + 1}/3</div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Social Scenarios Game
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

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{currentScenarioData.image}</div>
          <p className="text-xl font-semibold mb-4">
            {currentScenarioData.situation}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentScenarioData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`p-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] ${
                showExplanation
                  ? index === currentScenarioData.correctOption
                    ? 'bg-green-200'
                    : 'bg-gray-200'
                  : 'bg-blue-100 hover:bg-blue-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-8">
            <p className="text-lg text-yellow-800">
              {currentScenarioData.explanation}
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          <button 
            className="btn-primary"
            onClick={handleResetLevel}
          >
            Reset Level
          </button>
          {showExplanation && (
            <button 
              className="btn-primary bg-green-500 hover:bg-green-600"
              onClick={handleNext}
            >
              {currentScenario < currentLevelScenarios.length - 1
                ? 'Next Scenario →'
                : currentLevel < levels.length - 1
                  ? 'Next Level →'
                  : 'Complete!'}
            </button>
          )}
          <button className="btn-primary">
            Need Help?
          </button>
        </div>
      </div>

      <CartoonCharacter 
        message={message} 
        position={characterPosition}
        expression={characterExpression}
      />
    </div>
  );
} 