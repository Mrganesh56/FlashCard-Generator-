
import React from 'react';
import { Flashcard as FlashcardComponent } from './Flashcard';
import { Flashcard as FlashcardType } from '../types';
import { DownloadIcon, EmptyIcon } from './Icons';

interface FlashcardViewerProps {
  flashcards: FlashcardType[];
  isLoading: boolean;
  error: string | null;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ flashcards, isLoading, error }) => {
  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Question,Answer\n" 
      + flashcards.map(card => `"${card.question.replace(/"/g, '""')}","${card.answer.replace(/"/g, '""')}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "study-decks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Generating your study deck...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">The AI is hard at work. This might take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">Oops! Something went wrong.</p>
          <p className="text-sm text-red-500 dark:text-red-300 mt-2">{error}</p>
        </div>
      );
    }

    if (flashcards.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <EmptyIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Your Flashcards Will Appear Here</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Once you generate a deck, you can flip through your cards and download them.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flashcards.map(card => (
          <FlashcardComponent key={card.id} card={card} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full min-h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Generated Flashcards</h2>
        {flashcards.length > 0 && (
          <button
            onClick={downloadCSV}
            className="flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200 text-sm"
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download CSV
          </button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        {renderContent()}
      </div>
    </div>
  );
};
