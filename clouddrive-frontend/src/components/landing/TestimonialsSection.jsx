import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aisha Thompson",
    role: "Product Lead, Atlas Studio",
    quote:
      "Cloud Drive feels like a premium product. Sharing is effortless, and the analytics make it obvious what to do next.",
    icon: "format_quote",
  },
  {
    name: "Mateo Rivera",
    role: "Engineering Manager, Northbyte",
    quote:
      "The glassmorphism UI is beautiful, but the real win is performance—uploads and file management stay snappy even at scale.",
    icon: "support_agent",
  },
  {
    name: "Sana Karim",
    role: "Operations, Brightline Ops",
    quote:
      "We moved from scattered tools to a single workflow. OTP verification and JWT security made adoption smooth for our team.",
    icon: "verified",
  },
  {
    name: "Noah Chen",
    role: "Designer, Linear-ish Labs",
    quote:
      "The experience is clean and modern. Stars, recent tracking, and smart trash recovery keep our team organized.",
    icon: "star",
  },
];

function TestimonialCard({ t, index }) {
  return (
    <motion.div
      className="bg-surface-container-lowest/60 backdrop-blur border border-outline-variant/70 rounded-3xl p-lg shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start gap-md">
        <div className="w-12 h-12 rounded-2xl bg-primary-container/25 border border-outline-variant/60 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">{t.icon}</span>
        </div>
        <div className="min-w-0">
          <div className="text-body-md font-bold text-on-background">{t.name}</div>
          <div className="text-label-sm text-on-surface-variant font-semibold mt-1">{t.role}</div>
        </div>
      </div>

      <p className="mt-md text-body-lg text-on-surface-variant leading-relaxed">
        “{t.quote}”
      </p>

      <div className="mt-md flex items-center gap-xs text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="material-symbols-outlined text-sm">
            star
          </span>
        ))}
        <span className="ml-sm text-body-md font-semibold text-on-surface-variant">
          5.0
        </span>
      </div>
    </motion.div>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-md py-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-lg mb-lg">
        <div>
          <motion.h2
            className="font-h2 text-h2 text-on-background"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Teams love the workflow
          </motion.h2>
          <p className="mt-md text-body-md text-on-surface-variant max-w-2xl">
            Real teams, real outcomes—fewer tools, faster organization, better visibility.
          </p>
        </div>

        <motion.div
          className="px-md py-xs rounded-full bg-surface-container-lowest/60 border border-outline-variant/70 backdrop-blur shadow-sm"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <span className="text-body-md font-semibold text-on-surface-variant inline-flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">eco</span>
            Zero-compromise UX
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {testimonials.map((t, idx) => (
          <TestimonialCard key={t.name} t={t} index={idx} />
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;
