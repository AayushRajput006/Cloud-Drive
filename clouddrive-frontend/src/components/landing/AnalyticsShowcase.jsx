
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
function GlassSectionShell({ children, className = "" }) {
  return (
    <div
      className={[
        "bg-surface-container-lowest/60 backdrop-blur border border-outline-variant/70 rounded-3xl shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function AnalyticsShowcase() {
  const usage = [38, 45, 52, 44, 60, 70];
  const maxUsage = Math.max(...usage);

  const typeDist = [
    { name: "Documents", value: 45 },
    { name: "Images", value: 22 },
    { name: "Videos", value: 14 },
    { name: "Audio", value: 10 },
    { name: "Other", value: 9 },
  ];

  const mostShared = [
    { name: "Roadmap", shares: 18 },
    { name: "Invoice Q2", shares: 14 },
    { name: "Design Assets", shares: 12 },
    { name: "Meeting Notes", shares: 10 },
  ];

  const maxShares = mostShared[0]?.shares || 1;

  return (
    <section id="analytics" className="mx-auto max-w-7xl px-md py-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-lg mb-lg">
        <div>
          <h2 className="font-h2 text-h2 text-on-background">
            Storage Analytics that feels effortless
          </h2>
          <p className="mt-md text-body-md text-on-surface-variant max-w-2xl">
            Track usage trends, uploads, file distribution, and the files people share most—right from your dashboard.
          </p>
        </div>

        <div className="px-md py-xs rounded-full bg-surface-container-lowest/60 border border-outline-variant/70 backdrop-blur shadow-sm">
          <span className="text-body-md font-semibold text-on-surface-variant">
            Realtime-ready insights
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <GlassSectionShell className="p-md lg:col-span-2">
          {/* Simple “line” mock using bars */}
          <div className="h-64 w-full">
            <div className="flex items-end h-full gap-sm">
              {usage.map((v, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-lg bg-primary/25 border border-outline-variant/60"
                    style={{ height: `${Math.round((v / maxUsage) * 210)}px` }}
                    aria-label={`usage-${idx}`}
                  />
                  <div className="mt-xs text-label-sm text-on-surface-variant">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][idx] ?? ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-md grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="rounded-2xl bg-surface-container-lowest/40 border border-outline-variant/60 p-md">
              <div className="text-body-md font-semibold text-on-surface-variant mb-sm">
                File Type Distribution
              </div>

              <div className="mt-md space-y-md">
                {typeDist.map((t, idx) => (
                  <div key={t.name} className="flex items-center gap-md">
                    <div className="w-28 text-body-md font-semibold text-on-background">
                      {t.name}
                    </div>
                    <div className="flex-1 bg-outline-variant h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${t.value}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-label-sm font-semibold text-on-surface-variant">
                      {t.value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-lowest/40 border border-outline-variant/60 p-md">
              <div className="text-body-md font-semibold text-on-surface-variant mb-sm">
                Most Shared Files
              </div>

              <div className="mt-md space-y-md">
                {mostShared.map((f, idx) => (
                  <div key={f.name} className="flex items-center gap-md">
                    <div className="w-10 text-label-sm text-on-surface-variant font-semibold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-body-md font-semibold text-on-background truncate">
                        {f.name}
                      </div>
                      <div className="mt-xs w-full bg-outline-variant h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, (f.shares / maxShares) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-right text-label-sm font-semibold text-on-surface-variant">
                      {f.shares}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassSectionShell>

        <GlassSectionShell className="p-md">
          <div className="text-body-md font-semibold text-on-surface-variant">
            Unique Storage Signals
          </div>

          <ul className="mt-md space-y-md text-body-md text-on-surface-variant">
            {[
              {
                title: "Smart upload insights",
                desc: "See how uploads impact storage usage over time.",
              },
              {
                title: "Share performance",
                desc: "Identify the files that generate the most shares and downloads.",
              },
              {
                title: "Distribution overview",
                desc: "Understand file types at a glance for better organization.",
              },
              {
                title: "Actionable recommendations",
                desc: "Quick next steps based on what’s trending in your workspace.",
              },
            ].map((x) => (
              <li
                key={x.title}
                className="bg-surface-container-lowest/40 border border-outline-variant/60 rounded-2xl p-md"
              >
                <div className="font-semibold text-on-surface">{x.title}</div>
                <div className="text-on-surface-variant mt-xs">{x.desc}</div>
              </li>
            ))}
          </ul>
        </GlassSectionShell>
      </div>
    </section>
  );
}

export default AnalyticsShowcase;
