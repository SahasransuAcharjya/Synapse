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
            <div className