// src/components/KhetBot.jsx
// Floating AI farming assistant — appears on every page
import { useState, useRef, useEffect } from "react";
import axios from "../api/axios";
import { MdClose, MdSend, MdSmartToy } from "react-icons/md";

const SUGGESTIONS = [
  "Best crops for Kharif season?",
  "How to control aphids on wheat?",
  "What is the MSP for rice?",
  "How to store onions long-term?",
  "Tips for drip irrigation?",
  "Which pulses grow in Gujarat?",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white rounded-2xl rounded-tl-none w-fit shadow-sm border border-gray-100">
      <span
        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

function Message({ msg }) {
  const isBot = msg.role === "assistant";
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-3`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-white text-xs shrink-0 mr-2 mt-0.5">
          🌾
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isBot
            ? "bg-white text-gray-800 rounded-tl-none border border-gray-100"
            : "bg-green-700 text-white rounded-tr-none"
        }`}
      >
        {/* Render line breaks and bullet points */}
        {msg.content.split("\n").map((line, i) => (
          <p
            key={i}
            className={
              line.startsWith("•") || line.startsWith("-") ? "ml-2" : ""
            }
          >
            {line || <br />}
          </p>
        ))}
      </div>
    </div>
  );
}

function KhetBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Jai Kisan! 🌾 I'm KhetBot, your farming assistant.\n\nAsk me anything about crops, pests, irrigation, pricing, or government schemes. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/ai/chat", {
        messages: newMessages.map(({ role, content }) => ({ role, content })),
      });
      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch {
      setError("Couldn't reach KhetBot. Please try again.");
      // Remove the user message on error so they can retry
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Jai Kisan! 🌾 Chat cleared. What would you like to know?",
      },
    ]);
    setError("");
  };

  return (
    <>
      {/* ── Chat Window ── */}
      {open && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] flex flex-col bg-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-emerald-700 px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🌾
              </div>
              <div>
                <p className="font-bold text-white text-sm">KhetBot</p>
                <p className="text-green-200 text-xs">AI Farming Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-green-300 hover:text-white text-xs transition px-2 py-1 rounded-lg hover:bg-white/10"
              >
                Clear
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-green-300 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
              >
                <MdClose size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} />
            ))}
            {loading && (
              <div className="flex justify-start mb-3">
                <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-white text-xs shrink-0 mr-2 mt-0.5">
                  🌾
                </div>
                <TypingIndicator />
              </div>
            )}
            {error && (
              <p className="text-xs text-red-500 text-center py-1">{error}</p>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — only show after first message */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide">
              {SUGGESTIONS.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="shrink-0 text-xs bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-full transition whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about crops, pests, prices…"
                rows={1}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none max-h-24"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="bg-green-700 hover:bg-green-600 disabled:bg-gray-200 text-white disabled:text-gray-400 p-2 rounded-xl transition shrink-0"
              >
                <MdSend size={16} />
              </button>
            </div>
            <p className="text-center text-xs text-gray-300 mt-1.5">
              Powered by Gemini AI
            </p>
          </div>
        </div>
      )}

      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all duration-300 ${
          open
            ? "bg-gray-700 hover:bg-gray-600 rotate-0"
            : "bg-green-700 hover:bg-green-600 hover:scale-110"
        }`}
        title="KhetBot — AI Farming Assistant"
      >
        {open ? (
          <MdClose size={24} className="text-white" />
        ) : (
          <MdSmartToy size={26} className="text-white" />
        )}
      </button>

      {/* ── Pulse ring on button (when closed) ── */}
      {!open && (
        <span className="fixed bottom-6 right-4 sm:right-6 z-40 w-14 h-14 rounded-full bg-green-500 opacity-30 animate-ping pointer-events-none" />
      )}
    </>
  );
}

export default KhetBot;
