import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DocumentInput } from './components/DocumentInput';
import { FlashcardViewer } from './components/FlashcardViewer';
import { generateFlashcardsFromText } from './services/geminiService';
import { Flashcard as FlashcardType } from './types';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';


// Configure PDF.js worker from a CDN to enable PDF parsing
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.mjs`;

// --- File Parsing Logic ---

async function parseTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject('Error reading text file.');
    reader.readAsText(file);
  });
}

async function parsePdfFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument(arrayBuffer).promise;
  let textContent = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    // Manually join text items, filtering out potential type errors.
    textContent += text.items.map(item => (item as any).str || '').join(' ');
    textContent += '\n'; // Add newline between pages for readability
  }
  return textContent;
}

async function parseDocxFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function parseFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return parseTextFile(file);
  } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return parsePdfFile(file);
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
    return parseDocxFile(file);
  } else {
    throw new Error(`Unsupported file type. Please upload a .txt, .pdf, or .docx file.`);
  }
}

// --- App Component ---

const App: React.FC = () => {
  const [studyText, setStudyText] = useState<string>('');
  const [submittedText, setSubmittedText] = useState<string>('');
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback(async (file: File | null) => {
    // Reset state when file is cleared
    if (!file) {
      setStudyText('');
      setFileName(null);
      setSubmittedText('');
      setFlashcards([]);
      setError(null);
      return;
    }

    setIsParsing(true);
    setError(null);
    setFlashcards([]);
    setStudyText('');
    setFileName(file.name);

    try {
      const text = await parseFile(file);
      setStudyText(text);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to parse the file.');
      setFileName(null); // Clear filename on error
    } finally {
      setIsParsing(false);
    }
  }, []);


  const handleGenerate = useCallback(async () => {
    if (!studyText.trim()) {
      setError('Please enter some text or upload a document to generate flashcards from.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFlashcards([]);
    setSubmittedText(studyText);

    try {
      const generatedCards = await generateFlashcardsFromText(studyText);
      setFlashcards(generatedCards);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [studyText]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DocumentInput
            studyText={studyText}
            setStudyText={setStudyText}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            isParsing={isParsing}
            submittedText={submittedText}
            onFileChange={handleFileChange}
            fileName={fileName}
          />
          <FlashcardViewer
            flashcards={flashcards}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
        <p>Powered by Google Gemini. Designed for modern learning.</p>
      </footer>
    </div>
  );
};

export default App;
