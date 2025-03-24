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
  category: 'circle' | 'square' | 'triangle' | 'star';
}

const shapes: Shape[] = [
  { id: 'circle1', name: 'Circle', emoji: '⭕', category: 'circle' },
  { id: 'circle2', name: 'Circle', emoji: '⭕', category: 'circle' },
  { id: 'square1', name: 'Square', emoji: '⬜', category: 'square' },
  { id: 'square2', name: 'Square', emoji: '⬜', category: 'square' },
  { id: 'triangle1', name: 'Triangle', emoji: '🔺', category: 'triangle' },
  { id: 'triangle2', name: 'Triangle', emoji: '🔺', category: 'triangle' },
  { id: 'star1', name: 'Star', emoji: '⭐', category: 'star' },
  { id: 'star2', name: 'Star', emoji: '⭐', category: 'star' },
];

const categories = [
  { id: 'circle', name: 'Circles', emoji: '⭕' },
  { id: 'square', name: 'Squares', emoji: '⬜' },
  { id: 'triangle', name: 'Triangles', emoji: '🔺' },
  { id: 'star', name: 'Stars', emoji: '⭐' },
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
  category: typeof categories[0], 
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
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Sort the shapes into their correct categories!');
  const [characterPosition, setCharacterPosition] = useState('bottom-4 right-4');
  const [characterExpression, setCharacterExpression] = useState('😊');
  const [remainingShapes, setRemainingShapes] = useState<Shape[]>(shapes);
  const [sortedShapes, setSortedShapes] = useState<Record<string, Shape[]>>({
    circle: [],
    square: [],
    triangle: [],
    star: [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const activeShape = activeId ? remainingShapes.find(s => s.id === activeId) : null;

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
          Shape Sorting Game
        </h1>

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
              {categories.map((category) => (
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
            Drag and drop each shape into its matching category!
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button 
          className="btn-primary"
          onClick={() => {
            setRemainingShapes(shapes);
            setSortedShapes({
              circle: [],
              square: [],
              triangle: [],
              star: [],
            });
            setScore(0);
            setMessage('Start sorting the shapes!');
            setCharacterExpression('😊');
            setCharacterPosition('bottom-4 right-4');
          }}
        >
          Reset Game
        </button>
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