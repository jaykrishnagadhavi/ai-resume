"use client";

import { useState } from "react";

interface UploadFormProps {
  onAnalyze: (formData: FormData) => void;
  isLoading: boolean;
}

export default function UploadForm({ onAnalyze, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) return;

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
    onAnalyze(formData);
  };

  return (
    <div className="glass-panel p-8 w-full max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        Analyze Your Resume
      </h2>
      <p className="text-gray-300 text-center mb-8">
        Upload your resume and paste the job description to get AI-powered insights and interview preparation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-indigo-200">Upload Resume (PDF)</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-400/30 border-dashed rounded-xl cursor-pointer bg-indigo-900/20 hover:bg-indigo-900/40 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">{file ? file.name : "PDF (Max 5MB)"}</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-indigo-200">Job Description</label>
          <textarea
            className="glass-input w-full p-4 rounded-xl min-h-[150px] resize-y"
            placeholder="Paste the target job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!file || !jobDescription || isLoading}
          className="btn-primary w-full py-4 rounded-xl text-lg flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            "Analyze Resume"
          )}
        </button>
      </form>
    </div>
  );
}
