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
      </div>
    </section>
  );
}
