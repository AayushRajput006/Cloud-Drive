import { useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const authBtnRef = useRef(null);

  // Self-contained animation CSS for this component
  const heroAnimStyle = `
    @keyframes heroFadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      45% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(0); }
    }

    .hero-enter {
      animation: heroFadeInUp 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
      opacity: 0;
    }
    .hero-enter-delay-1 { animation-delay: 0.15s; }
    .hero-enter-delay-2 { animation-delay: 0.3s; }
    .hero-enter-delay-3 { animation-delay: 0.45s; }
    .hero-enter-delay-4 { animation-delay: 0.6s; }

    /* Keep orb animations working even if landing.css changes */
    @keyframes gradient-shift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(30px, -20px) scale(1.08); }
    }
    @keyframes gradient-shift-alt {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-25px, 15px) scale(1.05); }
    }
    .hero-orb { animation: gradient-shift 12s ease-in-out infinite; }
    .hero-orb-alt { animation: gradient-shift-alt 10s ease-in-out infinite; }
  `;

  useEffect(() => {
    if (!authBtnRef.current) return;
    if (isAuthenticated) {
      authBtnRef.current.innerHTML = `
        <button
          class="w-full sm:w-auto font-h3 text-h3 bg-primary text-on-primary px-xl py-md rounded-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          onclick="window.__clouddriveNavigate && window.__clouddriveNavigate('/dashboard')"
        >
          Go to Dashboard
        </button>
      `;
    } else {
      authBtnRef.current.innerHTML = `
        <button class="w-full sm:w-auto font-h3 text-h3 bg-primary text-on-primary px-xl py-md rounded-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          onclick="window.__clouddriveNavigate && window.__clouddriveNavigate('/signup')"
        >
          Get Started Free
        </button>
        <button class="w-full sm:w-auto font-h3 text-h3 border border-outline-variant bg-surface text-on-surface px-xl py-md rounded-lg hover:bg-surface-container-low transition-all"
          onclick="window.__clouddriveNavigate && window.__clouddriveNavigate('/login')"
        >
          Sign In
        </button>
      `;
    }
  }, [isAuthenticated]);

  return (
    <>
      <style>{heroAnimStyle}</style>

      {/* Hero Section */}
      <section className="relative pt-xl pb-24 hero-gradient overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl hero-orb pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-secondary-container/15 rounded-full blur-3xl hero-orb-alt pointer-events-none" aria-hidden="true" />

        <div className="container mx-auto px-margin text-center relative z-10">
          <div className="hero-enter hero-enter-delay-1 inline-flex items-center gap-xs bg-primary-fixed text-on-primary-fixed-variant px-md py-xs rounded-full mb-lg border border-primary/10">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'opsz' 20" }}
            >
              auto_awesome
            </span>
            <span className="font-label-sm text-label-sm">Now powered by Intelligent Analysis</span>
          </div>

          <h1 className="hero-enter hero-enter-delay-2 font-h1 text-h1 md:text-6xl text-on-surface max-w-4xl mx-auto mb-md leading-tight">
            Your Files. <span className="text-primary">Anywhere.</span> Anytime.
          </h1>

          <p className="hero-enter hero-enter-delay-3 font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-xl">
            Store, manage, share, and analyze your files securely in one intelligent cloud platform built for modern teams and creators.
          </p>

          <div
            className="hero-enter hero-enter-delay-4 flex flex-col sm:flex-row items-center justify-center gap-md mb-24"
            id="auth-state-container"
            ref={authBtnRef}
          >
            <button
              className="w-full sm:w-auto font-h3 text-h3 bg-primary text-on-primary px-xl py-md rounded-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
              onClick={() => navigate("/signup")}
              style={{ display: isAuthenticated ? "none" : undefined }}
            >
              Get Started Free
            </button>
            <button
              className="w-full sm:w-auto font-h3 text-h3 border border-outline-variant bg-surface text-on-surface px-xl py-md rounded-lg hover:bg-surface-container-low transition-all"
              onClick={() => navigate("/login")}
              style={{ display: isAuthenticated ? "none" : undefined }}
            >
              Sign In
            </button>
            <button
              className="w-full sm:w-auto font-h3 text-h3 bg-primary text-on-primary px-xl py-md rounded-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all"
              onClick={() => navigate("/dashboard")}
              style={{ display: isAuthenticated ? undefined : "none" }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
