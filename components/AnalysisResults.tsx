
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import type { AnalysisResult } from '../types';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

const sentimentColors = {
  positive: '#2dd4bf', // teal-400
  neutral: '#64748b',  // slate-500
  negative: '#f43f5e', // rose-500
};

const sentimentToValue = {
  positive: 1,
  neutral: 0,
  negative: -1,
}

const AnalysisCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-lg relative block w-full">
    <h3 className="text-xl font-bold text-teal-400 mb-4 block w-full">{title}</h3>
    <div className="block w-full">
      {children}
    </div>
  </div>
);

const ScoreCircle: React.FC<{ score: number, label: string }> = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 10) * circumference;
    const colorClass = score >= 7 ? 'text-teal-400' : score >= 4 ? 'text-yellow-400' : 'text-red-500';

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle 
                        className={colorClass}
                        strokeWidth="10" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="45" 
                        cx="50" 
                        cy="50" 
                        style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.8s ease-out'}}
                    />
                    <text x="50" y="50" className={`fill-current text-2xl font-bold ${colorClass}`} textAnchor="middle" dy=".3em">{score}/10</text>
                </svg>
            </div>
            <p className="mt-2 text-slate-300 font-semibold">{label}</p>
        </div>
    );
};


const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const { summary, sentimentFlow, speakingPace, clarity, confidence, actionableInsights } = analysis;

  const chartData = sentimentFlow.map(d => ({
    name: d.time_marker,
    sentimentValue: sentimentToValue[d.sentiment],
    sentimentLabel: d.sentiment.charAt(0).toUpperCase() + d.sentiment.slice(1)
  }));


  return (
    <div className="mt-8 space-y-6 clear-both overflow-hidden">
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-6">
        Analysis Report
      </h2>

      <AnalysisCard title="Conversation Summary">
        <p className="text-slate-300 leading-relaxed">{summary}</p>
      </AnalysisCard>
      
      <div className="grid md:grid-cols-2 gap-6">
          <AnalysisCard title="Performance Scores">
              <div className="flex justify-around items-center h-full">
                  <ScoreCircle score={clarity.score} label="Clarity" />
                  <ScoreCircle score={confidence.score} label="Confidence" />
              </div>
              <p className="text-slate-400 mt-4 text-sm"><span className="font-semibold text-slate-300">Clarity:</span> {clarity.feedback}</p>
              <p className="text-slate-400 mt-2 text-sm"><span className="font-semibold text-slate-300">Confidence:</span> {confidence.feedback}</p>
          </AnalysisCard>

          <AnalysisCard title="Speaking Pace">
              <div className="text-center">
                  <p className="text-6xl font-bold text-teal-400">{speakingPace.wpm}</p>
                  <p className="text-slate-400">Words Per Minute</p>
                  <div className="mt-4">
                      {speakingPace.wpm > 0 ? (
                          <p className="text-lg font-semibold text-white px-4 py-2 bg-teal-600/50 rounded-full inline-block">{speakingPace.assessment}</p>
                      ) : (
                          <div className="text-sm text-slate-400 max-w-md mx-auto">
                              <p className="mb-2 font-medium text-slate-300">Assessment unavailable</p>
                              <p className="leading-relaxed">The calculated speaking pace of 0 words per minute indicates that either no discernible speech was detected within the recorded duration, or there was an issue with the recording or calculation. No actual speaking pace can be assessed from this data.</p>
                          </div>
                      )}
                  </div>
              </div>
          </AnalysisCard>
      </div>

      <AnalysisCard title="Actionable Insights">
        <div className="space-y-3">
          {actionableInsights.length > 0 ? (
            actionableInsights.map((insight, index) => (
              <div key={index} className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 leading-relaxed text-sm break-words">
                      {insight.replace(/\\n/g, ' ').replace(/\n/g, ' ').trim()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm italic">No actionable insights available.</p>
          )}
        </div>
      </AnalysisCard>

      <AnalysisCard title="Sentiment Flow">
        <p className="text-slate-400 text-sm mb-4">Visualizing the emotional tone throughout the conversation.</p>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis domain={[-1.5, 1.5]} ticks={[-1,0,1]} tickFormatter={(val) => {
                        if (val === 1) return 'Positive';
                        if (val === 0) return 'Neutral';
                        if (val === -1) return 'Negative';
                        return '';
                    }} stroke="#94a3b8" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
                        labelStyle={{ color: '#94a3b8' }}
                        formatter={(value, name, props) => [props.payload.sentimentLabel, 'Sentiment']}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="sentimentValue" name="Sentiment" stroke={sentimentColors.positive} strokeWidth={3} dot={{r: 5}} activeDot={{r: 8}} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </AnalysisCard>
    </div>
  );
};

export default AnalysisResults;

