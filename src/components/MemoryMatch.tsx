'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Level {
  number: number;
  pairs: number;
  description: string;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const levels: Level[] = [
  {
    number: 1,
    pairs: 4,
    description: 'Match 4 pairs of cards!',
    difficulty: 'easy'
  },
  {
    number: 2,
    pairs: 6,
    description: 'Match 6 pairs of cards!',
    difficulty: 'easy'
  },
  {
    number: 3,
    pairs: 8,
    description: 'Match 8 pairs of cards!',
    difficulty: 'easy'
  },
  {
    number: 4,
    pairs: 10,
    description: 'Match 10 pairs of cards!',
    difficulty: 'medium'
  },
  {
    number: 5,
    pairs: 12,
    description: 'Match 12 pairs of cards!',
    difficulty: 'medium'
  },
  {
    number: 6,
    pairs: 14,
    description: 'Match 14 pairs of cards!',
    difficulty: 'medium'
  },
  {
    number: 7,
    pairs: 16,
    description: 'Match 16 pairs of cards!',
    timeLimit: 60,
    difficulty: 'hard'
  },
  {
    number: 8,
    pairs: 18,
    description: 'Master level - match 18 pairs!',
    timeLimit: 45,
    difficulty: 'hard'
  }
];

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'];

export default function MemoryMatch() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

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

  const initializeLevel = () => {
    const levelEmojis = emojis.slice(0, levels[currentLevel].pairs);
    const newCards = [...levelEmojis, ...levelEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setMessage(levels[currentLevel].description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
    setShowLevelComplete(false);
    setIsLevelComplete(false);
    setTimeLeft(levels[currentLevel].timeLimit || null);
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

  const handleCardClick = (card: Card) => {
    if (isLevelComplete || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newCards = cards.map(c => 
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, card]);

    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      const firstCard = flippedCards[0];
      
      if (firstCard.emoji === card.emoji) {
        // Match found
        const updatedCards = newCards.map(c => 
          c.id === firstCard.id || c.id === card.id ? { ...c, isMatched: true } : c
        );
        setCards(updatedCards);
        setFlippedCards([]);
        
        const newMatchedPairs = matchedPairs + 1;
        setMatchedPairs(newMatchedPairs);
        
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

        // Check if level is complete
        if (newMatchedPairs === levels[currentLevel].pairs) {
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
        }
      } else {
        // No match
        setTimeout(() => {
          const resetCards = newCards.map(c => 
            c.id === firstCard.id || c.id === card.id ? { ...c, isFlipped: false } : c
          );
          setCards(resetCards);
          setFlippedCards([]);
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
        }, 1000);
      }
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
          Memory Match Game
        </h1>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Progress</span>
            <span className="text-lg font-semibold">{matchedPairs}/{levels[currentLevel].pairs}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(matchedPairs / levels[currentLevel].pairs) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`aspect-square text-4xl rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] ${
                card.isFlipped || card.isMatched
                  ? 'bg-blue-100'
                  : 'bg-gray-100 hover:bg-gray-200'
              } ${isLevelComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLevelComplete}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
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