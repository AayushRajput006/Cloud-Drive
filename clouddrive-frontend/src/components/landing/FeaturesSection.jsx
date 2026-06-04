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
      </div>
    </section>
  );
}
