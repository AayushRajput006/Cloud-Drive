
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingNavbar() {
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing", disabled: true },
  { label: "Contact", href: "#contact" },
];

function LandingNavbar() {
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {

    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (

    <nav
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl glass-nav rounded-2xl px-xl py-md min-h-[72px] flex items-center justify-between shadow-lg transition-all duration-300 ${
        scrolled ? "py-sm min-h-[60px] scale-[0.98] top-sm nav-scrolled" : "top-md"
      }`}
      id="main-nav"
    >
      <div
        className="flex items-center gap-md cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span
          className="material-symbols-outlined text-primary text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          cloud
        </span>
        <span className="text-2xl font-bold text-primary tracking-tight">
          CloudDrive
        </span>
      </div>

      <div className="hidden md:flex items-center gap-xl">
        <a
          className="text-base font-medium text-on-surface-variant hover:text-primary transition-colors"
          href="#features"
        >
          Features
        </a>
        <a
          className="text-base font-medium text-on-surface-variant hover:text-primary transition-colors"
          href="#analytics"
        >
          Analytics
        </a>
        <a
          className="text-base font-medium text-on-surface-variant hover:text-primary transition-colors"
          href="#security"
        >
          Security
        </a>
        <a
          className="text-base font-medium text-on-surface-variant hover:text-primary transition-colors"
          href="#pricing"
        >
          Pricing
        </a>
        <a
          className="text-base font-medium text-on-surface-variant hover:text-primary transition-colors"
          href="#contact"
        >
          Contact
        </a>
      </div>

      <div className="flex items-center gap-lg">
        <button
          className="text-base font-medium text-on-surface px-lg py-md hover:bg-surface-container-low rounded-xl transition-all"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="text-base font-semibold bg-primary text-on-primary px-xl py-md rounded-xl hover:bg-primary-container shadow-md transition-all"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}


    <header
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-300",
        scrolled ? "bg-surface/70 backdrop-blur-xl border-b border-outline-variant/60" : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-md h-16 flex items-center justify-between">
        <div className="flex items-center gap-md">
          <button
            onClick={() => {
              if (isAuthenticated) navigate("/dashboard");
              else navigate("/");
            }}
            className="flex items-center gap-sm"
            aria-label="Cloud Drive Home"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-container/80 border border-outline-variant/60 flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-[20px]">cloud</span>
            </div>
            <span className="text-h2 font-bold text-primary hidden sm:block">Cloud Drive</span>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-lg">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.disabled ? "#pricing" : item.href}
              className={[
                "text-body-md font-semibold",
                "text-on-surface-variant hover:text-primary transition-colors",
                item.disabled ? "opacity-50 cursor-not-allowed hover:text-on-surface-variant" : "",
              ].join(" ")}
              onClick={(e) => {
                if (item.disabled) e.preventDefault();
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-md">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-md py-sm rounded-xl bg-primary text-on-primary font-semibold shadow-sm hover:bg-primary-container transition-colors"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-md py-sm rounded-xl bg-surface-container-lowest border border-outline-variant/70 text-on-surface-variant font-semibold hover:bg-surface-container-low transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-md py-sm rounded-xl bg-primary text-on-primary font-semibold shadow-sm hover:bg-primary-container transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default LandingNavbar;

