"use client"


import Link from 'next/link';
import CartoonCharacter from '../components/CartoonCharacter';

const gameCategories = [
  {
    id: 'emotions',
    title: 'Emotion Recognition',
    description: 'Learn to identify and understand different emotions through facial expressions',
    color: 'bg-gradient-to-r from-blue-400 to-blue-600',
    icon: '😊'
  },
  {
    id: 'patterns',
    title: 'Pattern Matching',
    description: 'Match similar objects and patterns to improve cognitive skills',
    color: 'bg-gradient-to-r from-green-400 to-green-600',
    icon: '🔄'
  },
  {
    id: 'routines',
    title: 'Daily Routines',
    description: 'Learn about daily activities and their proper sequence',
    color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    icon: '📅'
  },
  {
    id: 'sounds',
    title: 'Sound Recognition',
    description: 'Identify different sounds and their meanings',
    color: 'bg-gradient-to-r from-purple-400 to-purple-600',
    icon: '🔊'
  },
  {
    id: 'numbers',
    title: 'Number Counting',
    description: 'Count the objects and select the correct number',
    color: 'bg-gradient-to-r from-red-400 to-red-600',
    icon: '🔢'
  }
];

function playClickSound() {
  const clickSound = new Audio('/sounds/click-sound.mp3');
  clickSound.play();
}

export default function Home() {
  return (
    <div className="game-container py-12 px-4 sm:px-6 lg:px-8">
      <audio src="/sounds/background-music.mp3" autoPlay loop />
      <h1 className="text-5xl font-extrabold text-center mb-10 text-gray-800">Welcome to Edufy</h1>
      <p className="text-center text-xl mb-16 text-gray-600">
        Choose a fun game to play and learn!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {gameCategories.map((category) => (
          <Link 
            key={category.id}
            href={`/games/${category.id}`}
            className={`game-card ${category.color} border-2 border-transparent hover:border-[--primary] transition-transform transform hover:scale-110 shadow-2xl rounded-lg p-6 hover:shadow-[--primary]`}
            onClick={playClickSound}
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl animate-pulse">{category.icon}</span>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">{category.title}</h2>
                <p className="text-white text-opacity-90">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button className="btn-primary bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50" onClick={playClickSound}>
          Start with Recommended Game
        </button>
      </div>

      <CartoonCharacter message="Click on a game to start playing!" />
    </div>
  );
}
