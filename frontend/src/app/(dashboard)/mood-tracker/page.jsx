"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MOOD_COLORS = {
  1: { bg: "rgba(220, 130, 130, 0.5)", glow: "rgba(220, 130, 130, 0.6)", label: "😔 Rough" },
  2: { bg: "rgba(220, 180, 120, 0.5)", glow: "rgba(220, 180, 120, 0.6)", label: "😕 Low" },
  3: { bg: "rgba(180, 180, 130, 0.5)", glow: "rgba(180, 180, 130, 0.6)", label: "😐 Okay" },
  4: { bg: "rgba(130, 190, 160, 0.5)", glow: "rgba(130, 190, 160, 0.6)", label: "🙂 Good" },
  5: { bg: "rgba(130, 170, 210, 0.5)", glow: "rgba(130, 170, 210, 0.6)", label: "😊 Great" },
};

const SLEEP_OPTIONS = ["No Sleep", "Poor", "Average", "Good", "Excellent"];

export default function MoodTrackerPage() {
  const router = useRouter();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [moodData, setMoodData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    moodScore: 3,
    sleepQuality: "Average",
    meditation: false,
    medication: false,
    socialInteraction: 3,
    weather: "",
  });

  const getAuth = () => ({
    token: localStorage.getItem("synapseToken"),
    user: JSON.parse(localStorage.getItem("synapseUser") || "{}"),
  });

  const fetchMonthData = async () => {
    const { token, user } = getAuth();
    if (!token) { router.push("/login"); return; }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mood/${user._id}/month?year=${currentYear}&month=${currentMonth + 1}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        const mapped = {};
        data.forEach((entry) => {
          const key = new Date(entry.date).getDate();
          mapped[key] = entry;
        });
        setMoodData(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchMonthData(); }, [currentMonth, currentYear]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const openDayForm = (day) => {
    const existing = moodData[day];
    setSelectedDate(day);
    setForm(existing ? {
      moodScore: existing.moodScore,
      sleepQuality: existing.sleepQuality,
      meditation: existing.meditation,
      medication: existing.medication,
      socialInteraction: existing.socialInteraction,
      weather: existing.weather || "",
    } : {
      moodScore: 3,
      sleepQuality: "Average",
      meditation: false,
      medication: false,
      socialInteraction: 3,
      weather: "",
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { token } = getAuth();

    const date = new Date(currentYear, currentMonth, selectedDate);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mood`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, date }),
      });

      if (res.ok) {
        setShowForm(false);
        fetchMonthData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const monthNames = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  return (
    <div className="mood-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mood Tracker</h1>
          <p className="page-subtitle">Gently observe your emotional patterns</p>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="calendar-card">
        <div className="cal-nav">
          <button className="nav-btn" onClick={() => {
            if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
            else setCurrentMonth(m => m - 1);
          }}>‹</button>
          <h2 className="cal-month">{monthNames[currentMonth]} {currentYear}</h2>
          <button className="nav-btn" onClick={() => {
            if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
            else setCurrentMonth(m => m + 1);
          }}>›</button>
        </div>

        {/* Weekday Labels */}
        <div className="cal-grid">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="cal-weekday">{d}</div>
          ))}

          {/* Empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="cal-empty" />
          ))}

          {/* Day Nodes */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const entry = moodData[day];
            const mood = entry ? MOOD_COLORS[entry.moodScore] : null;
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <div
                key={day}
                className={`cal-day ${isToday ? "today" : ""} ${entry ? "has-entry" : ""}`}
                style={mood ? {
                  background: mood.bg,
                  boxShadow: `0 0 12px ${mood.glow}`,
                } : {}}
                onClick={() => openDayForm(day)}
              >
                <span className="day-num">{day}</span>
                {entry && <span className="day-mood">{MOOD_COLORS[entry.moodScore].label.split(" ")[0]}</span>}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="legend">
          {Object.entries(MOOD_COLORS).map(([score, val]) => (
            <div key={score} className="legend-item">
              <div className="legend-dot" style={{ background: val.bg, boxShadow: `0 0 6px ${val.glow}` }} />
              <span>{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log Form Modal */}
      {showForm && (
        <div className="overlay" onClick={() => setShowForm(false)}>
          <div className="log-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              Log — {monthNames[currentMonth]} {selectedDate}, {currentYear}
            </h2>
            <form onSubmit={handleSave} className="log-form">
              {/* Mood Score */}
              <div className="field-group">
                <label>Mood Score</label>
                <div className="score-row">
                  {[1,2,3,4,5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`score-btn ${form.moodScore === s ? "active" : ""}`}
                      style={form.moodScore === s ? {
                        background: MOOD_COLORS[s].bg,
                        boxShadow: `0 0 10px ${MOOD_COLORS[s].glow}`,
                      } : {}}
                      onClick={() => setForm({ ...form, moodScore: s })}
                    >
                      {MOOD_COLORS[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Quality */}
              <div className="field-group">
                <label>Sleep Quality</label>
                <select
                  value={form.sleepQuality}
                  onChange={(e) => setForm({ ...form, sleepQuality: e.target.value })}
                  className="form-select"
                >
                  {SLEEP_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Social Interaction */}
              <div className="field-group">
                <label>Social Interaction — {form.socialInteraction}/5</label>
                <input
                  type="range" min={1} max={5} step={1}
                  value={form.socialInteraction}
                  onChange={(e) => setForm({ ...form, socialInteraction: +e.target.value })}
                  className="form-range"
                />
              </div>

              {/* Weather */}
              <div className="field-group">
                <label>Weather (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sunny, Rainy..."
                  value={form.weather}
                  onChange={(e) => setForm({ ...form, weather: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Toggles */}
              <div className="toggle-row">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={form.meditation}
                    onChange={(e) => setForm({ ...form, meditation: e.target.checked })}
                  />
                  <span className="toggle-text">🧘 Meditated</span>
                </label>
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={form.medication}
                    onChange={(e) => setForm({ ...form, medication: e.target.checked })}
                  />
                  <span className="toggle-text">💊 Medication</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .mood-page {
          min-height: 100vh;
          padding: 2.5rem 2rem;
          background: linear-gradient(135deg, #f5f0eb 0%, #ede8f5 50%, #e8f0f5 100%);
          font-family: 'Georgia', serif;
        }

        .page-header { margin-bottom: 2rem; }
        .page-title { font-size: 2rem; font-weight: 700; color: #2d2540; margin: 0; }
        .page-subtitle { color: #7a7090; margin: 0.3rem 0 0; font-style: italic; font-size: 0.95rem; }

        .calendar-card {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 8px 40px rgba(150,130,180,0.12);
          max-width: 720px;
        }

        .cal-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .cal-month { font-size: 1.3rem; font-weight: 600; color: #2d2540; margin: 0; }

        .nav-btn {
          background: rgba(180,160,210,0.15);
          border: 1px solid rgba(180,160,210,0.3);
          border-radius: 10px;
          width: 38px;
          height: 38px;
          font-size: 1.3rem;
          color: #6a5080;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn:hover { background: rgba(180,160,210,0.3); }

        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .cal-weekday {
          text-align: center;
          font-size: 0.78rem;
          font-weight: 600;
          color: #a090b8;
          padding: 0.4rem 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cal-empty { height: 60px; }

        .cal-day {
          height: 60px;
          border-radius: 14px;
          background: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s;
          gap: 2px;
        }

        .cal-day:hover { transform: scale(1.06); }

        .cal-day.today {
          border: 2px solid rgba(160,130,200,0.6);
        }

        .day-num {
          font-size: 0.9rem;
          font-weight: 600;
          color: #2d2540;
        }

        .day-mood { font-size: 1rem; }

        .legend {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: #6a6080;
        }

        .legend-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
        }

        /* Modal */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(45,37,64,0.4);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.5rem;
        }

        .log-modal {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(150,130,180,0.25);
        }

        .modal-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2d2540;
          margin: 0 0 1.5rem;
        }

        .log-form { display: flex; flex-direction: column; gap: 1.2rem; }

        .field-group { display: flex; flex-direction: column; gap: 0.5rem; }

        .field-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #5a5070;
        }

        .score-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .score-btn {
          padding: 0.5rem 0.9rem;
          border-radius: 10px;
          border: 1px solid rgba(180,160,210,0.3);
          background: rgba(255,255,255,0.6);
          font-size: 0.82rem;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.15s, box-shadow 0.2s;
          color: #4a4060;
        }

        .score-btn:hover { transform: scale(1.04); }
        .score-btn.active { font-weight: 600; color: #2d2540; }

        .form-select {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(180,160,210,0.3);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.92rem;
          color: #2d2540;
          font-family: inherit;
          outline: none;
          cursor: pointer;
        }

        .form-range {
          width: 100%;
          accent-color: #b8a0d8;
          cursor: pointer;
        }

        .form-input {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(180,160,210,0.3);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.92rem;
          color: #2d2540;
          font-family: inherit;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .form-input:focus { border-color: rgba(160,130,200,0.6); }

        .toggle-row {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: #5a5070;
        }

        .toggle-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #b8a0d8;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .cancel-btn {
          padding: 0.7rem 1.4rem;
          background: rgba(180,160,210,0.15);
          border: 1px solid rgba(180,160,210,0.3);
          border-radius: 12px;
          color: #6a6080;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
        }

        .save-btn {
          padding: 0.7rem 1.6rem;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          transition: transform 0.15s, box-shadow 0.2s;
        }

        .save-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(160,130,200,0.4); }
        .save-btn:active { transform: scale(0.97); }
        .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
}