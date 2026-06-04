export default function SecuritySection() {
  return (
    <section className="py-24 bg-on-surface text-on-primary" id="security">
      <div className="container mx-auto px-margin">
        <div className="text-center mb-24 reveal">
          <span className="text-primary-fixed font-label-sm text-label-sm uppercase tracking-[0.2em]">
            Safety First
          </span>
          <h2 className="font-h2 text-h2 md:text-h1 mt-sm">
            Your privacy is our <span className="text-primary-fixed">North Star</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
          <div className="reveal p-lg bg-surface/5 rounded-xl border border-surface/10 hover:bg-surface/10 transition-colors">
            <span className="material-symbols-outlined text-primary-fixed text-h1 mb-md">
              key
            </span>
            <h3 className="font-h3 text-h3 mb-sm">JWT Security</h3>
            <p className="font-body-md text-body-md opacity-70">
              Authenticated sessions managed by stateless JSON Web Tokens for maximum speed and security.
            </p>
          </div>

          <div className="reveal p-lg bg-surface/5 rounded-xl border border-surface/10 hover:bg-surface/10 transition-colors">
            <span className="material-symbols-outlined text-primary-fixed text-h1 mb-md">
              enhanced_encryption
            </span>
            <h3 className="font-h3 text-h3 mb-sm">AES-256</h3>
            <p className="font-body-md text-body-md opacity-70">
              Data is encrypted at rest and in transit using the industry gold standard.
            </p>
          </div>

          <div className="reveal p-lg bg-surface/5 rounded-xl border border-surface/10 hover:bg-surface/10 transition-colors">
            <span className="material-symbols-outlined text-primary-fixed text-h1 mb-md">
              vibration
            </span>
            <h3 className="font-h3 text-h3 mb-sm">OTP Auth</h3>
            <p className="font-body-md text-body-md opacity-70">
              Multi-factor authentication via SMS or App codes to prevent unauthorized access.
            </p>
          </div>

          <div className="reveal p-lg bg-surface/5 rounded-xl border border-surface/10 hover:bg-surface/10 transition-colors">
            <span className="material-symbols-outlined text-primary-fixed text-h1 mb-md">
              admin_panel_settings
            </span>
            <h3 className="font-h3 text-h3 mb-sm">Protected Sharing</h3>
            <p className="font-body-md text-body-md opacity-70">
              Set viewing limits, password protection, and auto-delete for shared assets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
