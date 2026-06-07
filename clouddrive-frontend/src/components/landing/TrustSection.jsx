
export default function TrustSection() {
  return (
    <section className="py-xl bg-surface relative overflow-hidden">
      <div className="container mx-auto px-margin">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
          <div className="text-center p-md reveal">
            <div
              className="font-h1 text-h1 text-primary mb-xs counter-value"
              data-suffix="K+"
              data-target="10000"
            >
              10K+
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              Files Stored
            </div>
          </div>

          <div className="text-center p-md reveal">
            <div
              className="font-h1 text-h1 text-primary mb-xs counter-value"
              data-decimals="1"
              data-suffix="%"
              data-target="99.9"
            >
              99.9%
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              Reliability
            </div>
          </div>

          <div className="text-center p-md reveal">
            <div className="font-h1 text-h1 text-primary mb-xs">256-bit</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              Encryption
            </div>
          </div>

          <div className="text-center p-md reveal">
            <div
              className="font-h1 text-h1 text-primary mb-xs counter-value"
              data-suffix="M+"
              data-target="1000000"
            >
              1M+
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              Users Trusted
            </div>
          </div>
        </div>

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function useCountUp(target, start = 0, durationMs = 1400) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    let raf = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, durationMs]);

  return value;
}

function TrustCard({ icon, label, value, suffix }) {
  const count = useCountUp(value, 0, 1300);

  return (
    <motion.div
      className="bg-surface-container-lowest/60 backdrop-blur border border-outline-variant/70 rounded-2xl p-lg shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-md">
        <div className="w-12 h-12 rounded-xl bg-primary-container/25 border border-outline-variant/60 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>
        <div>
          <div className="text-h3 font-bold text-on-surface">
            {count}
            {suffix || ""}
          </div>
          <div className="text-body-md text-on-surface-variant font-semibold">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TrustSection() {
  const metrics = useMemo(
    () => [
      { icon: "folder", label: "Files Stored", value: 10000, suffix: "+" },
      { icon: "verified", label: "Reliability", value: 99, suffix: ".9%" },
      { icon: "security", label: "Secure Sharing", value: 100, suffix: "%" },
      { icon: "monitoring", label: "Real-Time Analytics", value: 24, suffix: "/7" },
    ],
    []
  );

  return (
    <section id="trust" className="mx-auto max-w-7xl px-md py-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-lg mb-lg">
        <div>
          <motion.h2
            className="font-h2 text-h2 text-on-background"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Trusted by teams who move fast
          </motion.h2>
          <p className="mt-md text-body-md text-on-surface-variant max-w-2xl">
            Built for security, speed, and clarity—so you can store confidently and
            act on data instantly.
          </p>
        </div>

        <motion.div
          className="inline-flex items-center gap-sm px-md py-xs rounded-full bg-surface-container-lowest/60 border border-outline-variant/70 backdrop-blur shadow-sm"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <span className="material-symbols-outlined text-primary">sparkle</span>
          <span className="text-body-md font-semibold text-on-surface-variant">
            Premium-grade performance
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {metrics.map((m) => (
          <TrustCard
            key={m.label}
            icon={m.icon}
            label={m.label}
            value={m.value}
            suffix={m.suffix}
          />
        ))}

      </div>
    </section>
  );
}

export default TrustSection;

