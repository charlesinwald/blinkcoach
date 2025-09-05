import type React from "react"
import { useEffect, useState } from "react"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts"
import type { AnalysisResult } from "../types"

interface AnalysisResultsProps {
  analysis: AnalysisResult
}

// Hook to get computed CSS variables
const useThemeColors = () => {
  const [colors, setColors] = useState({
    primary: "#6366f1",
    accent: "#0891b2",
    destructive: "#dc2626",
    mutedForeground: "#94a3b8",
    border: "#374151",
    card: "#111827",
    cardForeground: "#f8fafc"
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)
      
      setColors({
        primary: `${computedStyle.getPropertyValue('--primary').trim()}`,
        accent: `${computedStyle.getPropertyValue('--accent').trim()}`,
        destructive: `${computedStyle.getPropertyValue('--destructive').trim()}`,
        mutedForeground: `${computedStyle.getPropertyValue('--muted-foreground').trim()}`,
        border: `${computedStyle.getPropertyValue('--border').trim()}`,
        card: `${computedStyle.getPropertyValue('--card').trim()}`,
        cardForeground: `${computedStyle.getPropertyValue('--card-foreground').trim()}`
      })
    }
  }, [])

  return colors
}

const sentimentToValue = {
  positive: 1,
  neutral: 0,
  negative: -1,
}

const AnalysisCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({
  title,
  children,
  icon,
}) => (
  <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-card/80">
    <div className="flex items-center gap-3 mb-6">
      {icon && (
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
      )}
      <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
)

const ScoreCircle: React.FC<{ score: number; label: string }> = ({ score, label }) => {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 10) * circumference
  const colorClass = score >= 7 ? "text-accent" : score >= 4 ? "text-yellow-500" : "text-destructive"

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-32 h-32 group-hover:scale-105 transition-transform duration-300">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-muted/30"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: "drop-shadow(0 0 8px currentColor)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-3xl font-bold ${colorClass}`}>{score}</div>
            <div className="text-xs text-muted-foreground">/10</div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-card-foreground font-semibold text-center">{label}</p>
    </div>
  )
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const { summary, sentimentFlow, speakingPace, clarity, confidence, actionableInsights } = analysis
  const themeColors = useThemeColors()

  const chartData = sentimentFlow.map((d) => ({
    name: d.time_marker,
    sentimentValue: sentimentToValue[d.sentiment],
    sentimentLabel: d.sentiment.charAt(0).toUpperCase() + d.sentiment.slice(1),
  }))

  const sentimentColors = {
    positive: themeColors.accent,
    neutral: themeColors.mutedForeground,
    negative: themeColors.destructive,
  }

  return (
    <div className="mt-12 space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
          Analysis Report
        </h2>
        <p className="text-muted-foreground">Comprehensive insights into your conversation performance</p>
      </div>

      <AnalysisCard
        title="Conversation Summary"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
      >
        <p className="text-card-foreground leading-relaxed text-pretty">{summary}</p>
      </AnalysisCard>

      <div className="grid lg:grid-cols-2 gap-8">
        <AnalysisCard
          title="Performance Scores"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        >
          <div className="flex justify-around items-center py-4">
            <ScoreCircle score={clarity.score} label="Clarity" />
            <ScoreCircle score={confidence.score} label="Confidence" />
          </div>
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="bg-secondary/20 rounded-xl p-4">
              <p className="text-sm font-medium text-card-foreground mb-1">Clarity Feedback</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{clarity.feedback}</p>
            </div>
            <div className="bg-secondary/20 rounded-xl p-4">
              <p className="text-sm font-medium text-card-foreground mb-1">Confidence Feedback</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{confidence.feedback}</p>
            </div>
          </div>
        </AnalysisCard>

        <AnalysisCard
          title="Speaking Pace"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        >
          <div className="text-center py-4">
            <div className="relative inline-block">
              <div className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {speakingPace.wpm}
              </div>
              <div className="text-muted-foreground font-medium mt-1">Words Per Minute</div>
            </div>

            <div className="mt-6">
              {speakingPace.wpm > 0 ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm font-medium text-primary">{speakingPace.assessment}</span>
                </div>
              ) : (
                <div className="bg-muted/10 border border-border/50 rounded-xl p-4 max-w-sm mx-auto">
                  <p className="text-sm font-medium text-card-foreground mb-2">Assessment Unavailable</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    No discernible speech detected. Please ensure clear audio input for accurate pace analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </AnalysisCard>
      </div>

      <AnalysisCard
        title="Actionable Insights"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      >
        <div className="space-y-3">
          {actionableInsights.length > 0 ? (
            actionableInsights.map((insight, index) => (
              <div
                key={index}
                className="group bg-secondary/20 hover:bg-secondary/30 border border-border/30 rounded-xl p-4 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors">
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-card-foreground leading-relaxed text-pretty flex-1">
                    {insight.replace(/\\n/g, " ").replace(/\n/g, " ").trim()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.869-1.453l-.548-.547z"
                />
              </svg>
              <p className="text-sm">No actionable insights available at this time.</p>
            </div>
          )}
        </div>
      </AnalysisCard>

      <AnalysisCard
        title="Sentiment Flow"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
        }
      >
        <p className="text-sm text-muted-foreground mb-6">
          Track the emotional tone and sentiment changes throughout your conversation.
        </p>
        <div className="bg-muted/20 rounded-xl p-4" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.border} opacity={0.5} />
              <XAxis
                dataKey="name"
                stroke={themeColors.mutedForeground}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: themeColors.mutedForeground }}
              />
              <YAxis
                domain={[-1.5, 1.5]}
                ticks={[-1, 0, 1]}
                tickFormatter={(val) => {
                  if (val === 1) return "Positive"
                  if (val === 0) return "Neutral"
                  if (val === -1) return "Negative"
                  return ""
                }}
                stroke={themeColors.mutedForeground}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: themeColors.mutedForeground }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.card,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: "12px",
                  color: themeColors.cardForeground,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                }}
                labelStyle={{ color: themeColors.mutedForeground }}
                formatter={(value, name, props) => [props.payload.sentimentLabel, "Sentiment"]}
              />
              <Line
                type="monotone"
                dataKey="sentimentValue"
                name="Sentiment"
                stroke={themeColors.primary}
                strokeWidth={3}
                dot={{ 
                  r: 6, 
                  fill: themeColors.primary, 
                  strokeWidth: 2, 
                  stroke: themeColors.card 
                }}
                activeDot={{ 
                  r: 8, 
                  fill: themeColors.accent, 
                  strokeWidth: 3, 
                  stroke: themeColors.card
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </AnalysisCard>
    </div>
  )
}

export default AnalysisResults
