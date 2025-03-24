'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import CartoonCharacter from './CartoonCharacter';

const numbers = [
  { id: 1, name: 'One', icon: '🚗' },
  { id: 2, name: 'Two', icon: '🚗🚗' },
  { id: 3, name: 'Three', icon: '🚗🚗🚗' },
  { id: 4, name: 'Four', icon: '🚗🚗🚗🚗' },
  { id: 5, name: 'Five', icon: '🌟🌟🌟🌟🌟' },
  { id: 6, name: 'Six', icon: '🌟🌟🌟🌟🌟🌟' },
  { id: 7, name: 'Seven', icon: '🐶🐶🐶🐶🐶🐶🐶' },
  { id: 8, name: 'Eight', icon: '🐶🐶🐶🐶🐶🐶🐶🐶' },
  { id: 9, name: 'Nine', icon: '🍕🍕🍕🍕🍕🍕🍕🍕🍕' },
  { id: 10, name: 'Ten', icon: '🍕🍕🍕🍕🍕🍕🍕🍕🍕' }
];

const totalQuestions = 10;

export default function NumberCounting() {
  const [currentNumber, setCurrentNumber] = useState(numbers[Math.floor(Math.random() * numbers.length)]);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [message, setMessage] = useState('Count the items and select the correct number!');
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('��');

  const handleNumberSelection = (selectedNumberId: number) => {
    if (selectedNumberId === currentNumber.id) {
      setScore(score + 1);
      setMessage('Great job! Keep going!');
      setCharacterExpression('😺');
      setCharacterPosition('bottom-4 left-4');
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
      setMessage('Oops! Try again!');
      setCharacterExpression('😿');
      setCharacterPosition('top-4 right-4');
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
  };

  const handleNextQuestion = () => {
    if (questionNumber < totalQuestions) {
      setQuestionNumber(questionNumber + 1);
      setCurrentNumber(numbers[Math.floor(Math.random() * numbers.length)]);
      setMessage('Count the items and select the correct number!');
    } else {
      setMessage('You have completed all questions! Well done!');
      toast.info('You have completed all questions!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        className: 'bg-blue-500 text-white font-bold text-lg rounded-lg shadow-lg',
      });
    }
  };

  return (
    <div className="game-container py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-primary">
          ← Back to Home
        </Link>
        <div className="text-2xl">Score: {score}</div>
        <div className="text-2xl">Question: {questionNumber}/{totalQuestions}</div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Count the Items!
        </h1>

        <div className="flex justify-center mb-8">
          <div className="text-6xl">{currentNumber.icon}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {numbers.map((number) => (
            <button
              key={number.id}
              onClick={() => handleNumberSelection(number.id)}
              className="p-6 rounded-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary] hover:bg-gray-200"
            >
              <span className="text-xl font-medium text-gray-800">{number.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="btn-primary" onClick={handleNextQuestion}>
            Next
          </button>
        </div>
      </div>

      <CartoonCharacter message={message} position={characterPosition} expression={characterExpression} />
    </div>
  );
} 