"use client";
import { useState, useEffect } from "react";

const MOOD_MAP = {
  1: { emoji: "😔", label: "Rough",     color: "rgba(220,120,120,0.55)", glow: "rgba(220,120,120,0.50)" },
  2: { emoji: "😕", label: "Low",       color: "rgba(220,175,110,0.55)", glow: "rgba(220,175,110,0.50)" },
  3: { emoji: "😐", label: "Okay",      color: "rgba(185,185,120,0.55)", glow: "rgba(185,185,120,0.50)" },
  4: { emoji: "🙂", label: "Good",      color: "rgba(115,195,155,0.55)", glow: "rgba(115,195,155,0.50)" },
  5: { emoji: "😊", label: "Great",     color: "rgba(115,170,215,0.55)", glow: "rgba(115,170,215,0.50)" },
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const SLEEP_OPTIONS = ["No Sleep","Poor","Average","Good","Excellent"];

export default function MoodCalendar({ userId, token }) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [entries, setEntries] = useState({});
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({
    moodScore: 3,
    sleepQuality: "Average",
    meditation: false,
    medication: false,
    socialInteraction: 3,
    weather: "",
  });

  const fetchMonth = async () => {
    if (!userId || !token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mood/${userId}/month?year=${year}&month=${month + 1}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        const map = {};
        data.forEach((e) => { map[new Date(e.date).getDate()] = e; });
        setEntries(map);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMonth(); }, [month, year, userId]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const openDay = (day) => {
    const e = entries[day];
    setSelected(day);
    setForm(e ? {
      moodScore: e.moodScore,
      sleepQuality: e.sleepQuality ?? "Average",
      meditation: e.meditation ?? false,
      medication: e.medication ?? false,
      socialInteraction: e.socialInteraction ?? 3,
      weather: e.weather ?? "",
    } : {
      moodScore: 3, sleepQuality: "Average",
      meditation: false, medication: false,
      socialInteraction: 3, weather: "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const date = new Date(year, month, selected);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mood`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, date }),
        }
      );
      if (res.ok) {
        setSelected(null);
        fetchMonth();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  return (
    <div className="cal-root">
      {/* Navigation */}
      <div className="cal-nav">
        <button className="nav-btn" onClick={prevMonth}>‹</button>
        <div className="nav-center">
          <h3 className="cal-month-label">{MONTH_NAMES[month]}</h3>
          <span className="cal-year-label">{year}</span>
        </div>
        <button className="nav-btn" onClick={nextMonth}>›</button>
      </div>

      {/* Weekday headers */}
      <div className="cal-grid">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
          <div key={d} className="weekday">{d}</div>
        ))}

        {/* Empty cells */}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`e${i}`} />
        ))}

        {/* Day nodes */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day   = i + 1;
          const entry = entries[day];
          const mood  = entry ? MOOD_MAP[entry.moodScore] : null;
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year  === today.getFullYear();

          return (
            <button
              key={day}
              className={`day-node ${isToday ? "is-today" : ""} ${entry ? "has-entry" : ""}`}
              style={mood ? {
                background: mood.color,
                boxShadow: `0 0 10px ${mood.glow}, 0 2px 6px rgba(0,0,0,0.06)`,
              } : {}}
              onClick={() => openDay(day)}
              aria-label={`${MONTH_NAMES[month]} ${day}`}
            >
              <span className="day-num">{day}</span>
              {entry && <span className="day-emoji">{mood?.emoji}</span>}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="legend">
        {Object.values(MOOD_MAP).map((m) => (
          <div key={m.label} className="legend-item">
            <div className="legend-dot" style={{ background: m.color, boxShadow: `0 0 5px ${m.glow}` }} />
            <span>{m.emoji} {m.label}</span>
          </div>
        ))}
      </div>

      {/* Loading shimmer */}
      {loading && (
        <div className="loading-bar">
          <div className="loading-shimmer" />
        </div>
      )}

      {/* Day Log Modal */}
      {selected !== null && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {MONTH_NAMES[month]} {selected}, {year}
            </h3>

            <form onSubmit={handleSave} className="log-form">
              {/* Mood */}
              <div className="field">
                <label className="field-label">How are you feeling?</label>
                <div className="mood-row">
                  {Object.entries(MOOD_MAP).map(([score, m]) => (
                    <button
                      key={score}
                      type="button"
                      className={`mood-opt ${form.moodScore === +score ? "active-mood" : ""}`}
                      style={form.moodScore === +score ? {
                        background: m.color,
                        boxShadow: `0 0 12px ${m.glow}`,
                        borderColor: "transparent",
                      } : {}}
                      onClick={() => setForm({ ...form, moodScore: +score })}
                    >
                      <span className="mood-emoji">{m.emoji}</span>
                      <span className="mood-label">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep */}
              <div className="field">
                <label className="field-label">Sleep quality</label>
                <select
                  className="field-select"
                  value={form.sleepQuality}
                  onChange={(e) => setForm({ ...form, sleepQuality: e.target.value })}
                >
                  {SLEEP_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Social */}
              <div className="field">
                <label className="field-label">
                  Social interaction — <strong>{form.socialInteraction}/5</strong>
                </label>
                <input
                  type="range" min={1} max={5} step={1}
                  value={form.socialInteraction}
                  onChange={(e) => setForm({ ...form, socialInteraction: +e.target.value })}
                  className="field-range"
                />
              </div>

              {/* Weather */}
              <div className="field">
                <label className="field-label">Weather (optional)</label>
                <input
                  type="text"
                  placeholder="Sunny, Cloudy, Rainy…"
                  value={form.weather}
                  onChange={(e) => setForm({ ...form, weather: e.target.value })}
                  className="field-input"
                />
              </div>

              {/* Toggles */}
              <div className="toggles">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={form.meditation}
                    onChange={(e) => setForm({ ...form, meditation: e.target.checked })}
                  />
                  <span>🧘 Meditated</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={form.medication}
                    onChange={(e) => setForm({ ...form, medication: e.target.checked })}
                  />
                  <span>💊 Medication</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setSelected(null)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving…" : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .cal-root {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.80);
          border-radius: 24px;
          padding: 1.75rem;
          box-shadow: 0 6px 32px rgba(140, 120, 180, 0.12);
          position: relative;
          overflow: hidden;
        }

        /* Nav */
        .cal-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.4rem;
        }

        .nav-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.1rem;
        }

        .cal-month-label {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #2a2040;
          margin: 0;
          line-height: 1;
        }

        .cal-year-label {
          font-size: 0.78rem;
          color: #a090b8;
          letter-spacing: 0.08em;
          font-weight: 500;
        }

        .nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(184, 160, 216, 0.12);
          border: 1px solid rgba(184, 160, 216, 0.25);
          color: #7a6090;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.15s;
          line-height: 1;
        }

        .nav-btn:hover {
          background: rgba(184, 160, 216, 0.25);
          transform: scale(1.06);
        }

        /* Grid */
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.4rem;
        }

        .weekday {
          text-align: center;
          font-size: 0.72rem;
          font-weight: 600;
          color: #b0a0c8;
          padding: 0.3rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .day-node {
          aspect-ratio: 1;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.38);
          border: 1px solid rgba(255, 255, 255, 0.65);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.18s ease;
          padding: 0;
          gap: 1px;
          min-height: 0;
        }

        .day-node:hover { transform: scale(1.10); }

        .day-node.is-today {
          border: 2px solid rgba(184, 160, 216, 0.65);
          background: rgba(255, 255, 255, 0.55);
        }

        .day-num {
          font-size: 0.82rem;
          font-weight: 600;
          color: #2a2040;
          line-height: 1;
        }

        .day-emoji { font-size: 0.85rem; line-height: 1; }

        /* Legend */
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem 1.2rem;
          margin-top: 1.2rem;
          justify-content: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          color: #7a6090;
          font-weight: 400;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Loading */
        .loading-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          overflow: hidden;
        }

        .loading-shimmer {
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(184, 160, 216, 0.70),
            transparent
          );
          animation: shimmer 1.2s ease-in-out infinite;
          width: 200%;
        }

        @keyframes shimmer {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0%); }
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(42, 32, 64, 0.38);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .modal-box {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.90);
          border-radius: 24px;
          padding: 2rem;
          width: 100%;
          max-width: 480px;
          max-height: 88vh;
          overflow-y: auto;
          box-shadow: 0 24px 60px rgba(140, 120, 180, 0.22);
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #2a2040;
          margin: 0 0 1.5rem;
        }

        .log-form { display: flex; flex-direction: column; gap: 1.1rem; }

        .field { display: flex; flex-direction: column; gap: 0.45rem; }

        .field-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #5a5070;
          letter-spacing: 0.01em;
        }

        .mood-row {
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .mood-opt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          padding: 0.5rem 0.65rem;
          border-radius: 12px;
          border: 1px solid rgba(180, 160, 210, 0.28);
          background: rgba(255, 255, 255, 0.55);
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .mood-opt:hover { transform: scale(1.06); }
        .mood-opt.active-mood { font-weight: 600; }

        .mood-emoji { font-size: 1.2rem; line-height: 1; }
        .mood-label { font-size: 0.68rem; color: #5a5070; }

        .field-select {
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(180, 160, 210, 0.28);
          border-radius: 12px;
          padding: 0.65rem 0.9rem;
          font-size: 0.9rem;
          font-family: inherit;
          color: #2a2040;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .field-select:focus { border-color: rgba(184, 160, 216, 0.55); }

        .field-range {
          width: 100%;
          accent-color: #b8a0d8;
          cursor: pointer;
          height: 4px;
        }

        .field-input {
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(180, 160, 210, 0.28);
          border-radius: 12px;
          padding: 0.65rem 0.9rem;
          font-size: 0.9rem;
          font-family: inherit;
          color: #2a2040;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .field-input:focus { border-color: rgba(184, 160, 216, 0.55); }
        .field-input::placeholder { color: #c0b0d8; }

        .toggles {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        .toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.88rem;
          color: #5a5070;
          user-select: none;
        }

        .toggle input[type="checkbox"] {
          width: 17px;
          height: 17px;
          accent-color: #b8a0d8;
          cursor: pointer;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .cancel-btn {
          padding: 0.65rem 1.3rem;
          background: rgba(184, 160, 216, 0.12);
          border: 1px solid rgba(184, 160, 216, 0.25);
          border-radius: 12px;
          color: #6a6080;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.88rem;
          transition: background 0.2s;
        }

        .cancel-btn:hover { background: rgba(184, 160, 216, 0.22); }

        .save-btn {
          padding: 0.65rem 1.5rem;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 600;
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
          box-shadow: 0 3px 12px rgba(160, 130, 200, 0.30);
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(160, 130, 200, 0.42);
        }

        .save-btn:active:not(:disabled) { transform: scale(0.97); }
        .save-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        @media (max-width: 420px) {
          .cal-root { padding: 1.1rem; }
          .mood-row { gap: 0.3rem; }
          .mood-opt { padding: 0.4rem 0.5rem; }
        }
      `}</style>
    </div>
  );
}