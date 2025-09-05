import type React from "react"

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-muted/30"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        <div
          className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-transparent border-t-accent animate-spin animation-delay-150"
          style={{ animationDirection: "reverse" }}
        ></div>
        <div className="absolute top-4 left-4 w-8 h-8 rounded-full border-4 border-transparent border-t-primary/50 animate-spin animation-delay-300"></div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Analyzing Your Conversation</h3>
        <p className="text-sm text-muted-foreground max-w-md text-pretty">
          Our AI is processing your speech patterns, sentiment, and communication style to provide personalized
          insights.
        </p>
      </div>

      <div className="flex items-center gap-1 mt-4">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-100"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-200"></div>
      </div>
    </div>
  )
}

export default Loader
