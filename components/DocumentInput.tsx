import React, { useState, useCallback, useRef } from 'react';
import { GenerateIcon, UploadIcon, FileTextIcon, PdfIcon, WordIcon, CrossIcon } from './Icons';

interface DocumentInputProps {
  studyText: string;
  setStudyText: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isParsing: boolean;
  submittedText: string;
  onFileChange: (file: File | null) => void;
  fileName: string | null;
}

const getFileIcon = (fileName: string | null) => {
    if (!fileName) return <FileTextIcon className="h-6 w-6 text-gray-500" />;
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
            return <PdfIcon className="h-6 w-6 text-red-500" />;
        case 'docx':
            return <WordIcon className="h-6 w-6 text-blue-500" />;
        default:
            return <FileTextIcon className="h-6 w-6 text-gray-500" />;
    }
}


export const DocumentInput: React.FC<DocumentInputProps> = ({
  studyText,
  setStudyText,
  onGenerate,
  isLoading,
  isParsing,
  submittedText,
  onFileChange,
  fileName
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const loading = isLoading || isParsing;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Study Material</h2>
      
      {/* File Upload Section */}
      <div>
        <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            accept=".txt,.pdf,.docx"
        />
        {fileName ? (
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600">
                <div className="flex items-center overflow-hidden">
                    {getFileIcon(fileName)}
                    <span className="ml-3 font-medium text-sm truncate">{fileName}</span>
                </div>
                <button onClick={() => {
                    onFileChange(null);
                    if(fileInputRef.current) fileInputRef.current.value = "";
                }} className="p-1 text-gray-500 hover:text-red-500 dark:hover:text-red-400">
                    <CrossIcon className="h-5 w-5" />
                </button>
            </div>
        ) : (
            <div
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
            >
                <UploadIcon className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2"/>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-1">PDF, DOCX, or TXT</p>
            </div>
        )}
      </div>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-xs font-semibold">OR</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      <div className="flex-grow flex flex-col">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Paste your notes, textbook chapter, or any study document below.
        </p>
        <textarea
          value={studyText}
          onChange={(e) => {
              setStudyText(e.target.value);
              // Clear file if user starts typing
              if (fileName) {
                  onFileChange(null);
                  if(fileInputRef.current) fileInputRef.current.value = "";
              }
          }}
          placeholder="Paste your study notes here..."
          className="w-full flex-grow p-4 border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
          rows={8}
        />
        <button
          onClick={onGenerate}
          disabled={loading || !studyText.trim()}
          className="mt-4 w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isParsing ? 'Parsing Document...' : 'Generating...'}
            </>
          ) : (
             <>
              <GenerateIcon className="h-5 w-5 mr-2" />
              Generate Flashcards
            </>
          )}
        </button>
      </div>

       {submittedText && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Submitted Document:</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-gray-100 dark:bg-gray-700 rounded-md max-h-48 overflow-y-auto">
            <p className="whitespace-pre-wrap">{submittedText}</p>
          </div>
        </div>
      )}
    </div>
  );
};