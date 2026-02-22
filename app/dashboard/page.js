"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    fetch("/api/notes", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setNotes(data); setLoading(false); });
  }, []);

  const addNote = async () => {
    if (!title.trim()) return;
    setAdding(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content }),
    });
    const newNote = await res.json();
    setNotes([newNote, ...notes]);
    setTitle(""); setContent("");
    setAdding(false);
  };

  const deleteNote = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/notes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setNotes(notes.filter(n => n._id !== id));
  };

  const handleLogout = () => { localStorage.removeItem("token"); router.push("/login"); };

  const filtered = notes.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.content?.toLowerCase().includes(search.toLowerCase())
  );

  const colors = ["#7c3aed", "#0ea5e9", "#f43f5e", "#10b981", "#f59e0b", "#ec4899"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        /* NAV */
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 40px;
          background: rgba(10,10,15,0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .note-count {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(244,63,94,0.12);
          border: 1px solid rgba(244,63,94,0.25);
          border-radius: 8px;
          color: #f87171;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover { background: rgba(244,63,94,0.2); border-color: rgba(244,63,94,0.5); }

        /* MAIN */
        .main {
          max-width: 860px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        /* HERO */
        .hero {
          margin-bottom: 40px;
        }
        .hero-label {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #a78bfa;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          line-height: 1.1;
          background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.5));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
        }

        /* SEARCH */
        .search-wrap {
          position: relative;
          margin-bottom: 32px;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          font-size: 16px;
        }
        .search-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.2); }
        .search-input:focus {
          border-color: rgba(124,58,237,0.5);
          background: rgba(124,58,237,0.06);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        /* ADD NOTE CARD */
        .add-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 40px;
          transition: border-color 0.2s;
        }
        .add-card:focus-within {
          border-color: rgba(124,58,237,0.3);
        }

        .add-card-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
          margin-bottom: 16px;
          font-weight: 500;
        }

        .add-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 18px;
          font-weight: 500;
          outline: none;
          padding: 0 0 12px 0;
          margin-bottom: 16px;
          transition: border-color 0.2s;
        }
        .add-input::placeholder { color: rgba(255,255,255,0.2); font-weight: 400; }
        .add-input:focus { border-bottom-color: rgba(124,58,237,0.6); }

        .add-textarea {
          width: 100%;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          outline: none;
          resize: none;
          min-height: 72px;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .add-textarea::placeholder { color: rgba(255,255,255,0.2); }

        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); }
        .add-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* SECTION HEADER */
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
          font-weight: 500;
        }

        /* NOTES GRID */
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .note-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 22px;
          position: relative;
          transition: all 0.2s;
          animation: fadeIn 0.4s ease both;
          overflow: hidden;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .note-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 16px 16px 0 0;
        }

        .note-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }

        .note-title {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .note-content {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          font-weight: 300;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .note-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .note-date {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          font-weight: 300;
        }

        .delete-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.2);
          cursor: pointer;
          font-size: 16px;
          padding: 4px 6px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .delete-btn:hover { color: #f87171; background: rgba(244,63,94,0.1); }

        /* EMPTY */
        .empty {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255,255,255,0.2);
        }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty-text { font-size: 15px; font-weight: 300; }

        /* LOADING */
        .loading {
          text-align: center;
          padding: 80px;
          color: rgba(255,255,255,0.2);
          font-size: 14px;
          letter-spacing: 0.06em;
        }
      `}</style>

      <div className="dash-root">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">Noteflow</div>
          <div className="nav-right">
            <span className="note-count">{notes.length} note{notes.length !== 1 ? "s" : ""}</span>
            <button className="logout-btn" onClick={handleLogout}>
              ↩ Logout
            </button>
          </div>
        </nav>

        <div className="main">
          {/* HERO */}
          <div className="hero">
            <div className="hero-label">✦ Your workspace</div>
            <h1 className="hero-title">My Notes</h1>
            <p className="hero-sub">Capture ideas, thoughts, and everything in between.</p>
          </div>

          {/* SEARCH */}
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ADD NOTE */}
          <div className="add-card">
            <div className="add-card-label">✦ New note</div>
            <input
              className="add-input"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="add-textarea"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
            <button className="add-btn" onClick={addNote} disabled={adding || !title.trim()}>
              {adding ? "Adding..." : "+ Add Note"}
            </button>
          </div>

          {/* NOTES */}
          <div className="section-header">
            <span className="section-title">
              {search ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}` : "All notes"}
            </span>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">{search ? "🔍" : "📝"}</div>
              <div className="empty-text">{search ? "No notes match your search" : "No notes yet — create your first one!"}</div>
            </div>
          ) : (
            <div className="notes-grid">
              {filtered.map((note, i) => (
                <div
                  key={note._id}
                  className="note-card"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: "3px", borderRadius: "16px 16px 0 0",
                    background: colors[i % colors.length],
                  }} />
                  <div className="note-title">{note.title}</div>
                  {note.content && <div className="note-content">{note.content}</div>}
                  <div className="note-footer">
                    <span className="note-date">
                      {note.createdAt ? new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Today"}
                    </span>
                    <button className="delete-btn" onClick={() => deleteNote(note._id)} title="Delete">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}