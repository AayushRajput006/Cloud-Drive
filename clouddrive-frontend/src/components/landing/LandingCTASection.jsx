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
          </div>
        </div>
      </div>
    </section>
  );
}
