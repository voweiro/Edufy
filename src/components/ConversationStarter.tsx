'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface ConversationScenario {
  id: string;
  situation: string;
  emoji: string;
  topic: string;
  starterPhrases: string[];
  followUpQuestions: string[];
  explanation: string;
  tips: string[];
}

const scenarios: ConversationScenario[] = [
  {
    id: 'playground',
    situation: 'You see someone playing with a toy you like at the playground.',
    emoji: '🎮',
    topic: 'Playing together',
    starterPhrases: [
      'Hi! I like that toy too. Can I play with you?',
      'That looks fun! Would you like to play together?',
      'I have a similar toy at home. What do you like about it?'
    ],
    followUpQuestions: [
      'What other games do you like to play?',
      'Do you play with this toy often?',
      'Would you like to try playing a different game together?'
    ],
    explanation: 'Starting a conversation about shared interests is a great way to make friends.',
    tips: [
      'Use friendly words like "hi" and "please"',
      'Show interest in what they\'re doing',
      'Ask questions about their interests'
    ]
  },
  {
    id: 'lunch',
    situation: 'You\'re sitting next to someone at lunch who has a cool lunchbox.',
    emoji: '🍱',
    topic: 'Lunch and food',
    starterPhrases: [
      'That\'s a cool lunchbox! Where did you get it?',
      'I like your lunchbox. What do you have for lunch today?',
      'Your lunch looks yummy! What\'s your favorite food?'
    ],
    followUpQuestions: [
      'What other foods do you like?',
      'Do you help pack your lunch?',
      'What\'s your favorite thing to eat at school?'
    ],
    explanation: 'Talking about food and lunch is a great way to start a conversation with someone new.',
    tips: [
      'Use positive words about their food',
      'Ask about their preferences',
      'Share your own experiences'
    ]
  },
  {
    id: 'art',
    situation: 'Someone is drawing a picture you think is interesting.',
    emoji: '🎨',
    topic: 'Art and creativity',
    starterPhrases: [
      'That\'s a nice drawing! What are you drawing?',
      'I like your picture. What colors did you use?',
      'Your art is cool! Do you like to draw often?'
    ],
    followUpQuestions: [
      'What other things do you like to draw?',
      'Who taught you to draw?',
      'Would you like to draw something together?'
    ],
    explanation: 'Showing interest in someone\'s creative work is a great way to start talking.',
    tips: [
      'Use specific compliments',
      'Ask about their creative process',
      'Share your own artistic interests'
    ]
  },
  {
    id: 'reading',
    situation: 'Someone is reading a book you\'ve read before.',
    emoji: '📚',
    topic: 'Books and reading',
    starterPhrases: [
      'I read that book too! What part do you like best?',
      'That\'s a good book! What chapter are you on?',
      'I enjoyed that story. What do you think about it?'
    ],
    followUpQuestions: [
      'What other books do you like?',
      'Do you like to read often?',
      'Would you like to talk about other books?'
    ],
    explanation: 'Sharing thoughts about a book you both know is a great conversation starter.',
    tips: [
      'Be specific about what you liked',
      'Ask about their favorite parts',
      'Share your own reading experiences'
    ]
  },
  {
    id: 'sports',
    situation: 'Someone is wearing a shirt with your favorite sports team.',
    emoji: '⚽',
    topic: 'Sports and teams',
    starterPhrases: [
      'I like that team too! Do you watch their games?',
      'That\'s my favorite team! What player do you like best?',
      'Cool shirt! Did you see their last game?'
    ],
    followUpQuestions: [
      'What other sports do you like?',
      'Do you play any sports?',
      'What\'s your favorite thing about this team?'
    ],
    explanation: 'Talking about shared interests in sports is a great way to connect with others.',
    tips: [
      'Show enthusiasm about the team',
      'Ask about their favorite players',
      'Share your own sports experiences'
    ]
  }
];

interface Level {
  number: number;
  scenarios: ConversationScenario[];
  requiredScore: number;
  description: string;
}

const levels: Level[] = [
  {
    number: 1,
    scenarios: scenarios.slice(0, 2),
    requiredScore: 2,
    description: 'Learn basic conversation starters'
  },
  {
    number: 2,
    scenarios: scenarios.slice(0, 3),
    requiredScore: 3,
    description: 'Practice more conversation topics'
  },
  {
    number: 3,
    scenarios: scenarios,
    requiredScore: 4,
    description: 'Master starting conversations'
  }
];

export default function ConversationStarter() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');

  const currentLevelScenarios = levels[currentLevel].scenarios;
  const currentScenarioData = currentLevelScenarios[currentScenario];

  const handleStarterClick = (phrase: string) => {
    if (showExplanation) return;

    if (currentScenarioData.starterPhrases.includes(phrase)) {
      setScore(prev => prev + 1);
      setMessage('Great job! That\'s a good way to start talking!');
      setCharacterExpression('😄');
      setCharacterPosition('bottom-4 left-4');
      playSound('success');
      toast.success('Excellent conversation starter!', {
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
      setMessage('Let\'s learn about better ways to start talking.');
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
          Conversation Starter Game
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
          <p className="text-lg text-gray-600">
            Topic: {currentScenarioData.topic}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {currentScenarioData.starterPhrases.map((phrase, index) => (
            <button
              key={index}
              onClick={() => handleStarterClick(phrase)}
              className={`p-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] ${
                showExplanation
                  ? 'bg-green-200'
                  : 'bg-blue-100 hover:bg-blue-200'
              }`}
            >
              {phrase}
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
            <div className="mt-4">
              <p className="font-semibold mb-2">Follow-up Questions:</p>
              <ul className="list-disc list-inside">
                {currentScenarioData.followUpQuestions.map((question, index) => (
                  <li key={index} className="text-yellow-800">{question}</li>
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