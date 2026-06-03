import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import TrustSection from "../components/landing/TrustSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import AnalyticsShowcase from "../components/landing/AnalyticsShowcase";
import SecuritySection from "../components/landing/SecuritySection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
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

  const page = useMemo(() => {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <LandingNavbar />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-20"
        >
          <HeroSection />
          <TrustSection />
          <FeaturesSection />
          <AnalyticsShowcase />
          <SecuritySection />
          <HowItWorksSection />
          <TestimonialsSection />
          <LandingCTASection />
        </motion.main>

        <LandingFooter />
      </div>
    );
  }, []);

  // While loading auth, show a lightweight shell without layout shift.
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

  return page;
}

export default LandingPage;

