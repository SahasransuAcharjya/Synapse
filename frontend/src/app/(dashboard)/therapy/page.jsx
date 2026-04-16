"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
  "I'm feeling anxious today",
  "I need help with stress",
  "Can you guide me through breathing?",
  "I'm feeling overwhelmed",
];

export default function TherapyPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: "Hello, I'm Synapse 🌿 I'm here to listen, without judgment. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const token = localStorage.getItem("synapseToken");
    if (!token) { router.push("/login"); return; }

    const newMessages = [...messages, { role: "user", parts: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({ role: m.role, parts: m.parts })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages([...newMessages, { role: "model", parts: data.reply }]);
      }
    } catch (err) {
      setMessages([...newMessages, {
        role: "model",
        parts: "I'm having trouble connecting right now. Please try again in a moment. 💙",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="therapy-page">
      <div className="therapy-layout">
        {/* Left — Breathing Sphere Panel */}
        <div className="sphere-panel">
          <div
            className={`breathing-sphere ${isBreathing ? "breathing" : ""}`}
            onClick={() => setIsBreathing(!isBreathing)}
          >
            <div className="sphere-inner" />
            <div className="sphere-ring ring-1" />
            <div className="sphere-ring ring-2" />
          </div>
          <p className="sphere-label">
            {isBreathing ? "Breathe with me..." : "Tap to begin breathing"}
          </p>
          {isBreathing && (
            <div className="breath-guide">
              <p className="breath-text">Inhale 4s → Hold 7s → Exhale 8s</p>
            </div>
          )}

          <div className="quick-suggestions">
            <p className="suggestions-label">Quick prompts</p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="suggestion-btn"
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Right — Chat Window */}
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-orb" />
            <div>
              <h2 className="chat-title">Synapse</h2>
              <p className="chat-status">Your compassionate AI companion</p>
            </div>
          </div>

          <div className="messages-area">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message-wrap ${msg.role === "user" ? "user-wrap" : "model-wrap"}`}
              >
                <div className={`message-bubble ${msg.role === "user" ? "user-bubble" : "model-bubble"}`}>
                  {msg.parts}
                </div>
              </div>
            ))}

            {loading && (
              <div className="model-wrap">
                <div className="model-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="input-area">
            <textarea
              className="chat-input"
              placeholder="Share what's on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={2}
              disabled={loading}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
          <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>

      <style jsx>{`
        .therapy-page {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f0eb 0%, #ede8f5 50%, #e8f0f5 100%);
          font-family: 'Georgia', serif;
          display: flex;
          align-items: stretch;
        }

        .therapy-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.5rem;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Sphere Panel */
        .sphere-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          padding: 2rem 1.5rem;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 24px;
          box-shadow: 0 8px 30px rgba(150,130,180,0.1);
        }

        .breathing-sphere {
          width: 120px;
          height: 120px;
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sphere-inner {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(200,180,230,0.95),
            rgba(150,190,220,0.8),
            rgba(160,210,190,0.6)
          );
          box-shadow: 0 0 24px rgba(180,150,220,0.5),
                      0 0 48px rgba(150,190,220,0.3);
          animation: gentlePulse 4s ease-in-out infinite;
          transition: transform 0.3s;
        }

        .breathing-sphere.breathing .sphere-inner {
          animation: breathe478 19s ease-in-out infinite;
        }

        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes breathe478 {
          0%    { transform: scale(1); }
          21%   { transform: scale(1.25); } /* 4s inhale */
          58%   { transform: scale(1.25); } /* 7s hold */
          100%  { transform: scale(1); }    /* 8s exhale */
        }

        .sphere-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(180,150,220,0.25);
          animation: ringExpand 4s ease-in-out infinite;
        }

        .ring-1 { width: 96px; height: 96px; animation-delay: 0s; }
        .ring-2 { width: 116px; height: 116px; animation-delay: 0.5s; }

        .breathing-sphere.breathing .ring-1,
        .breathing-sphere.breathing .ring-2 {
          animation: ringExpand 19s ease-in-out infinite;
        }

        @keyframes ringExpand {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }

        .sphere-label {
          font-size: 0.85rem;
          color: #7a7090;
          text-align: center;
          font-style: italic;
          margin: 0;
        }

        .breath-guide {
          background: rgba(180,160,210,0.12);
          border: 1px solid rgba(180,160,210,0.25);
          border-radius: 12px;
          padding: 0.7rem 1rem;
          text-align: center;
        }

        .breath-text {
          font-size: 0.82rem;
          color: #6a5080;
          margin: 0;
          line-height: 1.5;
        }

        .quick-suggestions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .suggestions-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #a090b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0 0 0.3rem;
        }

        .suggestion-btn {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(180,160,210,0.25);
          border-radius: 10px;
          padding: 0.55rem 0.9rem;
          font-size: 0.82rem;
          color: #5a5070;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background 0.2s, transform 0.15s;
        }

        .suggestion-btn:hover {
          background: rgba(180,160,210,0.2);
          transform: translateX(3px);
        }

        /* Chat Panel */
        .chat-panel {
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(150,130,180,0.12);
          overflow: hidden;
          height: calc(100vh - 4rem);
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(180,160,210,0.2);
          background: rgba(255,255,255,0.3);
        }

        .chat-orb {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(200,180,230,0.9),
            rgba(150,190,220,0.7)
          );
          box-shadow: 0 0 14px rgba(180,150,220,0.4);
          animation: gentlePulse 4s ease-in-out infinite;
          flex-shrink: 0;
        }

        .chat-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2d2540;
          margin: 0;
        }

        .chat-status {
          font-size: 0.8rem;
          color: #9080a8;
          margin: 0;
          font-style: italic;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          scroll-behavior: smooth;
        }

        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(180,160,210,0.3); border-radius: 4px; }

        .user-wrap { display: flex; justify-content: flex-end; }
        .model-wrap { display: flex; justify-content: flex-start; }

        .message-bubble {
          max-width: 72%;
          padding: 0.85rem 1.1rem;
          border-radius: 18px;
          font-size: 0.95rem;
          line-height: 1.65;
          animation: fadeUp 0.3s ease-out;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .user-bubble {
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          color: white;
          border-bottom-right-radius: 6px;
          box-shadow: 0 4px 14px rgba(160,130,200,0.3);
        }

        .model-bubble {
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(180,160,210,0.25);
          color: #3a3050;
          border-bottom-left-radius: 6px;
          box-shadow: 0 2px 10px rgba(150,130,180,0.1);
        }

        .typing-bubble {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0.9rem 1.2rem;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(160,130,200,0.6);
          animation: typingBounce 1.2s ease-in-out infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        .input-area {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(180,160,210,0.2);
          background: rgba(255,255,255,0.3);
        }

        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(180,160,210,0.3);
          border-radius: 16px;
          padding: 0.85rem 1.1rem;
          font-size: 0.95rem;
          color: #2d2540;
          font-family: inherit;
          resize: none;
          outline: none;
          line-height: 1.5;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .chat-input:focus {
          border-color: rgba(160,130,200,0.5);
          box-shadow: 0 0 0 3px rgba(160,130,200,0.08);
        }

        .chat-input::placeholder { color: #b0a8c0; }

        .send-btn {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          border: none;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 4px 14px rgba(160,130,200,0.4);
        }

        .send-btn:active:not(:disabled) { transform: scale(0.95); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .input-hint {
          text-align: center;
          font-size: 0.75rem;
          color: #b0a0c0;
          padding: 0.4rem 1.5rem 0.8rem;
          margin: 0;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .therapy-layout {
            grid-template-columns: 1fr;
          }
          .sphere-panel {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .chat-panel { height: 70vh; }
        }
      `}</style>
    </div>
  );
}