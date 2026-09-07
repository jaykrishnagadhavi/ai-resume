"use client";

interface AnalysisResult {
  matchScore: number;
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  likelyQuestions: { question: string; suggestedAnswer: string }[];
}

interface DashboardProps {
  data: AnalysisResult;
}

export default function Dashboard({ data }: DashboardProps) {
  // Determine color based on score
  const scoreColor = 
    data.matchScore >= 80 ? "text-green-400" : 
    data.matchScore >= 60 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Top Section: Score and Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Match Score Card */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold mb-4 text-indigo-200">Match Score</h3>
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-indigo-900/30 border-[8px] border-indigo-900/50 shadow-inner">
            <span className={`text-4xl font-bold ${scoreColor}`}>
              {data.matchScore}%
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-400 text-center">
            Based on keyword and experience alignment.
          </p>
        </div>

        {/* Missing Skills */}
        <div className="glass-panel p-6 md:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-indigo-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            Missing Skills / Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.length > 0 ? data.missingSkills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-sm">
                {skill}
              </span>
            )) : <span className="text-gray-400">Great job! No major skills missing.</span>}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 delay-100 animate-fade-in">
        <div className="glass-panel p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-300">Strengths</h3>
          <ul className="space-y-3">
            {data.strengths.map((str, idx) => (
              <li key={idx} className="flex gap-3 text-gray-300">
                <span className="text-green-400 mt-1">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass-panel p-6">
          <h3 className="text-xl font-semibold mb-4 text-yellow-300">Areas for Improvement</h3>
          <ul className="space-y-3">
            {data.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex gap-3 text-gray-300">
                <span className="text-yellow-400 mt-1">!</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interview Prep */}
      <div className="glass-panel p-6 delay-200 animate-fade-in">
        <h3 className="text-2xl font-bold mb-6 text-indigo-200">Likely Interview Questions</h3>
        <div className="space-y-4">
          {data.likelyQuestions.map((q, idx) => (
            <details key={idx} className="group bg-black/20 rounded-xl border border-white/5 overflow-hidden">
              <summary className="p-4 cursor-pointer font-medium text-white flex justify-between items-center hover:bg-white/5 transition-colors">
                <span className="pr-4">{q.question}</span>
                <span className="text-indigo-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 bg-black/40 border-t border-white/5 text-gray-300 leading-relaxed">
                <p className="font-semibold text-indigo-300 mb-2">Suggested Answer Angle:</p>
                {q.suggestedAnswer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
