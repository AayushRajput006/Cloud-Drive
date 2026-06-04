export default function LandingFooter() {
  return (
    <footer className="bg-surface pt-24 pb-lg" id="contact">
      <div className="container mx-auto px-margin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-xl mb-24 reveal">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-sm mb-lg">
              <span
                className="material-symbols-outlined text-primary text-h2"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cloud
              </span>
              <span className="font-h2 text-h2 font-bold text-primary tracking-tight">CloudDrive</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg max-w-sm">
              The world's most intelligent cloud storage platform. Built for the future of work.
            </p>

            <div className="flex gap-md">
              <a
                className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                href="#"
              >
                <span className="material-symbols-outlined text-body-lg">share</span>
              </a>
              <a
                className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                href="#"
              >
                <span className="material-symbols-outlined text-body-lg">public</span>
              </a>
              <a
                className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                href="#"
              >
                <span className="material-symbols-outlined text-body-lg">alternate_email</span>
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-label-sm text-label-sm font-bold uppercase mb-lg">Product</h5>
            <ul className="space-y-sm">
              <li>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#features">
                  Features
                </a>
              </li>
              <li>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#security">
                  Security
                </a>
              </li>
              <li>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#pricing">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-label-sm text-label-sm font-bold uppercase mb-lg">Resources</h5>
            <ul className="space-y-sm">
              <li>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#">
                  Documentation
                </a>
              </li>
              <li>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-label-sm text-label-sm font-bold uppercase mb-lg">Company</h5>
            <ul className="space-y-sm">
              <li>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#">
                  About
                </a>
              </li>
              <li>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary" href="#">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-outline-variant pt-lg flex flex-col md:flex-row justify-between items-center gap-md reveal">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            © 2024 CloudDrive Inc. All rights reserved.
          </span>
          <div className="flex gap-lg">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#">
              Privacy Policy
            </a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
