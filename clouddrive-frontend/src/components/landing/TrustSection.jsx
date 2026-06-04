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
      </div>
    </section>
  );
}
