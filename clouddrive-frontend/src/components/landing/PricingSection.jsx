import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PricingSection() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  // Keep prices in sync with billing toggle (same behavior as provided HTML)
  const plans = useMemo(() => {
    const fmt = (monthly, annual) => (isAnnual ? annual : monthly);
    return [
      {
        key: "free",
        name: "Free",
        desc: "For personal projects",
        priceMonthly: 0,
        priceAnnual: 0,
        cta: { label: "Get Started", to: "/signup", variant: "outline" },
        items: ["10 GB storage", "Basic file sharing", "30-day trash recovery", "Mobile & web access"],
      },
      {
        key: "pro",
        name: "Pro",
        desc: "For creators & freelancers",
        priceMonthly: 12,
        priceAnnual: 10,
        popular: true,
        cta: { label: "Start Pro Trial", to: "/signup", variant: "primary" },
        items: [
          "500 GB storage",
          "Advanced analytics",
          "Password-protected links",
          "Priority support",
          "OTP & JWT security",
        ],
      },
      {
        key: "business",
        name: "Business",
        desc: "For teams at scale",
        priceMonthly: 39,
        priceAnnual: 31,
        cta: { label: "Contact Sales", to: "/signup", variant: "primary-outline" },
        items: ["Unlimited storage", "Team workspaces", "Admin controls & SSO", "Custom retention policies", "Dedicated account manager"],
      },
    ].map((p) => ({
      ...p,
      price: fmt(p.priceMonthly, p.priceAnnual),
    }));
  }, [isAnnual]);

  // pricing shimmer class for the "Most Popular" card (same idea as HTML: active-shimmer when visible)
  useEffect(() => {
    // If IntersectionObserver logic runs in LandingPage, this may already happen.
    // Keep this effect minimal and safe: only add animation start when card exists.
    const el = document.getElementById("pricing-pro");
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) el.classList.add("active-shimmer");
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const knobStyle = useMemo(() => {
    return isAnnual ? { transform: "translateX(24px)" } : undefined;
  }, [isAnnual]);

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="pricing">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="container mx-auto px-margin relative z-10">
        <div className="text-center mb-lg reveal">
          <span className="text-primary font-label-sm text-label-sm uppercase tracking-[0.2em]">Simple Plans</span>
          <h2 className="font-h2 text-h2 md:text-h1 mt-sm mb-md">
            Pricing that <span className="text-primary">scales with you</span>.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Start free, upgrade when you need more storage, analytics, and team features.
          </p>
        </div>

        <div className="flex items-center justify-center gap-md mb-xl reveal">
          <span className="font-label-sm text-label-sm text-on-surface-variant" id="billing-label-monthly">
            Monthly
          </span>
          <button
            type="button"
            className="relative w-14 h-8 bg-surface-container-high rounded-full p-1 flex items-center"
            aria-label="Toggle annual billing"
            aria-pressed={isAnnual}
            onClick={() => setIsAnnual((v) => !v)}
          >
            <span
              className="absolute left-1 w-6 h-6 bg-primary rounded-full shadow-md transition-transform duration-300 ease-out"
              id="billing-knob"
              style={knobStyle}
            />
          </button>
          <span className="font-label-sm text-label-sm text-on-surface-variant" id="billing-label-annual">
            Annual <span className="text-primary font-medium">(Save 20%)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg max-w-5xl mx-auto" id="pricing-grid">
          {plans.map((p) => {
            const isPro = p.key === "pro";
            const cardClass = isPro
              ? "reveal-scale pricing-card pricing-popular p-xl rounded-2xl border-2 border-primary shadow-xl shadow-primary/15 flex flex-col relative md:-mt-4 md:mb-4"
              : "reveal-scale pricing-card glass-card p-xl rounded-2xl border border-outline-variant flex flex-col";

            const cta =
              p.cta.variant === "primary" ? (
                <button
                  className="w-full font-h3 text-h3 bg-primary text-on-primary px-lg py-md rounded-lg shadow-lg shadow-primary/25 hover:scale-105 transition-transform pulse-on-hover"
                  onClick={() => navigate(p.cta.to)}
                >
                  {p.cta.label}
                </button>
              ) : p.cta.variant === "primary-outline" ? (
                <button
                  className="w-full font-h3 text-h3 border border-primary text-primary px-lg py-md rounded-lg hover:bg-primary-fixed transition-all pulse-on-hover"
                  onClick={() => navigate(p.cta.to)}
                >
                  {p.cta.label}
                </button>
              ) : (
                <button
                  className="w-full font-h3 text-h3 border border-outline-variant text-on-surface px-lg py-md rounded-lg hover:bg-surface-container-low transition-all pulse-on-hover"
                  onClick={() => navigate(p.cta.to)}
                >
                  {p.cta.label}
                </button>
              );

            return (
              <div key={p.key} className={cardClass} id={p.key === "pro" ? "pricing-pro" : undefined}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-label-sm text-label-sm px-md py-xs rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-lg mt-sm">
                  <h3 className="font-h3 text-h3 mb-xs">{p.name}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{p.desc}</p>
                </div>

                <div className="mb-lg">
                  <span className={`font-h1 text-h1 ${p.key === "free" ? "text-on-surface" : "text-primary"} price-amount`}>
                    ${p.price}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant"> /month</span>
                </div>

                <ul className="space-y-sm mb-xl flex-1">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-center gap-sm font-body-md text-body-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-sm">check</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {cta}
              </div>
            );
          })}
        </div>

        <p className="text-center font-body-md text-body-md text-on-surface-variant mt-xl reveal">
          All plans include 256-bit encryption. No credit card required for Free.
        </p>
      </div>
    </section>
  );
}
