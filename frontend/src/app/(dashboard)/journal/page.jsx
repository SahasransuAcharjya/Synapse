"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const getAuth = () => {
    const token = localStorage.getItem("synapseToken");
    const user = JSON.parse(localStorage.getItem("synapseUser") || "{}");
    return { token, user };
  };

  const fetchEntries = async () => {
    const { token, user } = getAuth();
    if (!token) { router.push("/login"); return; }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journal/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { token } = getAuth();

    const url = editingId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/journal/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/journal`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ title: "", content: "", imageUrl: "" });
        setShowForm(false);
        setEditingId(null);
        fetchEntries();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const { token } = getAuth();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journal/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEntries();
      if (selectedEntry?._id === id) setSelectedEntry(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (entry) => {
    setForm({ title: entry.title, content: entry.content, imageUrl: entry.imageUrl || "" });
    setEditingId(entry._id);
    setShowForm(true);
    setSelectedEntry(null);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

  const getExcerpt = (text, len = 120) =>
    text.length > len ? text.slice(0, len) + "..." : text;

  return (
    <div className="journal-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Journal</h1>
          <p className="page-subtitle">A private sanctuary for your thoughts</p>
        </div>
        <button
          className="new-btn"
          onClick={() => {
            setForm({ title: "", content: "", imageUrl: "" });
            setEditingId(null);
            setShowForm(true);
          }}
        >
          + New Entry
        </button>
      </div>

      {/* New / Edit Form */}
      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editingId ? "Edit Entry" : "New Journal Entry"}
            </h2>
            <form onSubmit={handleSubmit} className="entry-form">
              <input
                type="text"
                placeholder="Entry title..."
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="form-input"
              />
              <textarea
                placeholder="Write your thoughts here..."
                required
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="form-textarea"
              />
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="form-input"
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update" : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reading Modal */}
      {selectedEntry && (
        <div className="form-overlay" onClick={() => setSelectedEntry(null)}>
          <div className="read-modal" onClick={(e) => e.stopPropagation()}>
            {selectedEntry.imageUrl && (
              <img
                src={selectedEntry.imageUrl}
                alt={selectedEntry.title}
                className="read-image"
              />
            )}
            <p className="read-date">{formatDate(selectedEntry.date)}</p>
            <h2 className="read-title">{selectedEntry.title}</h2>
            <p className="read-content">{selectedEntry.content}</p>
            <div className="read-actions">
              <button className="edit-btn" onClick={() => openEdit(selectedEntry)}>
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(selectedEntry._id)}
              >
                Delete
              </button>
              <button className="close-btn" onClick={() => setSelectedEntry(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-orb" />
          <p>Loading your entries...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h3>No entries yet</h3>
          <p>Start writing your first journal entry today.</p>
        </div>
      ) : (
        <div className="entries-grid">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className="entry-card"
              onClick={() => setSelectedEntry(entry)}
            >
              {entry.imageUrl && (
                <img
                  src={entry.imageUrl}
                  alt={entry.title}
                  className="card-image"
                />
              )}
              <div className="card-body">
                <p className="card-date">{formatDate(entry.date)}</p>
                <h3 className="card-title">{entry.title}</h3>
                <p className="card-excerpt">{getExcerpt(entry.content)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .journal-page {
          min-height: 100vh;
          padding: 2.5rem 2rem;
          background: linear-gradient(135deg, #f5f0eb 0%, #ede8f5 50%, #e8f0f5 100%);
          font-family: 'Georgia', serif;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d2540;
          margin: 0;
        }

        .page-subtitle {
          color: #7a7090;
          margin: 0.3rem 0 0;
          font-size: 0.95rem;
          font-style: italic;
        }

        .new-btn {
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.2s;
          font-family: inherit;
        }

        .new-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(160, 130, 200, 0.4);
        }

        .new-btn:active { transform: scale(0.97); }

        .entries-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .entry-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 20px rgba(150, 130, 180, 0.1);
        }

        .entry-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(150, 130, 180, 0.2);
        }

        .card-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }

        .card-body { padding: 1.25rem; }

        .card-date {
          font-size: 0.78rem;
          color: #a090b8;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d2540;
          margin: 0 0 0.6rem;
        }

        .card-excerpt {
          font-size: 0.88rem;
          color: #6a6080;
          line-height: 1.6;
          margin: 0;
        }

        /* Modals */
        .form-overlay {
          position: fixed;
          inset: 0;
          background: rgba(45, 37, 64, 0.4);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.5rem;
        }

        .form-modal {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 560px;
          box-shadow: 0 20px 60px rgba(150, 130, 180, 0.25);
          max-height: 90vh;
          overflow-y: auto;
        }

        .read-modal {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 640px;
          box-shadow: 0 20px 60px rgba(150, 130, 180, 0.25);
          max-height: 88vh;
          overflow-y: auto;
        }

        .modal-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2d2540;
          margin: 0 0 1.5rem;
        }

        .entry-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-input {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(180, 160, 210, 0.3);
          border-radius: 12px;
          padding: 0.8rem 1rem;
          font-size: 0.95rem;
          color: #2d2540;
          outline: none;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          border-color: rgba(160, 130, 200, 0.6);
          box-shadow: 0 0 0 3px rgba(160, 130, 200, 0.1);
        }

        .form-textarea {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(180, 160, 210, 0.3);
          border-radius: 12px;
          padding: 0.8rem 1rem;
          font-size: 0.95rem;
          color: #2d2540;
          outline: none;
          font-family: inherit;
          resize: vertical;
          width: 100%;
          box-sizing: border-box;
          line-height: 1.6;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-textarea:focus {
          border-color: rgba(160, 130, 200, 0.6);
          box-shadow: 0 0 0 3px rgba(160, 130, 200, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .cancel-btn {
          padding: 0.7rem 1.4rem;
          background: rgba(180, 160, 210, 0.15);
          border: 1px solid rgba(180, 160, 210, 0.3);
          border-radius: 12px;
          color: #6a6080;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          transition: background 0.2s;
        }

        .cancel-btn:hover { background: rgba(180, 160, 210, 0.25); }

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

        .read-image { width: 100%; height: 220px; object-fit: cover; border-radius: 14px; margin-bottom: 1.2rem; }
        .read-date { font-size: 0.8rem; color: #a090b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.5rem; }
        .read-title { font-size: 1.6rem; font-weight: 700; color: #2d2540; margin: 0 0 1rem; }
        .read-content { font-size: 1rem; color: #4a4060; line-height: 1.8; white-space: pre-wrap; margin: 0 0 1.5rem; }

        .read-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

        .edit-btn {
          padding: 0.6rem 1.2rem;
          background: rgba(180, 160, 210, 0.2);
          border: 1px solid rgba(180, 160, 210, 0.4);
          border-radius: 10px;
          color: #6a5080;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.88rem;
          transition: background 0.2s;
        }
        .edit-btn:hover { background: rgba(180, 160, 210, 0.35); }

        .delete-btn {
          padding: 0.6rem 1.2rem;
          background: rgba(220, 100, 100, 0.1);
          border: 1px solid rgba(220, 100, 100, 0.2);
          border-radius: 10px;
          color: #b85555;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.88rem;
          transition: background 0.2s;
        }
        .delete-btn:hover { background: rgba(220, 100, 100, 0.2); }

        .close-btn {
          padding: 0.6rem 1.2rem;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 600;
          margin-left: auto;
          transition: transform 0.15s;
        }
        .close-btn:hover { transform: translateY(-1px); }

        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem;
          color: #7a7090;
          gap: 1rem;
          text-align: center;
        }

        .loading-orb {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(180,160,210,0.8), rgba(130,170,200,0.5));
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        .empty-icon { font-size: 3rem; }
        .empty-state h3 { color: #2d2540; margin: 0; font-size: 1.3rem; }
        .empty-state p { margin: 0; font-style: italic; }
      `}</style>
    </div>
  );
}