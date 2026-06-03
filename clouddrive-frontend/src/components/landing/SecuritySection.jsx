import { motion } from "framer-motion";

const securityCards = [
  {
    icon: "verified",
    title: "JWT Authentication",
    desc: "Secure token-based access for protected resources across the app.",
  },
  {
    icon: "lock",
    title: "Encrypted Access",
    desc: "Encryption-first practices help safeguard files and sharing payloads.",
  },
  {
    icon: "mark_email_read",
    title: "OTP Email Verification",
    desc: "Account verification flows reduce spoofing and strengthen trust.",
  },
  {
    icon: "share",
    title: "Protected Sharing",
    desc: "Share files safely with permission-aware access controls.",
  },
];

function SecuritySection() {
  return (
    <section id="security" className="mx-auto max-w-7xl px-md py-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-lg mb-lg">
        <div>
          <motion.h2
            className="font-h2 text-h2 text-on-background"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Security that’s invisible—until you need it
          </motion.h2>
          <p className="mt-md text-body-md text-on-surface-variant max-w-2xl">
            Cloud Drive uses JWT authentication, OTP verification, and permission-aware sharing
            to keep your workflow fast and your data protected.
          </p>
        </div>

        <motion.div
          className="px-md py-xs rounded-full bg-surface-container-lowest/60 border border-outline-variant/70 backdrop-blur shadow-sm"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <span className="inline-flex items-center gap-sm text-body-md font-semibold text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">security</span>
            Built with trust at the core
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        {securityCards.map((c, idx) => (
          <motion.div
            key={c.title}
            className="bg-surface-container-lowest/60 border border-outline-variant/70 rounded-2xl p-lg shadow-sm backdrop-blur"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.03 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start gap-md">
              <div className="w-12 h-12 rounded-xl bg-primary-container/25 border border-outline-variant/60 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">{c.icon}</span>
              </div>
              <div>
                <h3 className="text-body-lg font-bold text-on-background">{c.title}</h3>
                <p className="mt-sm text-body-md text-on-surface-variant leading-relaxed">{c.desc}</p>
              </div>
            </div>

            <div className="mt-md h-2 w-full bg-outline-variant/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "25%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default SecuritySection;
