'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface EmotionScenario {
  id: string;
  emotion: string;
  emoji: string;
  situation: string;
  correctResponses: string[];
  explanation: string;
  tips: string[];
}

const scenarios: EmotionScenario[] = [
  {
    id: 'happy-friend',
    emotion: 'Happy',
    emoji: '😊',
    situation: 'Your friend is smiling and jumping with excitement because they got a new toy.',
    correctResponses: [
      'Share their excitement by smiling and saying "That\'s great!"',
      'Ask them about their new toy',
      'Show interest in what makes them happy'
    ],
    explanation: 'When someone is happy, it\'s good to share their joy and show interest in what makes them happy.',
    tips: [
      'Smile back at them',
      'Use happy words like "wow" or "great"',
      'Ask questions about what they like'
    ]
  },
  {
    id: 'sad-friend',
    emotion: 'Sad',
    emoji: '😢',
    situation: 'Your friend is crying because they lost their favorite toy.',
    correctResponses: [
      'Ask if they\'re okay and offer comfort',
      'Help them look for the toy',
      'Share a similar experience to show understanding'
    ],
    explanation: 'When someone is sad, it\'s important to show care and offer help.',
    tips: [
      'Use gentle words',
      'Offer to help',
      'Be patient and understanding'
    ]
  },
  {
    id: 'angry-friend',
    emotion: 'Angry',
    emoji: '😠',
    situation: 'Your friend is angry because someone took their turn in a game.',
    correctResponses: [
      'Help them calm down by taking deep breaths together',
      'Suggest a fair solution',
      'Remind them that it\'s okay to feel angry but not to hurt others'
    ],
    explanation: 'When someone is angry, help them calm down and find a peaceful solution.',
    tips: [
      'Stay calm yourself',
      'Use calming words',
      'Suggest positive solutions'
    ]
  },
  {
    id: 'scared-friend',
    emotion: 'Scared',
    emoji: '😨',
    situation: 'Your friend is scared of the loud thunder during a storm.',
    correctResponses: [
      'Stay with them and offer comfort',
      'Explain what thunder is in a simple way',
      'Help them find a safe, quiet place'
    ],
    explanation: 'When someone is scared, it\'s helpful to stay with them and explain things calmly.',
    tips: [
      'Be patient and understanding',
      'Use simple explanations',
      'Offer physical comfort if they want it'
    ]
  },
  {
    id: 'excited-friend',
    emotion: 'Excited',
    emoji: '🤩',
    situation: 'Your friend is very excited about their upcoming birthday party.',
    correctResponses: [
      'Share their excitement and ask about their plans',
      'Help them count down to the special day',
      'Show interest in what they\'re looking forward to'
    ],
    explanation: 'When someone is excited, it\'s fun to share their excitement and show interest in their plans.',
    tips: [
      'Use excited words',
      'Ask about their plans',
      'Share in their anticipation'
    ]
  }
];

interface Level {
  number: number;
  scenarios: EmotionScenario[];
  requiredScore: number;
  description: string;
}

const levels: Level[] = [
  {
    number: 1,
    scenarios: scenarios.slice(0, 2),
    requiredScore: 2,
    description: 'Learn to respond to basic emotions'
  },
  {
    number: 2,
    scenarios: scenarios.slice(0, 3),
    requiredScore: 3,
    description: 'Practice responding to more emotions'
  },
  {
    number: 3,
    scenarios: scenarios,
    requiredScore: 4,
    description: 'Master responding to all emotions'
  }
];

export default function EmotionActions() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');

  const currentLevelScenarios = levels[currentLevel].scenarios;
  const currentScenarioData = currentLevelScenarios[currentScenario];

  const handleResponseClick = (response: string) => {
    if (showExplanation) return;

    if (currentScenarioData.correctResponses.includes(response)) {
      setScore(prev => prev + 1);
      setMessage('Great job! That\'s a good way to respond!');
      setCharacterExpression('😄');
      setCharacterPosition('bottom-4 left-4');
      playSound('success');
      toast.success('Excellent response!', {
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
      setMessage('Let\'s learn about better ways to respond.');
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
          Emotion Actions Game
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
          <div className="text-6xl mb-4">{currentScenarioData.emoji}</div>
          <p className="text-xl font-semibold mb-4">
            {currentScenarioData.situation}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {currentScenarioData.correctResponses.map((response, index) => (
            <button
              key={index}
              onClick={() => handleResponseClick(response)}
              className={`p-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] ${
                showExplanation
                  ? 'bg-green-200'
                  : 'bg-blue-100 hover:bg-blue-200'
              }`}
            >
              {response}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-8">
            <p className="text-lg text-yellow-800 mb-4">
              {currentScenarioData.explanation}
            </p>
            <div className="mt-4">
              <p className="font-semibold mb-2">Helpful Tips:</p>
              <ul className="list-disc list-inside">
                {currentScenarioData.tips.map((tip, index) => (
                  <li key={index} className="text-yellow-800">{tip}</li>
                ))}
              </ul>
            </div>
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