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
