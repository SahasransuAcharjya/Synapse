"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatbotWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: "Hello 🌿 I'm Synapse. Whatever is on your mind — I'm here to listen.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  // Breathing rhythm animation cycle: 4s inhale → 7s hold → 8s exhale = 19s
  useEffect(() => {
    if (!isBreathing) return;
    const timer = setTimeout(() => setIsBreathing(false), 19000);
    return () => clearTimeout(timer);
  }, [isBreathing]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const token = localStorage.getItem("synapseToken");
    if (!token) { router.push("/login"); return; }

    const newMessages = [...messages, { role: "user", parts: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: text,
            history: messages.map((m) => ({ role: m.role, parts: m.parts })),
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: "model", parts: data.reply }]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "model", parts: "I'm having a moment of quiet. Please try again shortly. 💙" },
      ]);
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
    <>
      {/* ── Floating Toggle Sphere ── */}
      <button
        className={`sphere-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open wellness chat"
      >
        <div className={`sphere-body ${isBreathing ? "breathing" : ""}`}>
          <div className="sphere-core" />
          <div className="sphere-ring sr1" />
          <div className="sphere-ring sr2" />
        </div>
        <span className="sphere-tooltip">
          {isOpen ? "Close" : "Talk to Synapse"}
        </span>
      </button>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="header-left">
              <div className="header-orb" />
              <div>
                <p className="header-name">Synapse</p>
                <p className="header-sub">Your calm companion</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="breathe-btn"
                onClick={() => setIsBreathing(true)}
                title="4-7-8 breathing"
              >
                🫁 Breathe
              </button>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>

          {/* Breathing overlay */}
          {isBreathing && (
            <div className="breath-overlay">
              <div className="breath-sphere" />
              <p className="breath-instruction">
                Inhale <strong>4s</strong> → Hold <strong>7s</strong> → Exhale <strong>8s</strong>
              </p>
              <button
                className="breath-stop"
                onClick={() => setIsBreathing(false)}
              >
                Stop
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="messages-scroll">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`msg-row ${msg.role === "user" ? "user-row" : "model-row"}`}
              >
                <div
                  className={`msg-bubble ${
                    msg.role === "user" ? "user-bubble" : "model-bubble"
                  }`}
                >
                  {msg.parts}
                </div>
              </div>
            ))}

            {loading && (
              <div className="model-row">
                <div className="model-bubble typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              className="chat-textarea"
              placeholder="Share what's on your mind…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={2}
              disabled={loading}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              ➤
            </button>
          </div>
          <p className="input-hint">Enter to send · Shift+Enter for new line</p>
        </div>
      )}

      <style jsx>{`
        /* ── Floating Sphere Toggle ── */
        .sphere-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 999;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }

        .sphere-body {
          width: 64px;
          height: 64px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sphere-toggle:hover .sphere-body {
          transform: scale(1.1);
        }

        .sphere-toggle.open .sphere-body {
          transform: scale(0.95);
        }

        .sphere-core {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 35% 35%,
            rgba(210, 190, 240, 0.95),
            rgba(155, 195, 228, 0.82),
            rgba(155, 215, 190, 0.68)
          );
          box-shadow:
            0 0 22px rgba(190, 165, 228, 0.60),
            0 0 50px rgba(155, 195, 228, 0.30),
            0 4px 16px rgba(140, 120, 180, 0.25);
          animation: gentlePulse 4s ease-in-out infinite;
        }

        .sphere-body.breathing .sphere-core {
          animation: breathe478 19s ease-in-out infinite;
        }

        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }

        @keyframes breathe478 {
          0%   { transform: scale(1); }
          21%  { transform: scale(1.28); }
          58%  { transform: scale(1.28); }
          100% { transform: scale(1); }
        }

        .sphere-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(190, 165, 228, 0.22);
          animation: ringPulse 4s ease-in-out infinite;
        }

        .sr1 { width: 56px; height: 56px; animation-delay: 0.2s; }
        .sr2 { width: 68px; height: 68px; animation-delay: 0.5s; }

        @keyframes ringPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.12; transform: scale(1.08); }
        }

        .sphere-tooltip {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 0.72rem;
          color: #9880b0;
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.70);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.80);
          border-radius: 999px;
          padding: 0.2rem 0.6rem;
          box-shadow: 0 2px 8px rgba(160, 130, 200, 0.15);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.2s, transform 0.2s;
          pointer-events: none;
        }

        .sphere-toggle:hover .sphere-tooltip {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Chat Window ── */
        .chat-window {
          position: fixed;
          bottom: 7rem;
          right: 2rem;
          z-index: 998;
          width: 360px;
          max-height: 520px;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.85);
          border-radius: 24px;
          box-shadow:
            0 24px 60px rgba(140, 120, 180, 0.22),
            0 4px 16px rgba(140, 120, 180, 0.12);
          overflow: hidden;
          animation: chatSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Header */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.1rem;
          border-bottom: 1px solid rgba(180, 160, 210, 0.18);
          background: rgba(255, 255, 255, 0.35);
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .header-orb {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(210, 190, 240, 0.9),
            rgba(155, 195, 228, 0.75)
          );
          box-shadow: 0 0 12px rgba(190, 165, 228, 0.45);
          animation: gentlePulse 4s ease-in-out infinite;
          flex-shrink: 0;
        }

        .header-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #2a2040;
          margin: 0;
          line-height: 1.2;
        }

        .header-sub {
          font-size: 0.72rem;
          color: #9080a8;
          margin: 0;
          font-style: italic;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .breathe-btn {
          font-family: inherit;
          font-size: 0.72rem;
          padding: 0.3rem 0.65rem;
          background: rgba(184, 160, 216, 0.15);
          border: 1px solid rgba(184, 160, 216, 0.28);
          border-radius: 999px;
          color: #7a5898;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .breathe-btn:hover { background: rgba(184, 160, 216, 0.28); }

        .close-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(180, 160, 210, 0.12);
          border: none;
          font-size: 1.1rem;
          color: #8070a0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.15s;
          line-height: 1;
        }

        .close-btn:hover {
          background: rgba(180, 160, 210, 0.25);
          transform: rotate(90deg);
        }

        /* Breathing overlay */
        .breath-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          background: rgba(245, 240, 255, 0.92);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.2rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .breath-sphere {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(210, 190, 240, 0.9),
            rgba(155, 195, 228, 0.75),
            rgba(155, 215, 190, 0.60)
          );
          box-shadow: 0 0 30px rgba(190, 165, 228, 0.55), 0 0 70px rgba(155, 195, 228, 0.25);
          animation: breathe478 19s ease-in-out infinite;
        }

        .breath-instruction {
          font-size: 0.9rem;
          color: #5a4878;
          text-align: center;
          line-height: 1.6;
          margin: 0;
        }

        .breath-stop {
          font-family: inherit;
          font-size: 0.82rem;
          padding: 0.45rem 1.1rem;
          background: rgba(184, 160, 216, 0.18);
          border: 1px solid rgba(184, 160, 216, 0.30);
          border-radius: 999px;
          color: #7a5898;
          cursor: pointer;
          transition: background 0.2s;
        }

        .breath-stop:hover { background: rgba(184, 160, 216, 0.32); }

        /* Messages */
        .messages-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          scroll-behavior: smooth;
        }

        .messages-scroll::-webkit-scrollbar { width: 3px; }
        .messages-scroll::-webkit-scrollbar-track { background: transparent; }
        .messages-scroll::-webkit-scrollbar-thumb {
          background: rgba(180, 160, 210, 0.30);
          border-radius: 999px;
        }

        .user-row { display: flex; justify-content: flex-end; }
        .model-row { display: flex; justify-content: flex-start; }

        .msg-bubble {
          max-width: 82%;
          padding: 0.7rem 0.95rem;
          border-radius: 16px;
          font-size: 0.88rem;
          line-height: 1.65;
          animation: msgFadeUp 0.28s ease both;
        }

        @keyframes msgFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .user-bubble {
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 3px 12px rgba(160, 130, 200, 0.28);
        }

        .model-bubble {
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(180, 160, 210, 0.22);
          color: #3a3050;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(150, 130, 180, 0.10);
        }

        .typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0.75rem 1rem;
          min-width: 60px;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(160, 130, 200, 0.55);
          animation: dotBounce 1.2s ease-in-out infinite;
        }

        .dot:nth-child(2) { animation-delay: 0.14s; }
        .dot:nth-child(3) { animation-delay: 0.28s; }

        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30%            { transform: translateY(-5px); opacity: 1; }
        }

        /* Input area */
        .chat-input-area {
          display: flex;
          gap: 0.6rem;
          align-items: flex-end;
          padding: 0.8rem 1rem;
          border-top: 1px solid rgba(180, 160, 210, 0.18);
          background: rgba(255, 255, 255, 0.30);
          flex-shrink: 0;
        }

        .chat-textarea {
          flex: 1;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(180, 160, 210, 0.28);
          border-radius: 14px;
          padding: 0.65rem 0.9rem;
          font-size: 0.88rem;
          font-family: inherit;
          color: #2a2040;
          resize: none;
          outline: none;
          line-height: 1.5;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .chat-textarea:focus {
          border-color: rgba(184, 160, 216, 0.55);
          box-shadow: 0 0 0 3px rgba(184, 160, 216, 0.10);
        }

        .chat-textarea::placeholder { color: #c0b0d8; }

        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          border: none;
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
          box-shadow: 0 3px 10px rgba(160, 130, 200, 0.30);
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 5px 16px rgba(160, 130, 200, 0.45);
        }

        .send-btn:active:not(:disabled) { transform: scale(0.94); }
        .send-btn:disabled { opacity: 0.38; cursor: not-allowed; }

        .input-hint {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 0.68rem;
          color: #c0b0d8;
          text-align: center;
          padding: 0.25rem 1rem 0.55rem;
          margin: 0;
          font-style: italic;
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .chat-window {
            right: 1rem;
            left: 1rem;
            width: auto;
            bottom: 6rem;
          }

          .sphere-toggle {
            bottom: 1.5rem;
            right: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}