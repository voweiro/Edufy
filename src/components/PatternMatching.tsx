'use client';

import { useState } from 'react';
import Link from 'next/link';
import CartoonCharacter from './CartoonCharacter';

const patterns = [
  { id: 'circle', name: 'Circle', icon: '⚪', color: 'bg-gradient-to-r from-red-400 to-red-600' },
  { id: 'square', name: 'Square', icon: '⬜', color: 'bg-gradient-to-r from-green-400 to-green-600' },
  { id: 'triangle', name: 'Triangle', icon: '🔺', color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  { id: 'star', name: 'Star', icon: '⭐', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
  { id: 'heart', name: 'Heart', icon: '❤️', color: 'bg-gradient-to-r from-pink-400 to-pink-600' },
  { id: 'diamond', name: 'Diamond', icon: '♦️', color: 'bg-gradient-to-r from-purple-400 to-purple-600' }
];

export default function PatternMatching() {
  const [currentPattern, setCurrentPattern] = useState(patterns[Math.floor(Math.random() * patterns.length)]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Match the pattern!');
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😐');

  const handleMatch = (selectedPattern: { id: string; name: string; icon: string; color: string; }) => {
    if (selectedPattern.id === currentPattern.id) {
      setScore(score + 1);
      setMessage('Great match!');
      setCharacterExpression('😄');
      setCharacterPosition('bottom-4 left-4');
      setCurrentPattern(patterns[Math.floor(Math.random() * patterns.length)]);
    } else {
      setMessage('Try again!');
      setCharacterExpression('😟');
      setCharacterPosition('top-4 right-4');
    }
  };

  return (
    <div className="game-container py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-primary">
          ← Back to Games
        </Link>
        <div className="text-2xl">Score: {score}</div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Match the Pattern!
        </h1>

        <div className="flex justify-center mb-12">
          <div className="text-8xl animate-bounce">{currentPattern.icon}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {patterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handleMatch(pattern)}
              className={`${pattern.color} p-6 rounded-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary]`}
            >
              <span className="text-3xl mb-2 block">{pattern.icon}</span>
              <span className="text-xl font-medium text-white">{pattern.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">
            Click on the pattern that matches the icon above!
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button className="btn-primary">
          Need Help?
        </button>
        <button className="btn-primary">
          Skip Question
        </button>
      </div>

      <CartoonCharacter message={message} position={characterPosition} expression={characterExpression} />
    </div>
  );
} 