import React, { useState } from 'react';
import { Flashcard as FlashcardType } from '../types';

interface FlashcardProps {
  card: FlashcardType;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`flashcard w-full h-56 perspective-1000 cursor-pointer group ${isFlipped ? 'flipped' : ''}`}
      onClick={handleFlip}
      aria-roledescription="flashcard"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFlip()}
    >
      <div className="flashcard-inner relative w-full h-full">
        {/* Front of the card */}
        <div 
          className="flashcard-front absolute w-full h-full bg-sky-500 rounded-lg shadow-lg p-4 flex flex-col justify-center items-center text-white"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}
        >
          <p className="text-center font-semibold text-lg">{card.question}</p>
          <span className="absolute bottom-2 right-3 text-xs opacity-70 group-hover:opacity-100 transition-opacity">Click to flip</span>
        </div>
        {/* Back of the card */}
        <div className="flashcard-back absolute w-full h-full bg-slate-100 dark:bg-slate-700 rounded-lg shadow-lg p-4 flex flex-col justify-center items-center text-slate-800 dark:text-slate-200">
          <p className="text-center">{card.answer}</p>
           <span className="absolute bottom-2 right-3 text-xs text-gray-500 dark:text-gray-400 group-hover:opacity-100 transition-opacity">Click to flip</span>
        </div>
      </div>
    </div>
  );
};
