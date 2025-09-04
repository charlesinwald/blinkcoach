
import React from 'react';

interface ConversationControlsProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  onAnalyze: () => void;
  onReset: () => void;
  canAnalyze: boolean;
  hasRecognitionSupport: boolean;
}

const MicIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5.4-3a5.4 5.4 0 0 1-10.8 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-1.6z"></path>
  </svg>
);

const StopIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z"></path>
  </svg>
);

const AnalyzeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.36 10.28a.75.75 0 0 1 0 1.44 7.5 7.5 0 0 1-5.11 5.11.75.75 0 0 1-1.44 0 7.5 7.5 0 0 1 5.11-5.11.75.75 0 0 1 1.44 0Zm-2.5 4.31a.75.75 0 0 0-1-1.09 3.5 3.5 0 0 0-2.36-2.36.75.75 0 0 0-1.09-1l-6 2a.75.75 0 0 0-.56 1.12l4 7a.75.75 0 0 0 1.12-.56l2-6Z"></path>
  </svg>
);

const ResetIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-8h-2v2h2v-2zm4 0h-2v2h2v-2z"></path><path d="M12 6.5c-1.66 0-3 1.34-3 3H7c0-2.76 2.24-5 5-5s5 2.24 5 5h-2c0-1.66-1.34-3-3-3z"></path></svg>
)

const ConversationControls: React.FC<ConversationControlsProps> = ({
  isRecording,
  onStart,
  onStop,
  onAnalyze,
  onReset,
  canAnalyze,
  hasRecognitionSupport
}) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
      {!isRecording ? (
        <button
          onClick={onStart}
          disabled={!hasRecognitionSupport}
          className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-teal-600 rounded-full hover:bg-teal-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <MicIcon className="w-5 h-5" />
          Start Recording
        </button>
      ) : (
        <button
          onClick={onStop}
          className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-red-600 rounded-full hover:bg-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse"
        >
          <StopIcon className="w-5 h-5" />
          Stop Recording
        </button>
      )}

      <button
        onClick={onAnalyze}
        disabled={!canAnalyze || !hasRecognitionSupport}
        className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        <AnalyzeIcon className="w-5 h-5" />
        Analyze
      </button>
      
      <button
        onClick={onReset}
        disabled={isRecording}
        className="flex items-center gap-1 p-3 font-semibold text-slate-400 bg-slate-700 rounded-full hover:bg-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 shadow-lg"
      >
        <ResetIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ConversationControls;
