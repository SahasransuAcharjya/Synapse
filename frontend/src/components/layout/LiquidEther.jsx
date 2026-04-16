"use client";
import { useEffect, useRef } from "react";

/**
 * LiquidEther — a full-screen animated mesh gradient background.
 * Renders a canvas-based soft, breathing colored smoke effect.
 * Use as a fixed background layer beneath page content.
 */
export default function LiquidEther({
  opacity = 1,
  speed = 1,
  className = "",
}) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const timeRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Orb definitions — position, size, color, drift speed
    const ORBS = [
      { x: 0.18, y: 0.12, r: 0.42, color: [200, 178, 235], speed: [0.00018, 0.00012] },
      { x: 0.78, y: 0.20, r: 0.36, color: [158, 200, 230], speed: [0.00014, 0.00020] },
      { x: 0.50, y: 0.78, r: 0.38, color: [158, 210, 185], speed: [0.00016, 0.00010] },
      { x: 0.10, y: 0.68, r: 0.32, color: [218, 185, 208], speed: [0.00012, 0.00018] },
      { x: 0.88, y: 0.85, r: 0.30, color: [215, 198, 165], speed: [0.00020, 0.00014] },
      { x: 0.55, y: 0.38, r: 0.28, color: [185, 205, 165], speed: [0.00015, 0.00022] },
    ];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (t) => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Base background
      ctx.fillStyle = "#f7f3ee";
      ctx.fillRect(0, 0, W, H);

      // Draw each soft orb
      ORBS.forEach((orb) => {
        const drift = Math.sin(t * orb.speed[0] * speed * 1000 + orb.x * 10);
        const driftY = Math.cos(t * orb.speed[1] * speed * 1000 + orb.y * 8);

        const cx = (orb.x + drift * 0.06) * W;
        const cy = (orb.y + driftY * 0.05) * H;
        const radius = orb.r * Math.min(W, H);

        // Breathe size gently
        const breathe = 1 + 0.04 * Math.sin(t * 0.0004 * speed * 1000 + orb.x * 5);
        const r = radius * breathe;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const [R, G, B] = orb.color;
        grad.addColorStop(0,   `rgba(${R},${G},${B},0.28)`);
        grad.addColorStop(0.5, `rgba(${R},${G},${B},0.14)`);
        grad.addColorStop(1,   `rgba(${R},${G},${B},0.00)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    let last = 0;
    const loop = (ts) => {
      const dt = ts - last;
      last = ts;
      timeRef.current += dt;
      draw(timeRef.current);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`liquid-ether ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    />
  );
}