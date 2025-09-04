
import React, { useState, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { analyzeConversation } from './services/geminiService';
import type { AnalysisResult, ConversationTurn } from './types';
import ConversationControls from './components/ConversationControls';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import AnalysisResults from './components/AnalysisResults';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    error: speechError,
    resetTranscript,
    hasRecognitionSupport
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      const newTurn: ConversationTurn = {
        speaker: 'You',
        text: transcript,
        timestamp: Date.now(),
      };
      
      setConversation(prev => {
          if (prev.length > 0 && prev[prev.length - 1].speaker === 'You') {
              const updated = [...prev];
              updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  text: transcript,
                  timestamp: Date.now()
              };
              return updated;
          }
          return [...prev, newTurn];
      });
    }
  }, [transcript]);

  useEffect(() => {
    if (speechError) {
        setError(`Speech Recognition Error: ${speechError}`);
    }
  }, [speechError]);
  
  const handleStart = () => {
    handleReset();
    startListening();
  };

  const handleStop = () => {
    stopListening();
  };
  
  const handleReset = useCallback(() => {
      stopListening();
      resetTranscript();
      setConversation([]);
      setAnalysis(null);
      setError(null);
      setIsLoading(false);
  }, [stopListening, resetTranscript]);

  const handleAnalyze = async () => {
    if (conversation.length === 0) {
      setError("There's nothing to analyze. Please record a conversation first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const fullTranscript = conversation.map(turn => turn.text).join(' ');
    
    try {
      const result = await analyzeConversation(fullTranscript, conversation.length > 0 ? (conversation[conversation.length - 1].timestamp - conversation[0].timestamp) / 1000 : 0);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? `Analysis failed: ${e.message}` : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <main className="container mx-auto max-w-4xl p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            AI Conversation Coach
          </h1>
          <p className="text-slate-400 mt-2">
            Record your speech, get real-time transcription, and receive instant AI-powered feedback.
          </p>
        </header>

        {!hasRecognitionSupport && (
            <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Browser Not Supported:</strong>
                <span className="block sm:inline"> Your browser does not support the Web Speech API. Please try Chrome or Edge.</span>
            </div>
        )}

        <div className="bg-slate-800/50 p-6 rounded-2xl shadow-2xl border border-slate-700">
          <ConversationControls
            isRecording={isListening}
            onStart={handleStart}
            onStop={handleStop}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
            canAnalyze={conversation.length > 0 && !isListening}
            hasRecognitionSupport={hasRecognitionSupport}
          />

          <TranscriptionDisplay conversation={conversation} isRecording={isListening} />
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mt-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          {isLoading && <Loader />}
          
          {analysis && !isLoading && <AnalysisResults analysis={analysis} />}
        </div>
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Powered by Gemini API and Web Speech API</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
