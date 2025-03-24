'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface Card {
  id: string;
  emoji: string;
  category: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const allCards: Card[] = [
  // Animals
  { id: 'cat1', emoji: '🐱', category: 'Animals', isFlipped: false, isMatched: false },
  { id: 'cat2', emoji: '🐱', category: 'Animals', isFlipped: false, isMatched: false },
  { id: 'dog1', emoji: '🐕', category: 'Animals', isFlipped: false, isMatched: false },
  { id: 'dog2', emoji: '🐕', category: 'Animals', isFlipped: false, isMatched: false },
  // Food
  { id: 'apple1', emoji: '🍎', category: 'Food', isFlipped: false, isMatched: false },
  { id: 'apple2', emoji: '🍎', category: 'Food', isFlipped: false, isMatched: false },
  { id: 'banana1', emoji: '🍌', category: 'Food', isFlipped: false, isMatched: false },
  { id: 'banana2', emoji: '🍌', category: 'Food', isFlipped: false, isMatched: false },
  // Nature
  { id: 'sun1', emoji: '☀️', category: 'Nature', isFlipped: false, isMatched: false },
  { id: 'sun2', emoji: '☀️', category: 'Nature', isFlipped: false, isMatched: false },
  { id: 'moon1', emoji: '🌙', category: 'Nature', isFlipped: false, isMatched: false },
  { id: 'moon2', emoji: '🌙', category: 'Nature', isFlipped: false, isMatched: false },
  // Vehicles
  { id: 'car1', emoji: '🚗', category: 'Vehicles', isFlipped: false, isMatched: false },
  { id: 'car2', emoji: '🚗', category: 'Vehicles', isFlipped: false, isMatched: false },
  { id: 'bus1', emoji: '🚌', category: 'Vehicles', isFlipped: false, isMatched: false },
  { id: 'bus2', emoji: '🚌', category: 'Vehicles', isFlipped: false, isMatched: false }
];

interface Level {
  number: number;
  cards: Card[];
  requiredMatches: number;
  description: string;
  timeLimit?: number;
  gridSize: '2x2' | '3x3' | '4x4';
}

const levels: Level[] = [
  {
    number: 1,
    cards: allCards.slice(0, 4),
    requiredMatches: 2,
    description: 'Match 2 pairs of cards!',
    gridSize: '2x2'
  },
  {
    number: 2,
    cards: allCards.slice(0, 8),
    requiredMatches: 4,
    description: 'Match 4 pairs of cards!',
    gridSize: '3x3'
  },
  {
    number: 3,
    cards: allCards.slice(0, 12),
    requiredMatches: 6,
    description: 'Match 6 pairs of cards!',
    gridSize: '3x3'
  },
  {
    number: 4,
    cards: allCards,
    requiredMatches: 8,
    description: 'Match all 8 pairs of cards!',
    gridSize: '4x4'
  },
  {
    number: 5,
    cards: allCards,
    requiredMatches: 8,
    description: 'Match all pairs faster!',
    timeLimit: 60,
    gridSize: '4x4'
  },
  {
    number: 6,
    cards: allCards,
    requiredMatches: 8,
    description: 'Master level - complete quickly!',
    timeLimit: 45,
    gridSize: '4x4'
  }
];

export default function MemoryMatch() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matches, setMatches] = useState(0);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize cards for current level
    const levelCards = [...levels[currentLevel].cards]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, isFlipped: false, isMatched: false }));
    setCards(levelCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setTimeLeft(levels[currentLevel].timeLimit || null);
  }, [currentLevel]);

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
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      const [card1, card2] = flippedCards;
      
      if (card1.emoji === card2.emoji) {
        // Match found
        setCards(prevCards => 
          prevCards.map(card => 
            card.id === card1.id || card.id === card2.id
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatches(prev => prev + 1);
        setMessage('Great job! Keep going!');
        setCharacterExpression('😄');
        setCharacterPosition('bottom-4 left-4');
        playSound('success');
        toast.success('Match Found!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          className: 'bg-green-500 text-white font-bold text-lg rounded-lg shadow-lg',
        });

        if (matches + 1 >= levels[currentLevel].requiredMatches) {
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
        // No match
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === card1.id || card.id === card2.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setMessage('Try again!');
          setCharacterExpression('😟');
          setCharacterPosition('top-4 right-4');
          playSound('failure');
          toast.error('No Match!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            className: 'bg-red-500 text-white font-bold text-lg rounded-lg shadow-lg',
          });
        }, 1000);
      }
      setFlippedCards([]);
      setIsProcessing(false);
    }
  }, [flippedCards, matches, currentLevel]);

  const handleCardClick = (card: Card) => {
    if (isProcessing || card.isFlipped || card.isMatched) return;
    
    setMoves(prev => prev + 1);
    setCards(prevCards => 
      prevCards.map(c => 
        c.id === card.id ? { ...c, isFlipped: true } : c
      )
    );
    setFlippedCards(prev => [...prev, card]);
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setMessage(levels[currentLevel + 1].description);
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 right-4');
      setShowLevelComplete(false);
    }
  };

  const handleResetLevel = () => {
    const levelCards = [...levels[currentLevel].cards]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, isFlipped: false, isMatched: false }));
    setCards(levelCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setMessage(levels[currentLevel].description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
    setShowLevelComplete(false);
    setTimeLeft(levels[currentLevel].timeLimit || null);
  };

  const getGridClass = () => {
    switch (levels[currentLevel].gridSize) {
      case '2x2':
        return 'grid-cols-2';
      case '3x3':
        return 'grid-cols-3';
      case '4x4':
        return 'grid-cols-4';
      default:
        return 'grid-cols-4';
    }
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
          <div className="text-2xl">Level {currentLevel + 1}/6</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Memory Match Game
        </h1>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Progress</span>
            <span className="text-lg font-semibold">{matches}/{levels[currentLevel].requiredMatches}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(matches / levels[currentLevel].requiredMatches) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-4 text-center">
          <span className="text-lg font-semibold">Moves: {moves}</span>
        </div>

        <div className={`grid ${getGridClass()} gap-4 mb-8`}>
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`aspect-square rounded-lg text-4xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] ${
                card.isFlipped || card.isMatched
                  ? 'bg-blue-200'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
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