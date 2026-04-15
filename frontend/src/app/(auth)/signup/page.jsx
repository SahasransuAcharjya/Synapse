"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("synapseToken", data.token);
      localStorage.setItem("synapseUser", JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
      }));

      router.push("/dashboard");
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <div className="brand-orb" />
          <h1 className="brand-name">Synapse</h1>
          <p className="brand-tagline">Your calm space to breathe & reflect</p>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to continue your wellness journey</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn"
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="auth-link">
            Create one
          </Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f0eb 0%, #ede8f5 50%, #e8f0f5 100%);
          padding: 2rem;
          font-family: 'Georgia', serif;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 28px;
          padding: 3rem 2.5rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 8px 40px rgba(150, 130, 180, 0.15),
                      0 2px 8px rgba(150, 130, 180, 0.08);
        }

        .auth-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }

        .brand-orb {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(180, 160, 210, 0.9),
            rgba(130, 170, 200, 0.7),
            rgba(160, 200, 180, 0.5)
          );
          box-shadow: 0 0 20px rgba(160, 140, 200, 0.4),
                      0 0 40px rgba(130, 170, 200, 0.2);
          animation: pulse 4s ease-in-out infinite;
          margin-bottom: 0.75rem;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(160,140,200,0.4), 0 0 40px rgba(130,170,200,0.2); }
          50% { transform: scale(1.06); box-shadow: 0 0 28px rgba(160,140,200,0.6), 0 0 56px rgba(130,170,200,0.3); }
        }

        .brand-name {
          font-size: 1.6rem;
          font-weight: 600;
          color: #3d3550;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .brand-tagline {
          font-size: 0.82rem;
          color: #8a7fa0;
          margin: 0.25rem 0 0;
          font-style: italic;
        }

        .auth-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d2540;
          margin: 0 0 0.4rem;
          text-align: center;
        }

        .auth-subtitle {
          font-size: 0.9rem;
          color: #7a7090;
          text-align: center;
          margin: 0 0 1.8rem;
        }

        .auth-error {
          background: rgba(220, 100, 100, 0.1);
          border: 1px solid rgba(220, 100, 100, 0.25);
          color: #b85555;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          margin-bottom: 1.2rem;
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #5a5070;
          font-family: 'Georgia', serif;
        }

        .form-input {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(180, 160, 210, 0.3);
          border-radius: 14px;
          padding: 0.85rem 1.1rem;
          font-size: 0.95rem;
          color: #2d2540;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: #b0a8c0;
        }

        .form-input:focus {
          border-color: rgba(160, 130, 200, 0.6);
          box-shadow: 0 0 0 3px rgba(160, 130, 200, 0.1);
          background: rgba(255, 255, 255, 0.9);
        }

        .auth-btn {
          margin-top: 0.5rem;
          padding: 0.95rem;
          background: linear-gradient(135deg, #b8a0d8 0%, #90b8d0 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.2s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          letter-spacing: 0.02em;
        }

        .auth-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(160, 130, 200, 0.4);
        }

        .auth-btn:active:not(:disabled) {
          transform: scale(0.97);
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-switch {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: #7a7090;
        }

        .auth-link {
          color: #9878c8;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .auth-link:hover {
          color: #7850a8;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}