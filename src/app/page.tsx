"use client"

import Link from 'next/link';
import CartoonCharacter from '../components/CartoonCharacter';
import SoundControl from '../components/SoundControl';
import { playSound } from '../utils/sound';
import { useEffect, useState } from 'react';

const gameCategories = [
  {
    id: 'emotions',
    title: 'Emotion Recognition',
    description: 'Learn to identify and understand different emotions through facial expressions',
    color: 'bg-gradient-to-r from-blue-400 to-blue-600',
    icon: '😊',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'patterns',
    title: 'Pattern Matching',
    description: 'Match similar objects and patterns to improve cognitive skills',
    color: 'bg-gradient-to-r from-green-400 to-green-600',
    icon: '🔄',
    bgColor: 'bg-green-50'
  },
  {
    id: 'routines',
    title: 'Daily Routines',
    description: 'Learn about daily activities and their proper sequence',
    color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    icon: '📅',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'sounds',
    title: 'Sound Recognition',
    description: 'Identify different sounds and their meanings',
    color: 'bg-gradient-to-r from-purple-400 to-purple-600',
    icon: '🔊',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'numbers',
    title: 'Number Counting',
    description: 'Count the objects and select the correct number',
    color: 'bg-gradient-to-r from-red-400 to-red-600',
    icon: '🔢',
    bgColor: 'bg-red-50'
  },
  {
    id: 'colors',
    title: 'Color Matching',
    description: 'Learn colors by matching them with their names and emojis',
    color: 'bg-gradient-to-r from-pink-400 to-pink-600',
    icon: '🎨',
    bgColor: 'bg-pink-50'
  },
  {
    id: 'shapes',
    title: 'Shape Sorting',
    description: 'Sort different shapes into their matching categories',
    color: 'bg-gradient-to-r from-indigo-400 to-indigo-600',
    icon: '🔷',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'words',
    title: 'Word Association',
    description: 'Learn word relationships and associations through fun matching',
    color: 'bg-gradient-to-r from-orange-400 to-orange-600',
    icon: '📝',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Improve memory and pattern recognition with card matching',
    color: 'bg-gradient-to-r from-teal-400 to-teal-600',
    icon: '🧠',
    bgColor: 'bg-teal-50'
  }
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGameClick = () => {
    if (isClient) {
      playSound('click');
      playSound('gameStart');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {isClient && <SoundControl />}
      <div className="game-container py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 animate-fade-in">
            Welcome to Edufy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a fun game to play and learn! Each game is designed to help children develop important skills in an engaging way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {gameCategories.map((category) => (
            <Link 
              key={category.id}
              href={`/games/${category.id}`}
              className={`game-card ${category.bgColor} group relative overflow-hidden`}
              onClick={handleGameClick}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-6">
                <div className={`w-20 h-20 rounded-full ${category.color} flex items-center justify-center text-5xl transform group-hover:scale-110 transition-transform duration-300`}>
                  <span className="animate-bounce">{category.icon}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {category.title}
                  </h2>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <button 
            className="btn-primary bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            onClick={handleGameClick}
          >
            Start with Recommended Game
          </button>
        </div>

        <CartoonCharacter 
          message="Click on a game to start playing!" 
          position="bottom-4 right-4"
          expression="😊"
        />
      </div>
    </div>
  );
}
