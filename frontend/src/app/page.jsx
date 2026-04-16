"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FEATURES = [
  {
    icon: "🧠",
    title: "AI Therapy Companion",
    description:
      "Speak freely with Synapse — an empathetic AI trained to listen, validate, and gently guide you through difficult moments.",
    color: "rgba(184, 160, 216, 0.15)",
    glow: "rgba(184, 160, 216, 0.4)",
  },
  {
    icon: "🌙",
    title: "Daily Mood Tracker",
    description:
      "Log your emotional state, sleep quality, and daily habits on a beautiful visual calendar that reveals your patterns.",
    color: "rgba(144, 184, 208, 0.15)",
    glow: "rgba(144, 184, 208, 0.4)",
  },
  {
    icon: "📓",
    title: "Private Journal",
    description:
      "A sanctuary for your thoughts. Write freely, revisit past entries, and watch your inner world take shape over time.",
    color: "rgba(150, 196, 168, 0.15)",
    glow: "rgba(150, 196, 168, 0.4)",
  },
  {
    icon: "🌿",
    title: "Wellness Resources",
    description:
      "Curated guided meditations, breathing exercises, and connections to licensed mental health professionals.",
    color: "rgba(216, 168, 184, 0.15)",
    glow: "rgba(216, 168, 184, 0.4)",
  },
];

const TESTIMONIALS = [
  {
    quote: "Synapse has become my quiet corner on difficult days. It genuinely listens.",
    name: "Maya R.",
    role: "Grad Student",
  },
  {
    quote: "The mood calendar helped me see patterns I never noticed before. Life-changing.",
    name: "James T.",
    role: "Software Engineer",
  },
  {
    quote: "I was skeptical of AI therapy, but the breathing exercises alone are worth it.",
    name: "Priya K.",
    role: "Teacher",
  },
];

