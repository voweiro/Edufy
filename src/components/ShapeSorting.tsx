'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  useSensor, 
  useSensors, 
  PointerSensor,
  DragOverlay,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartoonCharacter from './CartoonCharacter';
import { playSound } from '../utils/sound';

interface Shape {
  id: string;
  name: string;
  emoji: string;
  category: 'circle' | 'square' | 'triangle' | 'star' | 'diamond' | 'heart';
}

const allShapes: Shape[] = [
  { id: 'circle1', name: 'Circle', emoji: '⭕', category: 'circle' },
  { id: 'circle2', name: 'Circle', emoji: '⭕', category: 'circle' },
  { id: 'square1', name: 'Square', emoji: '⬜', category: 'square' },
  { id: 'square2', name: 'Square', emoji: '⬜', category: 'square' },
  { id: 'triangle1', name: 'Triangle', emoji: '🔺', category: 'triangle' },
  { id: 'triangle2', name: 'Triangle', emoji: '🔺', category: 'triangle' },
  { id: 'star1', name: 'Star', emoji: '⭐', category: 'star' },
  { id: 'star2', name: 'Star', emoji: '⭐', category: 'star' },
  { id: 'diamond1', name: 'Diamond', emoji: '💎', category: 'diamond' },
  { id: 'diamond2', name: 'Diamond', emoji: '💎', category: 'diamond' },
  { id: 'heart1', name: 'Heart', emoji: '❤️', category: 'heart' },
  { id: 'heart2', name: 'Heart', emoji: '❤️', category: 'heart' },
];

const allCategories = [
  { id: 'circle', name: 'Circles', emoji: '⭕' },
  { id: 'square', name: 'Squares', emoji: '⬜' },
  { id: 'triangle', name: 'Triangles', emoji: '🔺' },
  { id: 'star', name: 'Stars', emoji: '⭐' },
  { id: 'diamond', name: 'Diamonds', emoji: '💎' },
  { id: 'heart', name: 'Hearts', emoji: '❤️' },
];

interface Level {
  number: number;
  shapes: Shape[];
  categories: typeof allCategories;
  requiredScore: number;
  description: string;
}

const levels: Level[] = [
  {
    number: 1,
    shapes: allShapes.filter(s => s.category === 'circle' || s.category === 'square'),
    categories: allCategories.filter(c => c.id === 'circle' || c.id === 'square'),
    requiredScore: 4,
    description: 'Sort circles and squares!'
  },
  {
    number: 2,
    shapes: allShapes.filter(s => s.category === 'circle' || s.category === 'square' || s.category === 'triangle'),
    categories: allCategories.filter(c => c.id === 'circle' || c.id === 'square' || c.id === 'triangle'),
    requiredScore: 6,
    description: 'Add triangles to the mix!'
  },
  {
    number: 3,
    shapes: allShapes.filter(s => s.category === 'circle' || s.category === 'square' || s.category === 'triangle' || s.category === 'star'),
    categories: allCategories.filter(c => c.id === 'circle' || c.id === 'square' || c.id === 'triangle' || c.id === 'star'),
    requiredScore: 8,
    description: 'Now with stars!'
  },
  {
    number: 4,
    shapes: allShapes.filter(s => s.category === 'circle' || s.category === 'square' || s.category === 'triangle' || s.category === 'star' || s.category === 'diamond'),
    categories: allCategories.filter(c => c.id === 'circle' || c.id === 'square' || c.id === 'triangle' || c.id === 'star' || c.id === 'diamond'),
    requiredScore: 10,
    description: 'Add diamonds to the challenge!'
  },
  {
    number: 5,
    shapes: allShapes.filter(s => s.category === 'circle' || s.category === 'square' || s.category === 'triangle' || s.category === 'star' || s.category === 'diamond' || s.category === 'heart'),
    categories: allCategories,
    requiredScore: 12,
    description: 'All shapes together!'
  },
  {
    number: 6,
    shapes: allShapes,
    categories: allCategories,
    requiredScore: 14,
    description: 'More shapes to sort!'
  },
  {
    number: 7,
    shapes: [...allShapes, ...allShapes.slice(0, 4)], // Add extra shapes
    categories: allCategories,
    requiredScore: 16,
    description: 'Extra shapes challenge!'
  },
  {
    number: 8,
    shapes: [...allShapes, ...allShapes], // Double the shapes
    categories: allCategories,
    requiredScore: 20,
    description: 'Master level!'
  }
];

