"use client";

/**
 * SoftButton — reusable GSAP-inspired elastic button.
 *
 * Props:
 *   children    — button label / content
 *   variant     — "primary" | "secondary" | "ghost" | "danger" (default "primary")
 *   size        — "sm" | "md" | "lg" (default "md")
 *   fullWidth   — boolean (default false)
 *   disabled    — boolean (default false)
 *   loading     — boolean, shows spinner (default false)
 *   onClick     — click handler
 *   type        — button type attr (default "button")
 *   className   — extra classes
 *   icon        — optional icon/emoji before label
 *   iconAfter   — optional icon/emoji after label
 */
export default function SoftButton({
  children,
  variant   = "primary",
  size      = "md",
  fullWidth = false,
  disabled  = false,
  loading   = false,
  onClick,
  type      = "button",
  className = "",
  icon,
  iconAfter,
}) {
  const sizeMap = {
    sm: { padding: "0.45rem 1rem",  fontSize: "0.82rem", height: "34px",  radius: "10px" },
    md: { padding: "0.7rem 1.4rem", fontSize: "0.92rem", height: "42px",  radius: "13px" },
    lg: { padding: "0.9rem 2rem",   fontSize: "1rem",    height: "52px",  radius: "15px" },
  };

  const sz = sizeMap[size] ?? sizeMap.md;

  return (
    <button
      type={type}
      className={`soft-btn variant-${variant} ${fullWidth ? "full" : ""} ${loading ? "is-loading" : ""} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        padding:      sz.padding,
        fontSize:     sz.fontSize,
        minHeight:    sz.height,
        borderRadius: sz.radius,
      }}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        <>
          {icon      && <span className="btn-icon">{icon}</span>}
          <span className="btn-label">{children}</span>
          {iconAfter && <span className="btn-icon-after">{iconAfter}</span>}
        </>
      )}

      <style jsx>{`
        .soft-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          border: none;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          user-select: none;
          transition:
            transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.20s ease,
            background  0.20s ease,
            opacity     0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .soft-btn.full { width: 100%; }

        /* Ripple on click */
        .soft-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.18);
          opacity: 0;
          transition: opacity 0.15s ease;
          border-radius: inherit;
          pointer-events: none;
        }

        .soft-btn:active::after { opacity: 1; }

        /* Hover lift */
        .soft-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        /* Press compress */
        .soft-btn:active:not(:disabled) {
          transform: scale(0.97) translateY(0);
        }

        /* Disabled */
        .soft-btn:disabled {
          opacity: 0.48;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        /* ── Variants ── */
        .variant-primary {
          background: linear-gradient(135deg, #b8a0d8 0%, #90b8d0 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(184, 160, 216, 0.38);
        }

        .variant-primary:hover:not(:disabled) {
          box-shadow: 0 8px 24px rgba(184, 160, 216, 0.55);
        }

        .variant-secondary {
          background: rgba(255, 255, 255, 0.62);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #5a5070;
          border: 1px solid rgba(180, 160, 210, 0.30);
          box-shadow: 0 2px 10px rgba(160, 130, 200, 0.10);
        }

        .variant-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.80);
          box-shadow: 0 5px 18px rgba(160, 130, 200, 0.16);
          color: #3a3050;
        }

        .variant-ghost {
          background: transparent;
          color: #7a6090;
          border: 1px solid rgba(180, 160, 210, 0.25);
          box-shadow: none;
        }

        .variant-ghost:hover:not(:disabled) {
          background: rgba(184, 160, 216, 0.10);
          border-color: rgba(180, 160, 210, 0.45);
          color: #3a3050;
          box-shadow: 0 2px 8px rgba(160, 130, 200, 0.10);
        }

        .variant-danger {
          background: rgba(220, 100, 100, 0.10);
          color: #b05555;
          border: 1px solid rgba(220, 100, 100, 0.22);
          box-shadow: none;
        }

        .variant-danger:hover:not(:disabled) {
          background: rgba(220, 100, 100, 0.18);
          box-shadow: 0 4px 14px rgba(220, 100, 100, 0.18);
          color: #8a3535;
        }

        /* ── Icons ── */
        .btn-icon,
        .btn-icon-after {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1em;
          line-height: 1;
          flex-shrink: 0;
        }

        .btn-label { line-height: 1; }

        /* ── Spinner ── */
        .btn-spinner {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: white;
          animation: btnSpin 0.65s linear infinite;
          display: inline-block;
          flex-shrink: 0;
        }

        .variant-secondary .btn-spinner,
        .variant-ghost     .btn-spinner,
        .variant-danger    .btn-spinner {
          border-color: rgba(184, 160, 216, 0.25);
          border-top-color: #b8a0d8;
        }

        @keyframes btnSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}