"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "model";
  content: string;
}

interface MockInterviewProps {
  context: any;
}

export default function MockInterview({ context }: MockInterviewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize the interview on mount
  useEffect(() => {
    if (messages.length === 0) {
      startInterview();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    // Only scroll automatically if the user is actively chatting (prevents jumping down the page on load)
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Hello! I am ready to start the interview." }],
          context: JSON.stringify(context)
        })
      });
      
      const responseText = await res.text();
      if (!responseText) {
         console.error("Empty response from /api/interview");
         return;
      }
      
      const data = JSON.parse(responseText);
      if (data.text) {
        setMessages([{ role: "model", content: data.text }]);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: JSON.stringify(context)
        })
      });
      
      const responseText = await res.text();
      if (!responseText) {
        throw new Error("Empty response");
      }
      
      const data = JSON.parse(responseText);
      if (data.text) {
        setMessages([...newMessages, { role: "model", content: data.text }]);
      } else if (data.error) {
        setMessages([...newMessages, { role: "model", content: `Error: ${data.error}` }]);
      }
    } catch (e) {
      console.error(e);
      setMessages([...newMessages, { role: "model", content: "Sorry, I encountered an error connecting to the server." }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="glass-panel p-6 h-[600px] flex flex-col animate-fade-in delay-300">
      <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 border-b border-white/10 pb-4">
        AI Mock Interview
      </h3>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === "user" 
                  ? "bg-indigo-600/80 text-white rounded-br-none" 
                  : "bg-black/40 text-gray-200 rounded-bl-none border border-white/10"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black/40 text-gray-400 p-4 rounded-2xl rounded-bl-none border border-white/10 flex items-center gap-2">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-3 mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer here..."
          className="glass-input flex-1 p-4 rounded-xl"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="btn-primary px-8 rounded-xl flex items-center justify-center"
        >
          <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </form>
    </div>
  );
}