function DraggableShape({ shape }: { shape: Shape }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: shape.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white p-4 rounded-lg shadow-md cursor-move hover:shadow-lg transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="text-4xl text-center">{shape.emoji}</div>
      <div className="text-center mt-2 font-medium">{shape.name}</div>
    </div>
  );
}

function DroppableCategory({ 
  category, 
  children 
}: { 
  category: typeof allCategories[0], 
  children: React.ReactNode 
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-6 min-h-[200px] transition-colors ${
        isOver ? 'bg-gray-100' : ''
      }`}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">{category.emoji}</span>
        {category.name}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {children}
      </div>
    </div>
  );
}

export default function ShapeSorting() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(levels[0].description);
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [remainingShapes, setRemainingShapes] = useState<Shape[]>(levels[0].shapes);
  const [sortedShapes, setSortedShapes] = useState<Record<string, Shape[]>>({
    circle: [],
    square: [],
    triangle: [],
    star: [],
    diamond: [],
    heart: [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const shape = remainingShapes.find(s => s.id === active.id);
    const category = over.id as Shape['category'];

    if (!shape) return;

    if (shape.category === category) {
      setScore(score + 1);
      setMessage('Great job! Keep going!');
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
      
      setSortedShapes(prev => ({
        ...prev,
        [category]: [...prev[category], shape],
      }));
      setRemainingShapes(prev => prev.filter(s => s.id !== shape.id));

      // Check if level is complete
      if (score + 1 >= levels[currentLevel].requiredScore) {
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
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setScore(0);
      setMessage(levels[currentLevel + 1].description);
      setCharacterExpression('😊');
      setCharacterPosition('bottom-4 right-4');
      setRemainingShapes(levels[currentLevel + 1].shapes);
      setSortedShapes(
        Object.fromEntries(levels[currentLevel + 1].categories.map(c => [c.id, []]))
      );
      setShowLevelComplete(false);
    }
  };

  const handleResetLevel = () => {
    setScore(0);
    setMessage(levels[currentLevel].description);
    setCharacterExpression('😊');
    setCharacterPosition('bottom-4 right-4');
    setRemainingShapes(levels[currentLevel].shapes);
    setSortedShapes(
      Object.fromEntries(levels[currentLevel].categories.map(c => [c.id, []]))
    );
    setShowLevelComplete(false);
  };

  const activeShape = activeId ? remainingShapes.find(s => s.id === activeId) : null;

  return (
    <div className="game-container py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-primary">
          ← Back to Games
        </Link>
        <div className="text-2xl">Level {currentLevel + 1}/8</div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Shape Sorting Game
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

        <DndContext 
          sensors={sensors} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Remaining Shapes */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Drag these shapes:</h2>
              <div className="grid grid-cols-2 gap-4">
                {remainingShapes.map((shape) => (
                  <DraggableShape key={shape.id} shape={shape} />
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-4">
              {levels[currentLevel].categories.map((category) => (
                <DroppableCategory key={category.id} category={category}>
                  {sortedShapes[category.id].map((shape) => (
                    <div
                      key={shape.id}
                      className="bg-white p-3 rounded-lg shadow-sm"
                    >
                      <div className="text-3xl text-center">{shape.emoji}</div>
                    </div>
                  ))}
                </DroppableCategory>
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeShape ? (
              <div className="bg-white p-4 rounded-lg shadow-lg cursor-move">
                <div className="text-4xl text-center">{activeShape.emoji}</div>
                <div className="text-center mt-2 font-medium">{activeShape.name}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

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