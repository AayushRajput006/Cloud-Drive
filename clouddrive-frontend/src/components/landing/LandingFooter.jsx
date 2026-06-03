import { Link } from "react-router-dom";

const social = [
  { icon: "public", label: "Website" },
  { icon: "chat", label: "Community" },
  { icon: "verified_user", label: "Updates" },
];

function LandingFooter() {
  return (
    <footer id="contact" className="mt-auto border-t border-outline-variant/70 bg-surface/30 backdrop-blur">
      <div className="mx-auto max-w-7xl px-md py-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-lg">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-xl bg-primary-container/25 border border-outline-variant/60 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">cloud</span>
            </div>
            <div>
              <div className="font-bold text-primary text-h2">Cloud Drive</div>
              <div className="text-body-md text-on-surface-variant mt-xs">
                Premium glassmorphism SaaS cloud storage.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-sm items-center">
            <Link to="/" className="text-body-md font-semibold text-on-surface-variant hover:text-primary transition-colors">
              Home
            </Link>
            <a href="#features" className="text-body-md font-semibold text-on-surface-variant hover:text-primary transition-colors">
              Features
            </a>
            <Link to="/login" className="text-body-md font-semibold text-on-surface-variant hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/signup" className="text-body-md font-semibold text-on-surface-variant hover:text-primary transition-colors">
              Signup
            </Link>
          </div>
        </div>

        <div className="mt-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-lg">
          <div className="flex items-center gap-md">
            {social.map((s) => (
              <button
                key={s.label}
                className="w-10 h-10 rounded-xl bg-surface-container-lowest/70 border border-outline-variant/70 hover:bg-surface-container-low transition-colors flex items-center justify-center"
                aria-label={s.label}
                type="button"
              >
                <span className="material-symbols-outlined text-primary">{s.icon}</span>
              </button>
            ))}
          </div>

          <div className="text-body-md text-on-surface-variant">
            © {new Date().getFullYear()} Cloud Drive. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
