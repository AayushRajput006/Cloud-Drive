
export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-margin">
        <div className="text-center mb-24 reveal">
          <h2 className="font-h2 text-h2 md:text-h1">
            Five steps to <span className="text-primary">freedom</span>.
          </h2>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container -translate-y-1/2 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-xl relative z-10">
            <div className="text-center group reveal timeline-step">
              <div className="w-16 h-16 bg-white border-2 border-primary rounded-full mx-auto flex items-center justify-center mb-md group-hover:bg-primary group-hover:text-white shadow-xl step-circle">
                <span className="font-h3 text-h3">1</span>
              </div>
              <h4 className="font-h3 text-h3 mb-xs">Account</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Sign up for your free 10GB drive.
              </p>
            </div>

            <div className="text-center group reveal timeline-step">
              <div className="w-16 h-16 bg-white border-2 border-primary rounded-full mx-auto flex items-center justify-center mb-md group-hover:bg-primary group-hover:text-white shadow-xl step-circle">
                <span className="font-h3 text-h3">2</span>
              </div>
              <h4 className="font-h3 text-h3 mb-xs">Verify</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Secure your identity with MFA.</p>
            </div>

            <div className="text-center group reveal timeline-step">
              <div className="w-16 h-16 bg-white border-2 border-primary rounded-full mx-auto flex items-center justify-center mb-md group-hover:bg-primary group-hover:text-white shadow-xl step-circle">
                <span className="font-h3 text-h3">3</span>
              </div>
              <h4 className="font-h3 text-h3 mb-xs">Upload</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Drag and drop any file type.</p>
            </div>

            <div className="text-center group reveal timeline-step">
              <div className="w-16 h-16 bg-white border-2 border-primary rounded-full mx-auto flex items-center justify-center mb-md group-hover:bg-primary group-hover:text-white shadow-xl step-circle">
                <span className="font-h3 text-h3">4</span>
              </div>
              <h4 className="font-h3 text-h3 mb-xs">Manage</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Organize into folders and tags.</p>
            </div>

            <div className="text-center group reveal timeline-step">
              <div className="w-16 h-16 bg-white border-2 border-primary rounded-full mx-auto flex items-center justify-center mb-md group-hover:bg-primary group-hover:text-white shadow-xl step-circle">
                <span className="font-h3 text-h3">5</span>
              </div>
              <h4 className="font-h3 text-h3 mb-xs">Analyze</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Gain insights on your growth.</p>
            </div>
          </div>
        </div>
import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Create Account", desc: "Sign up in seconds. Start with a clean, secure workspace." },
  { n: "02", title: "Verify Email", desc: "OTP verification helps confirm your identity—no shortcuts." },
  { n: "03", title: "Upload Files", desc: "Drag & drop uploads with responsive progress feedback." },
  { n: "04", title: "Manage & Share", desc: "Organize, share links, and set permissions with clarity." },
  { n: "05", title: "Analyze Storage Usage", desc: "Understand trends and distribution through analytics dashboards." },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-md py-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-lg mb-lg">
        <div>
          <motion.h2
            className="font-h2 text-h2 text-on-background"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How it works, end-to-end
          </motion.h2>
          <p className="mt-md text-body-md text-on-surface-variant max-w-2xl">
            A simple flow designed for speed—so you can go from sign up to insights quickly.
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
            <span className="material-symbols-outlined text-primary">schedule</span>
            5 steps • Under 5 minutes
          </span>
        </motion.div>
      </div>

      <div className="relative">
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/70 transform -translate-x-1/2" />
        <ol className="space-y-md lg:space-y-0 lg:flex lg:flex-col">
          {steps.map((s, idx) => (
            <motion.li
              key={s.n}
              className="relative lg:my-md"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.03 }}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-md">
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/25 border border-outline-variant/70 flex items-center justify-center backdrop-blur">
                    <span className="text-primary font-bold">{s.n}</span>
                  </div>
                  <div className="lg:hidden w-px h-10 bg-outline-variant/70" />
                </div>

                <div className="bg-surface-container-lowest/60 border border-outline-variant/70 rounded-3xl p-lg shadow-sm backdrop-blur w-full">
                  <div className="flex items-start justify-between gap-lg">
                    <div>
                      <h3 className="text-body-lg font-bold text-on-background">{s.title}</h3>
                      <p className="mt-sm text-body-md text-on-surface-variant leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <span className="material-symbols-outlined text-primary">
                        {idx === 0
                          ? "person_add"
                          : idx === 1
                          ? "mark_email_read"
                          : idx === 2
                          ? "cloud_upload"
                          : idx === 3
                          ? "share"
                          : "analytics"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {idx !== steps.length - 1 && (
                <div className="lg:hidden mt-md h-px bg-outline-variant/70" />
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}


export default HowItWorksSection;

