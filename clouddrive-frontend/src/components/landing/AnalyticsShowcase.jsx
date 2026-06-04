export default function AnalyticsShowcase() {
  return (
    <section className="py-24 bg-surface-container-low overflow-hidden" id="analytics">
      <div className="container mx-auto px-margin">
        <div className="flex flex-col lg:flex-row items-center gap-xl">
          <div className="lg:w-1/2 reveal-left">
            <h2 className="font-h2 text-h2 mb-md">
              Turn your storage into <span className="text-primary">intelligence</span>.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
              Our built-in analytics engine monitors usage patterns and predicts your storage needs before they become an issue.
            </p>

            <ul className="space-y-md mb-xl">
              <li className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="font-body-md text-body-md">Daily access heatmaps</span>
              </li>
              <li className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="font-body-md text-body-md">File type distribution charts</span>
              </li>
              <li className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                <span className="font-body-md text-body-md">Download volume tracking</span>
              </li>
            </ul>
          </div>

          <div className="lg:w-1/2 relative reveal-right">
            <div className="glass-card p-lg rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between mb-xl">
                <h4 className="font-h3 text-h3">Weekly Activity</h4>
                <select className="bg-surface border-none text-label-sm font-label-sm rounded-lg focus:ring-primary">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>

              <div className="h-64 flex items-end gap-md chart-container">
                <div className="flex-1 bg-primary/20 hover:bg-primary rounded-t-lg transition-all bar-grow" style={{ height: "40%", transitionDelay: "0.1s" }} />
                <div className="flex-1 bg-primary/20 hover:bg-primary rounded-t-lg transition-all bar-grow" style={{ height: "65%", transitionDelay: "0.2s" }} />
                <div className="flex-1 bg-primary/20 hover:bg-primary rounded-t-lg transition-all bar-grow" style={{ height: "45%", transitionDelay: "0.3s" }} />
                <div className="flex-1 bg-primary/20 hover:bg-primary rounded-t-lg transition-all bar-grow" style={{ height: "90%", transitionDelay: "0.4s" }} />
                <div className="flex-1 bg-primary hover:bg-primary rounded-t-lg transition-all bar-grow" style={{ height: "75%", transitionDelay: "0.5s" }} />
                <div className="flex-1 bg-primary/20 hover:bg-primary rounded-t-lg transition-all bar-grow" style={{ height: "55%", transitionDelay: "0.6s" }} />
                <div className="flex-1 bg-primary/20 hover:bg-primary rounded-t-lg transition-all bar-grow" style={{ height: "80%", transitionDelay: "0.7s" }} />
              </div>

              <div className="flex justify-between mt-md text-label-sm font-label-sm opacity-50 uppercase tracking-tighter">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
