
export interface ConversationTurn {
  speaker: string;
  text: string;
  timestamp: number;
}

export interface SentimentPoint {
  time_marker: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  justification: string;
}

export interface ClarityAndConfidenceFeedback {
  score: number;
  feedback: string;
}

export interface AnalysisResult {
  summary: string;
  sentimentFlow: SentimentPoint[];
  speakingPace: {
    wpm: number;
    assessment: string;
  };
  clarity: ClarityAndConfidenceFeedback;
  confidence: ClarityAndConfidenceFeedback;
  actionableInsights: string[];
}
