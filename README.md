<div align="center">
  <h1>🚀 AI-Powered Resume Analyzer & Mock Interviewer</h1>
  <p><i>A full-stack web application to help candidates ace their interviews.</i></p>
</div>

<br />

<div align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="Google Gemini" src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" />
</div>

<br />

## 📖 Overview

**AI-Resume** is a modern, full-stack application designed to help job seekers tailor their resumes and prepare for interviews. By simply uploading a PDF resume and pasting a target Job Description, users receive deep AI-driven insights—including skill gap analysis, a match score, and potential interview questions.

Beyond analysis, the application features a **Real-Time Interactive AI Mock Interviewer** that acts as a hiring manager, evaluating answers and asking dynamic follow-up questions based on the candidate's specific background.

## ✨ Key Features

- 📄 **Native PDF Resume Parsing**: Upload a resume in PDF format. The app processes the file natively without relying on flaky third-party OCR libraries.
- 🎯 **Detailed Match Analysis**: Get a comprehensive Match Score (0-100%), identify Missing Skills, and review Strengths & Weaknesses.
- 🤖 **Interactive Mock Interviews**: Engage in a real-time chat interface where the AI conducts a tailored technical and behavioral interview.
- 🔒 **Secure & Serverless**: Built entirely on Next.js App Router API Routes. API keys remain hidden and are never exposed to the client.

## 💻 Tech Stack

- **Framework**: Next.js (App Router)
- **Frontend**: React, Tailwind CSS v4
- **Language**: TypeScript
- **AI Integration**: Google Gemini API (`gemini-3.5-flash-lite`) via `@google/generative-ai`

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- npm, yarn, pnpm, or bun
- A valid [Google Gemini API Key](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ai-resume.git
   cd ai-resume
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root of your project and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 How the AI Integration Works

This project leverages the **native multi-modal capabilities** of the Gemini API. 

1. **PDF Handling:** Instead of parsing text via external libraries—which can struggle with complex layouts or crash in serverless environments—the PDF is converted directly to a Base64 string.
2. **Contextual Analysis:** The raw PDF and Job Description are sent as a multi-modal prompt to Gemini, allowing the model to accurately assess layout, context, and content.
3. **Mock Interviews:** System prompts dynamically generate interview questions, and chat history is preserved to enable natural follow-up questions.

## 📂 Project Structure

```text
ai-resume/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/       # API route for PDF parsing & JD analysis
│   │   │   └── interview/     # API route for mock interview chat
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Main application view
│   ├── components/            # Reusable UI components (UploadForm, Dashboard, etc.)
│   └── lib/                   # Utility functions (Gemini client initialization)
├── public/                    # Static assets
└── .env.local                 # Environment variables (not tracked in git)
```
