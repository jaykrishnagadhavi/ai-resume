"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import Dashboard from "@/components/Dashboard";
import MockInterview from "@/components/MockInterview";

export default function Home() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (formData: FormData) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      
      const responseText = await res.text();
      if (!responseText) {
        throw new Error("Server returned an empty response. This might be due to a server crash or timeout.");
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("Failed to parse JSON. Raw response:", responseText);
        throw new Error(`Invalid JSON response: ${responseText.slice(0, 50)}...`);
      }

      if (res.ok) {
        setAnalysisData(data);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-16 text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
          Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Career Coach</span>
        </h1>
        <p className="text-lg text-indigo-200/80 max-w-2xl mx-auto">
          Elevate your job search. Upload your resume and job description to get instant AI analysis and a personalized mock interview.
        </p>
      </header>

      {/* Main Content */}
      {!analysisData ? (
        <section>
          <UploadForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl max-w-2xl mx-auto text-center animate-fade-in">
              {error}
            </div>
          )}
        </section>
      ) : (
        <section className="space-y-12">
          {/* Back button */}
          <button 
            onClick={() => setAnalysisData(null)}
            className="text-indigo-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Analyze Another Resume
          </button>

          <Dashboard data={analysisData} />
          
          <div className="mt-12 pt-12 border-t border-white/10">
            <MockInterview context={analysisData} />
          </div>
        </section>
      )}
    </main>
  );
}
