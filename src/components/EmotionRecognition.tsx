'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';

const emotions = [
  { id: 'happy', name: 'Happy', emoji: '😊', color: 'bg-yellow-100' },
  { id: 'sad', name: 'Sad', emoji: '😢', color: 'bg-blue-100' },
  { id: 'angry', name: 'Angry', emoji: '😠', color: 'bg-red-100' },
  { id: 'surprised', name: 'Surprised', emoji: '😮', color: 'bg-purple-100' }
];

export default function EmotionRecognition() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState(emotions[Math.floor(Math.random() * emotions.length)]);
  const [message, setMessage] = useState('Identify the emotion!');
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😐');

  const handleAnswer = (selectedEmotion: { id: string; name: string; emoji: string; color: string; }) => {
    if (selectedEmotion.id === currentEmotion.id) {
      setScore(score + 1);
      setMessage('Correct! Well done!');
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 left-4');
    } else {
      setMessage('Try again!');
      setCharacterExpression('😟');
      setCharacterPosition('top-4 right-4');
    }
    if (currentQuestion < 14) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    } else {
      toast.success(`Game Over! Your score is ${score + 1}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'bg-green-500 text-white font-bold text-lg rounded-lg shadow-lg',
      });
    }
  };

  return (
    <div className="game-container py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-primary">
          ← Back to Games
        </Link>
        <div className="text-2xl">Score: {score}</div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          What emotion is this?
        </h1>

        <div className="flex justify-center mb-12">
          <div className="text-8xl">{currentEmotion.emoji}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {emotions.map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => handleAnswer(emotion)}
              className={`${emotion.color} p-6 rounded-lg text-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary]`}
            >
              <span className="text-3xl mb-2 block">{emotion.emoji}</span>
              <span className="text-xl font-medium">{emotion.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">
            Click on the emotion that matches the face above!
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