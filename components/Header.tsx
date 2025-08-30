
import React from 'react';
import { BookIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <BookIcon className="h-8 w-8 text-indigo-500 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Study Decks
        </h1>
        <span className="ml-2 text-indigo-500 font-semibold">AI Flashcard Generator</span>
      </div>
    </header>
  );
};
