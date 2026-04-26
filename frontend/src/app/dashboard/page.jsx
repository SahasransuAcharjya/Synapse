"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import LiquidEther from "../../components/layout/LiquidEther";
import MoodCalender from "../../components/features/MoodCalender";
import ChatbotWidget from "../../components/features/ChatbotWidget";
import GlassCard from "../../components/ui/GlassCard";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("synapseUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <>
      <LiquidEther />
      <Navbar />

      <main className="dashboard-main container">
        <header className="dashboard-header animate-fadeDown">
          <h1>Welcome back, {user?.name?.split(" ")[0] || "Friend"} ✨</h1>
          <p>This is your personal safe space. How are you feeling today?</p>
        </header>

        <div className="dashboard-grid">
          {/* Main Content Area */}
          <section className="dashboard-content animate-fadeUp delay-2">
            <MoodCalender />
          </section>

          {/* Sidebar Area */}
          <aside className="dashboard-sidebar animate-fadeUp delay-3">
            <GlassCard padding="lg" hover={true} style={{ marginBottom: "2rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>Journal Prompt</h3>
              <p style={{ fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                "What is one thing that brought you a tiny moment of peace today?"
              </p>
              <button 
                className="btn btn-primary" 
                style={{ width: "100%", justifyContent: "center" }}
              >
                Write an entry
              </button>
            </GlassCard>

            {/* Added relative positioned wrapper so ChatbotWidget doesn't break if it expects bounded contexts, though it might be fixed position */}
            <div style={{ position: "relative", minHeight: "400px", zIndex: 10 }}>
               <ChatbotWidget />
            </div>
          </aside>
        </div>
      </main>

      <style jsx>{`
        .dashboard-main {
          margin-top: 100px; /* Space for fixed Navbar */
          padding-bottom: 4rem;
        }

        .dashboard-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .dashboard-header h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #2a2040 0%, #6a5080 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dashboard-header p {
          font-size: 1.1rem;
          color: #7a6090;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 992px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
