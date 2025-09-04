
import { useState, useRef, useEffect, useCallback } from 'react';

// FIX: Add type definitions for Web Speech API to resolve TypeScript errors.
// These types are not included by default in many TypeScript configurations.
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly[index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
}
interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}


interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  hasRecognitionSupport: boolean;
}

// FIX: Renamed constant to avoid conflict with SpeechRecognition interface type.
const SpeechRecognitionApi: SpeechRecognitionStatic | undefined = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // FIX: `SpeechRecognition` now correctly refers to the interface type.
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognitionApi) {
      setError('Speech recognition not supported in this browser.');
      return;
    }
    
    const recognition = new SpeechRecognitionApi();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    // FIX: `SpeechRecognitionErrorEvent` type is now defined.
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if(event.error !== 'no-speech') {
             setError(`Speech recognition error: ${event.error}`);
        }
    };

    // FIX: `SpeechRecognitionEvent` type is now defined.
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if(finalTranscript) {
          setTranscript(prev => prev ? `${prev} ${finalTranscript}` : finalTranscript);
      }
    };
    
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript(''); // Reset transcript on new start
      try {
          recognitionRef.current.start();
      } catch (e) {
          if (e instanceof Error && e.name === 'InvalidStateError') {
              // It's already started, ignore.
          } else {
              setError(`Could not start recognition: ${e}`);
          }
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);


  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    hasRecognitionSupport: !!SpeechRecognitionApi
  };
};