export default function LandingPage() {
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll("[data-observe]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="landing">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero" ref={heroRef}>
        {/* Floating orbs for depth */}
        <div className="orb orb-1" style={{ transform: `translateY(${scrollY * 0.15}px)` }} />
        <div className="orb orb-2" style={{ transform: `translateY(${scrollY * 0.10}px)` }} />
        <div className="orb orb-3" style={{ transform: `translateY(${scrollY * 0.20}px)` }} />

        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge animate-fadeDown">
            <span className="badge-dot" />
            Your wellness companion
          </div>

          {/* Title */}
          <h1 className="hero-title animate-fadeUp delay-1">
            A quiet place<br />
            <em>to come back to yourself</em>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle animate-fadeUp delay-2">
            Synapse is a gentle digital sanctuary — track your moods, journal your
            thoughts, and find calm through compassionate AI support.
          </p>

          {/* CTA Buttons */}
          <div className="hero-actions animate-fadeUp delay-3">
            <Link href="/signup" className="cta-primary">
              Begin your journey
            </Link>
            <Link href="/login" className="cta-secondary">
              Sign in
            </Link>
          </div>

          {/* Trust line */}
          <p className="hero-trust animate-fadeUp delay-4">
            Private by design · No ads · No judgment
          </p>
        </div>

        {/* Central Breathing Sphere */}
        <div className="hero-sphere-wrap animate-scaleIn delay-2">
          <div className="hero-sphere">
            <div className="sphere-core" />
            <div className="sphere-ring r1" />
            <div className="sphere-ring r2" />
            <div className="sphere-ring r3" />
          </div>
          <p className="sphere-hint">Breathe</p>
        </div>

        {/* Scroll cue */}
        <div className="scroll-cue animate-fadeIn delay-5">
          <div className="scroll-line" />
          <span>Discover</span>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section
        className="features-section"
        id="features"
        data-observe
      >
        <div className="section-header" style={{ opacity: visible["features"] ? 1 : 0, transform: visible["features"] ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s ease" }}>
          <span className="section-eyebrow">What Synapse offers</span>
          <h2 className="section-title">
            Everything you need<br />to feel a little better
          </h2>
          <p className="section-subtitle">
            Built around you — gently, privately, and without pressure.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="feature-card"
              id={`feature-${i}`}
              data-observe
              style={{
                opacity: visible[`feature-${i}`] ? 1 : 0,
                transform: visible[`feature-${i}`] ? "translateY(0)" : "translateY(32px)",
                transition: `all 0.6s ease ${i * 0.1}s`,
                background: `linear-gradient(160deg, ${f.color} 0%, rgba(255,255,255,0.35) 100%)`,
              }}
            >
              <div
                className="feature-icon"
                style={{ boxShadow: `0 0 20px ${f.glow}` }}
              >
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section
        className="how-section"
        id="how"
        data-observe
      >
        <div
          className="how-inner"
          style={{
            opacity: visible["how"] ? 1 : 0,
            transform: visible["how"] ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.7s ease",
          }}
        >
          <span className="section-eyebrow">Getting started</span>
          <h2 className="section-title">As simple as breathing</h2>

          <div className="steps">
            {[
              { num: "01", title: "Create your space", desc: "Sign up in under 30 seconds. No credit card, no complexity." },
              { num: "02", title: "Check in daily", desc: "Log your mood, write a journal entry, or just talk to Synapse." },
              { num: "03", title: "Discover your patterns", desc: "Watch your calendar bloom with insights about your inner world." },
            ].map((step, i) => (
              <div
                key={step.num}
                className="step"
                id={`step-${i}`}
                data-observe
                style={{
                  opacity: visible[`step-${i}`] ? 1 : 0,
                  transform: visible[`step-${i}`] ? "translateX(0)" : "translateX(-20px)",
                  transition: `all 0.6s ease ${i * 0.15}s`,
                }}
              >
                <span className="step-num">{step.num}</span>
                <div>
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/signup" className="cta-primary how-cta">
            Start for free
          </Link>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section
        className="testimonials-section"
        id="testimonials"
        data-observe
      >
        <span
          className="section-eyebrow"
          style={{
            opacity: visible["testimonials"] ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          Gentle words from our community
        </span>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="testimonial-card"
              id={`test-${i}`}
              data-observe
              style={{
                opacity: visible[`test-${i}`] ? 1 : 0,
                transform: visible[`test-${i}`] ? "translateY(0)" : "translateY(24px)",
                transition: `all 0.6s ease ${i * 0.12}s`,
              }}
            >
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="author-name">{t.name}</p>
                  <p className="author-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section
        className="final-cta"
        id="final-cta"
        data-observe
        style={{
          opacity: visible["final-cta"] ? 1 : 0,
          transform: visible["final-cta"] ? "scale(1)" : "scale(0.97)",
          transition: "all 0.7s ease",
        }}
      >
        <div className="final-orb" />
        <h2 className="final-title">
          Your calm is<br /><em>closer than you think</em>
        </h2>
        <p className="final-subtitle">
          Join thousands of people gently working through life with Synapse by their side.
        </p>
        <Link href="/signup" className="cta-primary final-btn">
          Create your free account
        </Link>
        <p className="final-note">No commitment. Cancel anytime. Always private.</p>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-orb" />
          <span className="footer-name">Synapse</span>
        </div>
        <p className="footer-tagline">
          A gentle companion for your mental wellness journey.
        </p>
        <p className="footer-copy">
          © {new Date().getFullYear()} Synapse. Made with care.
        </p>
      </footer>

      <style jsx>{`
        .landing {
          font-family: 'DM Sans', system-ui, sans-serif;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 6rem 2rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          transition: transform 0.05s linear;
        }

        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(200,180,235,0.35) 0%, transparent 70%);
          top: -100px; left: -150px;
        }

        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(160,200,230,0.30) 0%, transparent 70%);
          top: 10%; right: -120px;
        }

        .orb-3 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(160,210,185,0.25) 0%, transparent 70%);
          bottom: 5%; left: 20%;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 999px;
          padding: 0.4rem 1rem;
          font-size: 0.82rem;
          font-weight: 500;
          color: #7a6090;
          margin-bottom: 1.8rem;
          box-shadow: 0 2px 12px rgba(180,150,220,0.15);
        }

        .badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--sage, #96c4a8);
          animation: orbitPulse 2s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes orbitPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        .hero-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.6rem, 6vw, 4.5rem);
          font-weight: 600;
          color: #2a2040;
          line-height: 1.15;
          margin-bottom: 1.4rem;
          letter-spacing: -0.02em;
        }

        .hero-title em {
          font-style: italic;
          font-weight: 400;
          color: #7a5090;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: #6a6080;
          line-height: 1.75;
          max-width: 560px;
          margin: 0 auto 2.2rem;
          font-weight: 300;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          padding: 0.9rem 2rem;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          color: white;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(184,160,216,0.40);
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(184,160,216,0.55);
          color: white;
        }

        .cta-primary:active { transform: scale(0.97); }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 0.9rem 2rem;
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.80);
          color: #5a5070;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          box-shadow: 0 2px 10px rgba(160,140,200,0.12);
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .cta-secondary:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.80);
          box-shadow: 0 6px 20px rgba(160,140,200,0.18);
          color: #3a3050;
        }

        .hero-trust {
          font-size: 0.8rem;
          color: #a090b8;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* Sphere */
        .hero-sphere-wrap {
          position: relative;
          margin-top: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .hero-sphere {
          width: 160px; height: 160px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sphere-core {
          width: 100px; height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(210,190,240,0.95),
            rgba(165,200,230,0.80),
            rgba(165,215,195,0.65)
          );
          box-shadow: 0 0 30px rgba(190,165,230,0.55), 0 0 70px rgba(165,200,230,0.30);
          animation: breatheHero 6s ease-in-out infinite;
        }

        @keyframes breatheHero {
          0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(190,165,230,0.55), 0 0 70px rgba(165,200,230,0.30); }
          50% { transform: scale(1.10); box-shadow: 0 0 48px rgba(190,165,230,0.75), 0 0 100px rgba(165,200,230,0.45); }
        }

        .sphere-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(190,165,230,0.20);
          animation: ringBreath 6s ease-in-out infinite;
        }

        .r1 { width: 120px; height: 120px; animation-delay: 0.15s; }
        .r2 { width: 145px; height: 145px; animation-delay: 0.35s; }
        .r3 { width: 162px; height: 162px; animation-delay: 0.55s; }

        @keyframes ringBreath {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.12; transform: scale(1.08); }
        }

        .sphere-hint {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.95rem;
          font-style: italic;
          color: #9880b0;
          margin: 0;
          letter-spacing: 0.08em;
        }

        /* Scroll cue */
        .scroll-cue {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #b0a0c8;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          animation: scrollBounce 2s ease-in-out infinite;
        }

        .scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, rgba(180,160,215,0.6), transparent);
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.7; }
          50% { transform: translateX(-50%) translateY(6px); opacity: 1; }
        }

        /* ── Features ── */
        .features-section {
          padding: 6rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-eyebrow {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: #a090b8;
          text-transform: uppercase;
          letter-spacing: 0.10em;
          margin-bottom: 0.8rem;
        }

        .section-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 600;
          color: #2a2040;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1rem;
          color: #7a7090;
          font-weight: 300;
          max-width: 480px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 22px;
          padding: 2rem 1.75rem;
          box-shadow: 0 4px 20px rgba(150,130,180,0.10);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 40px rgba(150,130,180,0.18);
        }

        .feature-icon {
          font-size: 2rem;
          width: 56px; height: 56px;
          border-radius: 16px;
          background: rgba(255,255,255,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.2rem;
          border: 1px solid rgba(255,255,255,0.80);
        }

        .feature-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #2a2040;
          margin-bottom: 0.7rem;
        }

        .feature-desc {
          font-size: 0.9rem;
          color: #6a6080;
          line-height: 1.7;
          margin: 0;
          font-weight: 300;
        }

        /* ── How It Works ── */
        .how-section {
          padding: 6rem 2rem;
          background: rgba(255,255,255,0.25);
        }

        .how-inner {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin: 3rem 0;
          text-align: left;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 18px;
          padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(150,130,180,0.08);
        }

        .step-num {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.2rem;
          font-weight: 300;
          color: #c0a8e0;
          line-height: 1;
          flex-shrink: 0;
          letter-spacing: -0.02em;
        }

        .step-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2a2040;
          margin-bottom: 0.35rem;
        }

        .step-desc {
          font-size: 0.9rem;
          color: #7a7090;
          margin: 0;
          font-weight: 300;
          line-height: 1.6;
        }

        .how-cta { margin-top: 1rem; }

        /* ── Testimonials ── */
        .testimonials-section {
          padding: 6rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .testimonial-card {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.80);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(150,130,180,0.10);
          text-align: left;
          transition: transform 0.25s ease;
        }

        .testimonial-card:hover { transform: translateY(-4px); }

        .testimonial-quote {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.1rem;
          font-style: italic;
          color: #3a3050;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-weight: 400;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .author-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .author-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #2a2040;
          margin: 0;
          line-height: 1.3;
        }

        .author-role {
          font-size: 0.78rem;
          color: #9080a8;
          margin: 0;
        }

        /* ── Final CTA ── */
        .final-cta {
          padding: 6rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          max-width: 800px;
          margin: 0 auto;
        }

        .final-orb {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(190,165,230,0.20) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          filter: blur(40px);
          animation: breatheHero 8s ease-in-out infinite;
        }

        .final-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 600;
          color: #2a2040;
          line-height: 1.2;
          margin-bottom: 1.2rem;
          position: relative;
        }

        .final-title em {
          font-style: italic;
          font-weight: 400;
          color: #7a5090;
        }

        .final-subtitle {
          font-size: 1.05rem;
          color: #7a7090;
          font-weight: 300;
          max-width: 460px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
          position: relative;
        }

        .final-btn {
          position: relative;
          font-size: 1.05rem;
          padding: 1rem 2.4rem;
        }

        .final-note {
          margin-top: 1.2rem;
          font-size: 0.8rem;
          color: #a090b8;
          position: relative;
          letter-spacing: 0.04em;
        }

        /* ── Footer ── */
        .footer {
          padding: 3rem 2rem;
          text-align: center;
          border-top: 1px solid rgba(180,160,210,0.18);
          background: rgba(255,255,255,0.20);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 0.8rem;
        }

        .footer-orb {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(200,180,230,0.9), rgba(150,190,215,0.7));
          box-shadow: 0 0 12px rgba(184,160,216,0.40);
          animation: orbitPulse 3s ease-in-out infinite;
        }

        .footer-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #3a3050;
          letter-spacing: 0.05em;
        }

        .footer-tagline {
          font-size: 0.88rem;
          color: #9080a8;
          margin-bottom: 0.5rem;
          font-style: italic;
        }

        .footer-copy {
          font-size: 0.78rem;
          color: #b0a8c0;
          margin: 0;
        }

        /* ── Animate classes ── */
        .animate-fadeDown {
          animation: fadeDown 0.5s ease both;
        }
        .animate-fadeUp {
          animation: fadeUp 0.6s ease both;
        }
        .animate-scaleIn {
          animation: scaleIn 0.7s ease both;
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease both;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.25s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.55s; }
        .delay-5 { animation-delay: 0.8s; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hero { padding: 5rem 1.5rem 3rem; }
          .hero-sphere-wrap { margin-top: 3rem; }
          .features-section, .how-section, .testimonials-section { padding: 4rem 1.5rem; }
          .features-grid, .testimonials-grid { grid-template-columns: 1fr; }
          .final-cta { padding: 4rem 1.5rem; }
        }
      `}</style>
    </main>
  );
}