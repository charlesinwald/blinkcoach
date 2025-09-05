import type React from "react"
import { useEffect, useRef } from "react"
import type { ConversationTurn } from "../types"

interface TranscriptionDisplayProps {
  conversation: ConversationTurn[]
  isRecording: boolean
}

const SpeakerIcon: React.FC = () => (
  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center shadow-lg">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-primary-foreground"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  </div>
)

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ conversation, isRecording }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  return (
    <div className="mt-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl min-h-[200px] max-h-96 overflow-hidden shadow-inner">
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/10">
        <h3 className="font-semibold text-card-foreground">Live Transcription</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-destructive animate-pulse" : "bg-muted"}`} />
          <span className="text-sm text-muted-foreground">{isRecording ? "Recording..." : "Ready"}</span>
        </div>
      </div>

      <div className="p-4 overflow-y-auto max-h-80">
        {conversation.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            <p className="text-center">
              {isRecording ? "Listening for your voice..." : "Click 'Start Recording' to begin transcription"}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {conversation.map((turn, index) => (
            <div key={index} className="flex items-start gap-4 group">
              <SpeakerIcon />
              <div className="flex-1 bg-secondary/30 backdrop-blur-sm border border-border/30 rounded-2xl p-4 group-hover:bg-secondary/50 transition-colors duration-200">
                <p className="text-card-foreground leading-relaxed text-pretty">{turn.text}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(turn.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {isRecording && conversation.length > 0 && (
            <div className="flex items-center gap-4 ml-14">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-destructive/70 rounded-full animate-pulse animation-delay-100" />
                <div className="w-1 h-1 bg-destructive/50 rounded-full animate-pulse animation-delay-200" />
              </div>
              <span className="text-xs text-muted-foreground">Still listening...</span>
            </div>
          )}
        </div>
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  )
}

export default TranscriptionDisplay
