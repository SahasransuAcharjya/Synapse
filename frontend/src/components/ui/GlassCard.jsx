"use client";

/**
 * GlassCard — reusable frosted glass container.
 *
 * Props:
 *   children     — content
 *   className    — extra class names
 *   padding      — "sm" | "md" | "lg" (default "md")
 *   radius       — "md" | "lg" | "xl" (default "lg")
 *   hover        — boolean, enables lift-on-hover (default false)
 *   glow         — boolean, adds soft colored glow (default false)
 *   onClick      — optional click handler
 *   style        — extra inline styles
 */
export default function GlassCard({
  children,
  className = "",
  padding   = "md",
  radius    = "lg",
  hover     = false,
  glow      = false,
  onClick,
  style     = {},
}) {
  const padMap = {
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "2.5rem",
  };

  const radMap = {
    sm: "12px",
    md: "16px",
    lg: "22px",
    xl: "28px",
  };

  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      className={`glass-card ${hover ? "glass-hover" : ""} ${glow ? "glass-glow" : ""} ${className}`}
      onClick={onClick}
      style={{
        padding: padMap[padding] ?? padding,
        borderRadius: radMap[radius] ?? radius,
        ...style,
      }}
    >
      {children}

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.58);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.80);
          box-shadow: 0 4px 24px rgba(140, 120, 180, 0.10),
                      0 1px 4px rgba(140, 120, 180, 0.06);
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', system-ui, sans-serif;

          /* Reset button styles if used as button */
          text-align: left;
          appearance: none;
          -webkit-appearance: none;
          cursor: ${onClick ? "pointer" : "default"};
          display: block;
          width: ${onClick ? "100%" : "auto"};
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.22s ease;
        }

        /* Subtle inner highlight */
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.85) 40%,
            rgba(255, 255, 255, 0.85) 60%,
            transparent
          );
          pointer-events: none;
        }

        .glass-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(140, 120, 180, 0.18),
                      0 3px 10px rgba(140, 120, 180, 0.10);
        }

        .glass-hover:active {
          transform: scale(0.98) translateY(-1px);
        }

        .glass-glow {
          box-shadow: 0 4px 24px rgba(140, 120, 180, 0.10),
                      0 0 32px rgba(184, 160, 216, 0.18),
                      0 1px 4px rgba(140, 120, 180, 0.06);
        }

        .glass-glow:hover {
          box-shadow: 0 12px 40px rgba(140, 120, 180, 0.18),
                      0 0 48px rgba(184, 160, 216, 0.28),
                      0 3px 10px rgba(140, 120, 180, 0.10);
        }
      `}</style>
    </Tag>
  );
}