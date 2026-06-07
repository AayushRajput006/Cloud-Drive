
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
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function StatPill({ icon, label }) {
  return (
    <div className="flex items-center gap-sm px-md py-xs rounded-full bg-surface-container-lowest/70 border border-outline-variant/70 shadow-sm">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <span className="text-body-md font-semibold text-on-surface-variant">{label}</span>
    </div>
  );
}

function MockCard({ title, icon, sub }) {
  return (
    <motion.div
      className="bg-surface-container-lowest/60 border border-outline-variant/70 rounded-xl p-md shadow-sm backdrop-blur"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -3 }}
    >
      <div className="flex items-center gap-sm mb-sm">
        <div className="w-10 h-10 rounded-lg bg-primary-container/25 border border-outline-variant/60 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-body-md font-semibold text-on-surface">{title}</p>
          <p className="text-label-sm text-on-surface-variant truncate">{sub}</p>
        </div>
      </div>
      <div className="h-2 w-full bg-outline-variant/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: "20%" }}
          animate={{ width: ["35%", "70%", "55%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-md pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-sm px-md py-xs rounded-full bg-surface-container-lowest/60 border border-outline-variant/70 shadow-sm backdrop-blur"
          >
            <span className="material-symbols-outlined text-primary">cloud</span>
            <span className="text-body-md font-semibold text-on-surface-variant">
              Premium cloud storage for teams
            </span>
          </motion.div>

          <h1 className="mt-md font-h1 text-h1 text-on-background leading-tight">
            Your Files. Anywhere. Anytime.
          </h1>

          <p className="mt-md text-body-lg text-on-surface-variant max-w-xl">
            Store, manage, share, and analyze your files securely in one intelligent cloud platform.
          </p>

          <div className="mt-xl flex flex-col sm:flex-row gap-sm sm:items-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-xl py-sm rounded-xl bg-primary text-on-primary font-semibold shadow-sm hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined mr-sm">sparkles</span>
              Get Started Free
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center px-xl py-sm rounded-xl bg-surface-container-lowest border border-outline-variant/70 text-on-surface-variant font-semibold shadow-sm hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined mr-sm">login</span>
              Login
            </Link>
          </div>

          <div className="mt-xl flex flex-wrap gap-sm">
            <StatPill icon="storage" label="2GB Uploads" />
            <StatPill icon="shield" label="Encrypted by Design" />
            <StatPill icon="timeline" label="Real-time Analytics" />
          </div>
        </div>

        <div className="relative">
          <motion.div
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary-container/25 blur-2xl"
            animate={{ x: [0, 10, 0], y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-10 -right-8 w-48 h-48 rounded-full bg-secondary-container/20 blur-2xl"
            animate={{ x: [0, -12, 0], y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-md">
            <MockCard title="Upload progress" icon="upload" sub="Syncing your latest files…" />
            <MockCard title="Storage chart" icon="pie_chart" sub="Usage insights at a glance" />
            <MockCard title="File cards" icon="folder" sub="Fast preview and organization" />
            <MockCard title="Analytics widget" icon="insights" sub="Trends & sharing intelligence" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
