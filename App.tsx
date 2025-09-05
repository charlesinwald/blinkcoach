import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useSpeechRecognition } from "./hooks/useSpeechRecognition"
import { analyzeConversation } from "./services/geminiService"
import type { AnalysisResult, ConversationTurn } from "./types"
import ConversationControls from "./components/ConversationControls"
import TranscriptionDisplay from "./components/TranscriptionDisplay"
import AnalysisResults from "./components/AnalysisResults"
import Loader from "./components/Loader"

const App: React.FC = () => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([])
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null)
  const [recordingEndTime, setRecordingEndTime] = useState<number | null>(null)

  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    error: speechError,
    resetTranscript,
    hasRecognitionSupport,
  } = useSpeechRecognition()

  useEffect(() => {
    if (transcript) {
      const newTurn: ConversationTurn = {
        speaker: "You",
        text: transcript,
        timestamp: Date.now(),
      }

      setConversation((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].speaker === "You") {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: transcript,
            timestamp: Date.now(),
          }
          return updated
        }
        return [...prev, newTurn]
      })
    }
  }, [transcript])

  useEffect(() => {
    if (speechError) {
      setError(`Speech Recognition Error: ${speechError}`)
    }
  }, [speechError])

  const handleStart = () => {
    handleReset()
    setRecordingStartTime(Date.now())
    startListening()
  }

  const handleStop = () => {
    setRecordingEndTime(Date.now())
    stopListening()
  }

  const handleReset = useCallback(() => {
    stopListening()
    resetTranscript()
    setConversation([])
    setAnalysis(null)
    setError(null)
    setIsLoading(false)
    setRecordingStartTime(null)
    setRecordingEndTime(null)
  }, [stopListening, resetTranscript])

  const handleAnalyze = async () => {
    if (conversation.length === 0) {
      setError("There's nothing to analyze. Please record a conversation first.")
      return
    }

    setIsLoading(true)
    setError(null)
    setAnalysis(null)

    const fullTranscript = conversation.map((turn) => turn.text).join(" ")

    // Calculate duration from recording start/end times, fallback to conversation timestamps
    let duration = 0
    if (recordingStartTime && recordingEndTime) {
      duration = (recordingEndTime - recordingStartTime) / 1000
    } else if (conversation.length > 0) {
      duration = (conversation[conversation.length - 1].timestamp - conversation[0].timestamp) / 1000
    }

    try {
      const result = await analyzeConversation(fullTranscript, duration)
      setAnalysis(result)
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? `Analysis failed: ${e.message}` : "An unknown error occurred during analysis.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <main className="relative container mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <header className="text-center mb-12 animate-float">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.869-1.453l-.548-.547z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-balance mb-4">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              BlinkCoach
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Record your speech, get real-time transcription, and receive instant AI-powered feedback to improve your
            communication skills.
          </p>
        </header>

        {!hasRecognitionSupport && (
          <div
            className="bg-destructive/10 border border-destructive/20 text-destructive-foreground px-6 py-4 rounded-xl mb-8 backdrop-blur-sm"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <strong className="font-semibold">Browser Not Supported</strong>
                <p className="text-sm mt-1 text-muted-foreground">
                  Your browser does not support the Web Speech API. Please try Chrome or Edge for the best experience.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
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
              <div
                className="bg-destructive/10 border border-destructive/20 text-destructive-foreground px-6 py-4 rounded-xl mt-8 backdrop-blur-sm"
                role="alert"
              >
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {isLoading && <Loader />}

            {analysis && !isLoading && <AnalysisResults analysis={analysis} />}
          </div>
        </div>

        <footer className="text-center mt-12 text-muted-foreground">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>Powered by</span>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-muted/20 rounded-full text-xs font-medium">Gemini API</span>
              <span className="px-3 py-1 bg-muted/20 rounded-full text-xs font-medium">Web Speech API</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
