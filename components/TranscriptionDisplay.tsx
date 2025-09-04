
import React, { useEffect, useRef } from 'react';
import type { ConversationTurn } from '../types';

interface TranscriptionDisplayProps {
  conversation: ConversationTurn[];
  isRecording: boolean;
}

const SpeakerIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-teal-500 flex-shrink-0 flex items-center justify-center mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ conversation, isRecording }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div className="mt-6 bg-slate-900/70 p-4 rounded-lg min-h-[150px] max-h-80 overflow-y-auto border border-slate-700 shadow-inner">
      {conversation.length === 0 && (
        <div className="flex items-center justify-center h-full text-slate-500">
          <p>{isRecording ? "Listening..." : "Click 'Start Recording' to begin."}</p>
        </div>
      )}
      <div className="space-y-4">
        {conversation.map((turn, index) => (
          <div key={index} className="flex items-start">
            <SpeakerIcon />
            <div className="bg-slate-800 p-3 rounded-lg w-full">
              <p className="text-gray-300">{turn.text}</p>
            </div>
          </div>
        ))}
         {isRecording && conversation.length > 0 && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-12"></div>}
      </div>
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default TranscriptionDisplay;
