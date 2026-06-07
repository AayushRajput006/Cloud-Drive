
export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface-container" id="testimonials">
      <div className="container mx-auto px-margin">
        <h2 className="font-h2 text-h2 text-center mb-24 reveal">
          Trusted by <span className="text-primary">Industry Leaders</span>.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="glass-card p-lg rounded-xl shadow-lg reveal">
            <p className="font-body-lg text-body-lg italic mb-lg text-on-surface-variant">
              "CloudDrive's analytics changed how we manage our creative assets. The speed is unmatched."
            </p>
            <div className="flex items-center gap-md">
              <img
                alt="Sarah Miller"
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRs_OuRRMfu2wdh7B4yZZa7DWGFl7eAg_k6sLNo-aqlowVGKnoXDsDMDPG5G4iyTP236v8FGbDAb4CTrlR3eriuUkuU3edvPPNzwhRXFBTOp4gPfiREPMmjkdNgNhpmpuyl1oiPO5Y2S-IEtB_MzlVFsscqHPz7Aym8JM4rHH-KvevgSTDUVjgUwQ3u3cA2YB91-NwrXHrtwVos7Yz1ajT_-WmcN6_0IIR71gElCPy-XZTLG4LTUzW_lWXMjyWAHxLhVkkupMY11DY"
              />
              <div>
                <div className="font-h3 text-h3 text-primary">Sarah Miller</div>
                <div className="font-label-sm text-label-sm opacity-60">
                  Design Director, PixelFlow
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-lg rounded-xl shadow-lg mt-8 md:mt-0 reveal">
            <p className="font-body-lg text-body-lg italic mb-lg text-on-surface-variant">
              "The security features like JWT and OTP give us peace of mind with sensitive client data."
            </p>
            <div className="flex items-center gap-md">
              <img
                alt="Marcus Chen"
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApY0zEt0hllRfkTDOqYhvURr6CFCyu5Sll9jOUxI9edS07Asm_7J7hdgw_EJFDm1SdE6qNsoI1WiF8AbTq7ItE0AcoSRdTCeeBcoiQx_MHi2ceA164BA3UrcnqyGRZmuNfd3v1nqCcMmvVIsq7adTyzAFvyszGTgnZpTFQl3vY8V_7C28iyIQEVF4RCkBfaatwfliA29RFnQVplz_GuQT-PB0sD1fU4BuVfqASWvzuVAcqGTMkKx6sBCoBrgp2jGJQMCUYA8KAfW4N"
              />
              <div>
                <div className="font-h3 text-h3 text-primary">Marcus Chen</div>
                <div className="font-label-sm text-label-sm opacity-60">CTO, SecureStack</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-lg rounded-xl shadow-lg reveal">
            <p className="font-body-lg text-body-lg italic mb-lg text-on-surface-variant">
              "Sharing large video files used to be a nightmare. CloudDrive made it instant and secure."
            </p>
            <div className="flex items-center gap-md">
              <img
                alt="Elena Rodriguez"
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuClWOdyhJQwkhWWCKye2N5TfyEFdJ_oSxiG_tfUQuEPviQh2LjhPO2DJSSAp7-acvLcKViNiEgGUxAQlSTBXQt6UZKgJC_slSdQ8bc2NwOYJoimZcTOMBBRuy_VH5QHfgXAIFcVP7Asyk7SBhdkSUm1L0rhYUSlbQkczo3CUp2Wx_EJbJFQWbnknhWazhkKcW6kXdUNfSBgIwmLC3BKH8vehah8T7IvP7hPIRG51IaF-xjUwGsM5H2CP5abM7ttZFwT6LiFdyeCwsXR"
              />
              <div>
                <div className="font-h3 text-h3 text-primary">Elena Rodriguez</div>
                <div className="font-label-sm text-label-sm opacity-60">
                  Founder, FrameWork Media
                </div>
              </div>
            </div>
          </div>
        </div>

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

