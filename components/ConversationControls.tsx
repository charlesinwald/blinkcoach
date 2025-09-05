import type React from "react"

interface ConversationControlsProps {
  isRecording: boolean
  onStart: () => void
  onStop: () => void
  onAnalyze: () => void
  onReset: () => void
  canAnalyze: boolean
  hasRecognitionSupport: boolean
}

const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5.4-3a5.4 5.4 0 0 1-10.8 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-1.6z"></path>
  </svg>
)

const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z"></path>
  </svg>
)

const AnalyzeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const ResetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

const ConversationControls: React.FC<ConversationControlsProps> = ({
  isRecording,
  onStart,
  onStop,
  onAnalyze,
  onReset,
  canAnalyze,
  hasRecognitionSupport,
}) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
      {!isRecording ? (
        <button
          onClick={onStart}
          disabled={!hasRecognitionSupport}
          className="group relative flex items-center gap-3 px-8 py-4 font-semibold text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-3">
            <MicIcon className="w-5 h-5" />
            <span>Start Recording</span>
          </div>
        </button>
      ) : (
        <button
          onClick={onStop}
          className="group relative flex items-center gap-3 px-8 py-4 font-semibold text-destructive-foreground bg-destructive rounded-2xl hover:bg-destructive/90 transition-all duration-300 transform hover:scale-105 shadow-xl animate-pulse-glow overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-destructive to-red-600 animate-pulse" />
          <div className="relative flex items-center gap-3">
            <StopIcon className="w-5 h-5" />
            <span>Stop Recording</span>
          </div>
        </button>
      )}

      <button
        onClick={onAnalyze}
        disabled={!canAnalyze || !hasRecognitionSupport}
        className="group relative flex items-center gap-3 px-8 py-4 font-semibold text-accent-foreground bg-accent rounded-2xl hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center gap-3">
          <AnalyzeIcon className="w-5 h-5" />
          <span>Analyze</span>
        </div>
      </button>

      <button
        onClick={onReset}
        disabled={isRecording}
        className="group flex items-center justify-center w-14 h-14 text-muted-foreground bg-secondary/50 rounded-2xl hover:bg-secondary hover:text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg border border-border/50"
        title="Reset conversation"
      >
        <ResetIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
      </button>
    </div>
  )
}

export default ConversationControls
