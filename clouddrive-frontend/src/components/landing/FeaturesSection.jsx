
export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="container mx-auto px-margin">
        <div className="text-center mb-24 reveal">
          <h2 className="font-h2 text-h2 md:text-h1 mb-md">
            Everything you need to <span className="text-primary">manage data</span>.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Powerful tools designed for speed, security, and simplicity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg" id="features-grid">
          <div className="reveal p-lg rounded-xl border border-outline-variant hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group" style={{ transitionDelay: "0ms" }}>
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
            </div>
            <h3 className="font-h3 text-h3 mb-sm">Secure Storage</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Military-grade encryption for every byte you store on our infrastructure.
            </p>
          </div>

          <div className="reveal p-lg rounded-xl border border-outline-variant hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group" style={{ transitionDelay: "100ms" }}>
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">share</span>
            </div>
            <h3 className="font-h3 text-h3 mb-sm">Sharing</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Collaborate effortlessly with password-protected links and expiry dates.
            </p>
          </div>

          <div className="reveal p-lg rounded-xl border border-outline-variant hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group" style={{ transitionDelay: "200ms" }}>
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">monitoring</span>
            </div>
            <h3 className="font-h3 text-h3 mb-sm">Analytics</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Get deep insights into file access, download trends, and user behavior.
            </p>
          </div>

          <div className="reveal p-lg rounded-xl border border-outline-variant hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group" style={{ transitionDelay: "300ms" }}>
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">track_changes</span>
            </div>
            <h3 className="font-h3 text-h3 mb-sm">Tracking</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Real-time activity logs show you exactly who accessed what and when.
            </p>
          </div>

          <div className="reveal p-lg rounded-xl border border-outline-variant hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group" style={{ transitionDelay: "0ms" }}>
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
            <h3 className="font-h3 text-h3 mb-sm">Starred</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Keep your most important files one click away with favorites pinning.
            </p>
          </div>

          <div className="reveal p-lg rounded-xl border border-outline-variant hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group" style={{ transitionDelay: "100ms" }}>
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">delete</span>
            </div>
            <h3 className="font-h3 text-h3 mb-sm">Trash Recovery</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Accidental deletion? Our 30-day trash recovery has you covered.
            </p>
          </div>

          <div className="reveal p-lg rounded-xl border border-outline-variant hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group" style={{ transitionDelay: "200ms" }}>
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">cloud_download</span>
            </div>
            <h3 className="font-h3 text-h3 mb-sm">Cloud Access</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Sync files across all devices with our lightweight desktop and mobile apps.
            </p>
          </div>

          <div className="reveal p-lg rounded-xl border border-outline-variant hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group" style={{ transitionDelay: "300ms" }}>
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">verified_user</span>
            </div>
            <h3 className="font-h3 text-h3 mb-sm">JWT Auth</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Enterprise-standard JSON Web Token authentication for secure sessions.
            </p>
          </div>
        </div>
import { motion } from "framer-motion";

const features = [
  {
    icon: "lock",
    title: "Secure File Storage",
    desc: "Glass-smooth encryption layers that keep your data protected end-to-end.",
  },
  {
    icon: "share",
    title: "File Sharing",
    desc: "Send links, set permissions, and track access with zero friction.",
  },
  {
    icon: "analytics",
    title: "Storage Analytics Dashboard",
    desc: "Understand usage, trends, and sharing insights at a glance.",
  },
  {
    icon: "history",
    title: "Recent Files Tracking",
    desc: "Find what you need instantly—recent activity, curated and searchable.",
  },
  {
    icon: "star",
    title: "Starred Files",
    desc: "Pin important files for fast access across devices.",
  },
  {
    icon: "restore",
    title: "Smart Trash Recovery",
    desc: "Recover recently deleted files with safety-first restore flows.",
  },
  {
    icon: "cloud",
    title: "Cloud-Based Access",
    desc: "Your files are always available—anywhere, anytime, on any device.",
  },
  {
    icon: "verified",
    title: "JWT Secure Authentication",
    desc: "JWT-based authentication ensures secure access across the platform.",
  },
];

function FeatureCard({ icon, title, desc, index }) {
  return (
    <motion.div
      className="bg-surface-container-lowest/60 border border-outline-variant/70 rounded-2xl p-lg shadow-sm backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start gap-md">
        <div className="w-12 h-12 rounded-xl bg-primary-container/25 border border-outline-variant/60 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>

        <div className="min-w-0">
          <h3 className="text-body-lg font-bold text-on-background">{title}</h3>
          <p className="mt-sm text-body-md text-on-surface-variant leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-md py-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-lg mb-lg">
        <div>
          <motion.h2
            className="font-h2 text-h2 text-on-background"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Built for secure, effortless file management
          </motion.h2>
          <p className="mt-md text-body-md text-on-surface-variant max-w-2xl">
            Glassmorphism-first UI meets production-grade security and smooth
            workflows—so every interaction feels instant.
          </p>
        </div>

        <motion.div
          className="px-md py-xs rounded-full bg-surface-container-lowest/60 border border-outline-variant/70 backdrop-blur shadow-sm"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <span className="text-body-md font-semibold text-on-surface-variant">
            Premium features included
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {features.map((f, idx) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} index={idx} />
        ))}
      </div>
    </section>
  );
}


export default FeaturesSection;

