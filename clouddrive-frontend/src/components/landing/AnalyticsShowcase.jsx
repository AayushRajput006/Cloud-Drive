import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#3525cd", "#4f46e5", "#4648d4", "#6063ee", "#777587"];

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
  const usageData = [
    { month: "Jan", uploads: 38, storage: 65 },
    { month: "Feb", uploads: 45, storage: 72 },
    { month: "Mar", uploads: 52, storage: 78 },
    { month: "Apr", uploads: 44, storage: 74 },
    { month: "May", uploads: 60, storage: 82 },
    { month: "Jun", uploads: 70, storage: 90 },
  ];

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

  return (
    <section id="analytics" className="mx-auto max-w-7xl px-md py-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-lg mb-lg">
        <div>
          <motion.h2
            className="font-h2 text-h2 text-on-background"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Storage Analytics that feels effortless
          </motion.h2>
          <p className="mt-md text-body-md text-on-surface-variant max-w-2xl">
            Track usage trends, uploads, file distribution, and the files people
            share most—right from your dashboard.
          </p>
        </div>

        <motion.div
          className="px-md py-xs rounded-full bg-surface-container-lowest/60 border border-outline-variant/70 backdrop-blur shadow-sm"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <span className="text-body-md font-semibold text-on-surface-variant">
            Realtime-ready insights
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <GlassSectionShell className="p-md lg:col-span-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="uploadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3525cd" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3525cd" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#777587" fontSize={12} />
                <YAxis stroke="#777587" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="uploads"
                  stroke="#3525cd"
                  fill="url(#uploadsGrad)"
                  name="Uploads"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-md grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="h-64 rounded-2xl bg-surface-container-lowest/40 border border-outline-variant/60 p-md">
              <div className="text-body-md font-semibold text-on-surface-variant mb-sm">
                File Type Distribution
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Pie
                      data={typeDist}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={60}
                      innerRadius={35}
                      paddingAngle={3}
                    >
                      {typeDist.map((_, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="h-64 rounded-2xl bg-surface-container-lowest/40 border border-outline-variant/60 p-md">
              <div className="text-body-md font-semibold text-on-surface-variant mb-sm">
                Most Shared Files
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mostShared} barGap={10}>
                    <XAxis dataKey="name" stroke="#777587" fontSize={12} />
                    <YAxis stroke="#777587" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="shares" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
              { title: "Smart upload insights", desc: "See how uploads impact storage usage over time." },
              { title: "Share performance", desc: "Identify the files that generate the most shares and downloads." },
              { title: "Distribution overview", desc: "Understand file types at a glance for better organization." },
              { title: "Actionable recommendations", desc: "Quick next steps based on what’s trending in your workspace." },
            ].map((x) => (
              <motion.li
                key={x.title}
                className="bg-surface-container-lowest/40 border border-outline-variant/60 rounded-2xl p-md"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
              >
                <div className="font-semibold text-on-surface">{x.title}</div>
                <div className="text-on-surface-variant mt-xs">{x.desc}</div>
              </motion.li>
            ))}
          </ul>
        </GlassSectionShell>
      </div>
    </section>
  );
}

export default AnalyticsShowcase;
