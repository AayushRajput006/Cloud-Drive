import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
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

