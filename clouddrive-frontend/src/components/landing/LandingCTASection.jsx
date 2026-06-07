
export default function LandingCTASection() {
  return (
    <section className="py-24 bg-primary/5 relative overflow-hidden" id="contact">
      <div className="container mx-auto px-margin relative z-10">
        <div className="glass-card p-xl rounded-2xl text-center">
          <div className="inline-flex items-center gap-xs bg-primary-fixed text-on-primary-fixed-variant px-md py-xs rounded-full mb-lg border border-primary/10">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'opsz' 20" }}
            >
              auto_awesome
            </span>
            <span className="font-label-sm text-label-sm">
              Now powered by Intelligent Analysis
            </span>
          </div>

          <h2 className="font-h2 text-h2 md:text-h1 mb-md">
            Ready to store smarter?
          </h2>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-xl">
            Get started free, and upgrade when you need more storage, security, and team features.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
            <button
              className="w-full sm:w-auto font-h3 text-h3 bg-primary text-on-primary px-xl py-md rounded-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
              onclick="window.location.href='/signup'"
            >
              Get Started Free
            </button>

            <button
              className="w-full sm:w-auto font-h3 text-h3 border border-outline-variant bg-surface text-on-surface px-xl py-md rounded-lg hover:bg-surface-container-low transition-all"
              onclick="window.location.href='/login'"
            >
              Sign In
            </button>
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function LandingCTASection() {
  return (
    <section className="mx-auto max-w-7xl px-md py-xl" id="pricing">
      <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest/60 border border-outline-variant/70 backdrop-blur shadow-sm">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-container/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-secondary-container/20 blur-3xl" />

        <div className="relative p-lg lg:p-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-center">
            <div className="lg:col-span-2">
              <motion.h2
                className="font-h2 text-h2 text-on-background"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Ready to organize your digital files?
              </motion.h2>

              <p className="mt-md text-body-md text-on-surface-variant max-w-2xl">
                Start free. Upgrade when you’re ready—keep security, sharing, and analytics in one place.
              </p>

              <div className="mt-lg flex flex-wrap gap-sm">
                <div className="px-md py-xs rounded-full bg-surface-container-lowest/70 border border-outline-variant/70 text-body-md font-semibold text-on-surface-variant inline-flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  JWT-secured access
                </div>
                <div className="px-md py-xs rounded-full bg-surface-container-lowest/70 border border-outline-variant/70 text-body-md font-semibold text-on-surface-variant inline-flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">mark_email_read</span>
                  OTP verification
                </div>
              </div>
            </div>

            <motion.div
              className="flex flex-col items-stretch gap-sm"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <Link
                to="/signup"
                className="w-full px-xl py-sm rounded-xl bg-primary text-on-primary font-semibold shadow-sm hover:bg-primary-container transition-colors text-center"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="w-full px-xl py-sm rounded-xl bg-surface-container-lowest border border-outline-variant/70 text-on-surface-variant font-semibold hover:bg-surface-container-low transition-colors text-center"
              >
                Login
              </Link>
              <p className="text-label-sm text-on-surface-variant text-center">
                No credit card required • Cancel anytime
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingCTASection;
