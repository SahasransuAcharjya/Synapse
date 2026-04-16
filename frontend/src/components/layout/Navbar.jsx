"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/dashboard",     label: "Dashboard",    icon: "✦" },
  { href: "/mood-tracker",  label: "Mood",         icon: "🌙" },
  { href: "/journal",       label: "Journal",      icon: "📓" },
  { href: "/therapy",       label: "Therapy",      icon: "🌿" },
];

export default function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [user, setUser]           = useState(null);
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("synapseUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("synapseToken");
    localStorage.removeItem("synapseUser");
    router.push("/login");
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  if (!mounted) return null;

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Brand */}
          <Link href={user ? "/dashboard" : "/"} className="brand">
            <div className="brand-orb" />
            <span className="brand-name">Synapse</span>
          </Link>

          {/* Desktop Links */}
          {user && (
            <div className="nav-links">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive(link.href) ? "active" : ""}`}
                >
                  <span className="link-icon">{link.icon}</span>
                  <span className="link-label">{link.label}</span>
                  {isActive(link.href) && <span className="active-dot" />}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="nav-right">
            {user ? (
              <>
                <div className="user-chip">
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user.name?.split(" ")[0]}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-auth-link">Sign in</Link>
                <Link href="/signup" className="nav-auth-btn">Get started</Link>
              </>
            )}

            {/* Mobile hamburger */}
            {user && (
              <button
                className={`hamburger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                <span />
                <span />
                <span />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && user && (
        <>
          <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="mobile-drawer">
            <div className="drawer-user">
              <div className="drawer-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="drawer-name">{user.name}</p>
                <p className="drawer-email">{user.email}</p>
              </div>
            </div>

            <hr className="drawer-divider" />

            <div className="drawer-links">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`drawer-link ${isActive(link.href) ? "drawer-active" : ""}`}
                >
                  <span className="drawer-icon">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            <hr className="drawer-divider" />

            <button className="drawer-logout" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        /* ── Navbar ── */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 500;
          padding: 0.9rem 2rem;
          transition: background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.68);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.80);
          box-shadow: 0 2px 20px rgba(140, 120, 180, 0.10);
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        /* Brand */
        .brand {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-orb {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(210, 190, 240, 0.92),
            rgba(155, 195, 228, 0.78),
            rgba(155, 215, 190, 0.62)
          );
          box-shadow: 0 0 14px rgba(190, 165, 228, 0.50);
          animation: orbBreath 4s ease-in-out infinite;
        }

        @keyframes orbBreath {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.07); }
        }

        .brand-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #2a2040;
          letter-spacing: 0.04em;
        }

        /* Desktop Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 500;
          color: #6a6080;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }

        .nav-link:hover {
          background: rgba(184, 160, 216, 0.12);
          color: #3a3050;
        }

        .nav-link.active {
          background: rgba(184, 160, 216, 0.16);
          color: #3a3050;
          font-weight: 600;
        }

        .link-icon { font-size: 0.82rem; }
        .link-label { line-height: 1; }

        .active-dot {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
        }

        /* Right side */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .user-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.80);
          border-radius: 999px;
          padding: 0.28rem 0.75rem 0.28rem 0.28rem;
          box-shadow: 0 1px 8px rgba(160, 130, 200, 0.10);
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.82rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #3a3050;
        }

        .logout-btn {
          font-family: inherit;
          font-size: 0.82rem;
          padding: 0.4rem 0.9rem;
          background: rgba(184, 160, 216, 0.10);
          border: 1px solid rgba(184, 160, 216, 0.22);
          border-radius: 10px;
          color: #7a6090;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }

        .logout-btn:hover {
          background: rgba(184, 160, 216, 0.22);
          transform: translateY(-1px);
        }

        .nav-auth-link {
          font-size: 0.9rem;
          font-weight: 500;
          color: #6a6080;
          text-decoration: none;
          padding: 0.4rem 0.8rem;
          border-radius: 10px;
          transition: background 0.2s, color 0.2s;
        }

        .nav-auth-link:hover {
          background: rgba(184, 160, 216, 0.12);
          color: #3a3050;
        }

        .nav-auth-btn {
          font-size: 0.88rem;
          font-weight: 600;
          color: white;
          text-decoration: none;
          padding: 0.48rem 1.1rem;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          border-radius: 10px;
          box-shadow: 0 3px 12px rgba(184, 160, 216, 0.38);
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        }

        .nav-auth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(184, 160, 216, 0.52);
          color: white;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          border-radius: 2px;
          background: #6a6080;
          transition: transform 0.25s ease, opacity 0.25s ease;
          transform-origin: center;
        }

        .hamburger.open span:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .hamburger.open span:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Mobile Drawer */
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 490;
          background: rgba(42, 32, 64, 0.30);
          backdrop-filter: blur(3px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 495;
          width: min(320px, 85vw);
          background: rgba(255, 255, 255, 0.90);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-left: 1px solid rgba(255, 255, 255, 0.90);
          box-shadow: -8px 0 40px rgba(140, 120, 180, 0.18);
          padding: 5rem 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: drawerSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        @keyframes drawerSlide {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }

        .drawer-user {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .drawer-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b8a0d8, #90b8d0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .drawer-name {
          font-weight: 600;
          color: #2a2040;
          font-size: 0.95rem;
          margin: 0;
        }

        .drawer-email {
          font-size: 0.78rem;
          color: #9080a8;
          margin: 0;
        }

        .drawer-divider {
          border: none;
          border-top: 1px solid rgba(184, 160, 216, 0.18);
        }

        .drawer-links {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .drawer-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 14px;
          font-size: 0.95rem;
          font-weight: 500;
          color: #5a5070;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }

        .drawer-link:hover {
          background: rgba(184, 160, 216, 0.12);
          color: #2a2040;
        }

        .drawer-link.drawer-active {
          background: rgba(184, 160, 216, 0.18);
          color: #2a2040;
          font-weight: 600;
        }

        .drawer-icon { font-size: 1rem; }

        .drawer-logout {
          margin-top: auto;
          padding: 0.75rem;
          background: rgba(220, 100, 100, 0.08);
          border: 1px solid rgba(220, 100, 100, 0.18);
          border-radius: 14px;
          color: #b05555;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .drawer-logout:hover { background: rgba(220, 100, 100, 0.15); }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-links    { display: none; }
          .user-name    { display: none; }
          .logout-btn   { display: none; }
          .hamburger    { display: flex; }
          .navbar       { padding: 0.75rem 1.25rem; }
        }

        @media (max-width: 480px) {
          .nav-auth-link { display: none; }
        }
      `}</style>
    </>
  );
}