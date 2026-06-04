import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import TrustSection from "../components/landing/TrustSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import AnalyticsShowcase from "../components/landing/AnalyticsShowcase";
import SecuritySection from "../components/landing/SecuritySection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import PricingSection from "../components/landing/PricingSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import LandingCTASection from "../components/landing/LandingCTASection";
import LandingFooter from "../components/landing/LandingFooter";
import { useAuth } from "../contexts/AuthContext";

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && !hasRedirected) {
      setHasRedirected(true);
      navigate("/dashboard", { replace: true });
    }
  }, [hasRedirected, isAuthenticated, loading, navigate]);

  useEffect(() => {
    // Match the provided HTML page animation behavior:
    // - IntersectionObserver toggles `.active` on `.reveal*`, `.counter-value`, `.bar-grow`, and shimmer.
    const initScrollAnimations = () => {
      const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      };

      const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          el.classList.add("active");

          // Counter animation (only if your markup uses counter-value)
          if (el.classList.contains("counter-value")) {
            const dataset = el.dataset || {};
            const target = parseFloat(dataset.target || "0");
            const suffix = dataset.suffix || "";
            const decimals = parseInt(dataset.decimals || "0", 10);

            if (el.dataset.started) return;
            el.dataset.started = "true";

            const duration = 2000;
            const frameRate = 1000 / 60;
            const totalFrames = Math.round(duration / frameRate);
            let currentFrame = 0;

            const timer = setInterval(() => {
              currentFrame += 1;
              const progress = currentFrame / totalFrames;

              const easeOutQuad = 1 - (1 - progress) * (1 - progress);
              const currentValue = (target * easeOutQuad).toFixed(decimals);

              let displayValue = currentValue;
              if (target >= 10000 && suffix.includes("K")) displayValue = (currentValue / 1000).toFixed(0);
              if (target >= 1000000 && suffix.includes("M")) displayValue = (currentValue / 1000000).toFixed(0);

              el.innerText = `${displayValue}${suffix}`;

              if (currentFrame === totalFrames) {
                clearInterval(timer);
              }
            }, frameRate);
          }

          // Bar chart bars
          const bars = el.querySelectorAll?.(".bar-grow") || [];
          if (bars.length > 0) {
            bars.forEach((bar) => bar.classList.add("active"));
          }
        });
      }, observerOptions);

      const observeSelectors = [
        ".reveal",
        ".reveal-left",
        ".reveal-right",
        ".reveal-scale",
        ".counter-value",
        ".chart-container",
      ].join(", ");

      document.querySelectorAll(observeSelectors).forEach((node) => {
        scrollObserver.observe(node);
      });

      // Pricing shimmer: add `active-shimmer` when pricing-pro is visible
      const pricingPro = document.getElementById("pricing-pro");
      if (pricingPro) {
        const proObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) entry.target.classList.add("active-shimmer");
            });
          },
          { threshold: 0.5 }
        );
        proObserver.observe(pricingPro);
      }
    };

    initScrollAnimations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <LandingNavbar />
        <div className="pt-20 px-md pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-md">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="text-body-md text-on-surface-variant">Loading…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <LandingNavbar />
      <main className="pt-20">
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <AnalyticsShowcase />
        <SecuritySection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <LandingCTASection />
      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;

