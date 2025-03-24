'use client';

import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { create } from 'zustand';

type Routine = { id: string; name: string; icon: string; color: string };

const routines: Routine[] = [
  { id: 'wake-up', name: 'Wake Up', icon: '⏰', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
  { id: 'brush-teeth', name: 'Brush Teeth', icon: '🪥', color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  { id: 'breakfast', name: 'Breakfast', icon: '🍳', color: 'bg-gradient-to-r from-orange-400 to-orange-600' },
  { id: 'school', name: 'Go to School', icon: '🏫', color: 'bg-gradient-to-r from-green-400 to-green-600' },
  { id: 'homework', name: 'Homework', icon: '📚', color: 'bg-gradient-to-r from-purple-400 to-purple-600' },
  { id: 'dinner', name: 'Dinner', icon: '🍽️', color: 'bg-gradient-to-r from-red-400 to-red-600' }
];

function shuffleArray(array: Routine[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Define the store using zustand
const useRoutineStore = create<{
  routineOrder: Routine[];
  score: number;
  setRoutineOrder: (newOrder: Routine[]) => void;
  incrementScore: () => void;
}>((set) => ({
  routineOrder: shuffleArray([...routines]),
  score: 0,
  setRoutineOrder: (newOrder) => set({ routineOrder: newOrder }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
}));

// Add a function to reset the game
const resetGame = () => {
  useRoutineStore.getState().setRoutineOrder(shuffleArray([...routines]));
  // Optionally reset the score if needed
  // useRoutineStore.getState().setScore(0);
};

export default function DailyRoutines() {
  const { routineOrder, score, setRoutineOrder, incrementScore } = useRoutineStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !over.id || active.id === over.id) return;
    const oldIndex = routineOrder.findIndex((routine: Routine) => routine.id === active.id);
    const newIndex = routineOrder.findIndex((routine: Routine) => routine.id === over.id);
    const items = Array.from(routineOrder);
    const [reorderedItem] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, reorderedItem);
    setRoutineOrder(items);

    // Check if the current order matches the original order
    const isCorrectOrder = items.every((routine, index) => routine.id === routines[index].id);

    if (isCorrectOrder) {
      incrementScore();
      toast.success('Correct Order!', {
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
      toast.info('Keep trying!', {
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
          ← Back to Games
        </Link>
        <div className="text-2xl">Score: {score}</div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Arrange the Daily Routine in the Correct Order!
        </h1>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routineOrder.map((routine: Routine) => (
              <DroppableContainer key={routine.id} id={routine.id}>
                <DraggableItem routine={routine} />
              </DroppableContainer>
            ))}
          </div>
        </DndContext>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">
            Drag and drop the activities to arrange them in the correct order!
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button className="btn-primary" onClick={resetGame}>
          Next Question
        </button>
        <button className="btn-primary">
          Need Help?
        </button>
        <button className="btn-primary">
          Skip Question
        </button>
      </div>
    </div>
  );
}

function DroppableContainer({ children, id }: { children: React.ReactNode; id: string }) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}

function DraggableItem({ routine }: { routine: { id: string; name: string; icon: string; color: string } }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: routine.id });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${routine.color} p-6 rounded-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[--primary]`}
    >
      <span className="text-3xl mb-2 block">{routine.icon}</span>
      <span className="text-xl font-medium text-white">{routine.name}</span>
    </div>
  );
} 