"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0f;
          overflow: hidden;
          position: relative;
        }

        /* Animated background blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: float 8s ease-in-out infinite;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: #7c3aed;
          top: -100px; left: -100px;
          animation-delay: 0s;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: #0ea5e9;
          bottom: -80px; right: -80px;
          animation-delay: 3s;
        }
        .blob-3 {
          width: 300px; height: 300px;
          background: #f43f5e;
          top: 50%; left: 50%;
          animation-delay: 1.5s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }

        /* Grid overlay */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 10;
          margin: auto;
          width: 100%;
          max-width: 420px;
          padding: 48px 40px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(124,58,237,0.2);
          border: 1px solid rgba(124,58,237,0.4);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 11px;
          color: #a78bfa;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #7c3aed;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .login-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 36px;
          font-weight: 300;
        }

        .field-group {
          margin-bottom: 16px;
        }

        .field-label {
          display: block;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .field-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }

        .field-input::placeholder { color: rgba(255,255,255,0.25); }

        .field-input:focus {
          border-color: rgba(124,58,237,0.6);
          background: rgba(124,58,237,0.08);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }

        .login-btn {
          width: 100%;
          margin-top: 24px;
          padding: 15px;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .login-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .login-btn:hover::after { opacity: 1; }
        .login-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.4); }
        .login-btn:active { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          color: rgba(255,255,255,0.2);
          font-size: 12px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .signup-link {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
        }

        .signup-link a {
          color: #a78bfa;
          text-decoration: none;
          font-weight: 500;
        }
        .signup-link a:hover { text-decoration: underline; }
      `}</style>

      <div className="login-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />

        <div className="login-card">
          <div className="badge">
            <div className="badge-dot" />
            Secure Login
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">Sign in to continue to your workspace</p>

          <form onSubmit={handleLogin}>
            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                className="field-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="divider">or</div>
          <div className="signup-link">
            Don't have an account? <a href="/register">Create one</a>
          </div>
        </div>
      </div>
    </>
  );
}