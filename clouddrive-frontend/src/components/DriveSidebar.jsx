import { Link } from "react-router-dom";

const items = [
  { to: "/dashboard", icon: "folder_open", label: "My Files" },
  { to: "/search", icon: "history", label: "Recent" },
  { to: "/share", icon: "group", label: "Shared" },
  { to: "/starred", icon: "star", label: "Starred" },
  { to: "/trash", icon: "delete", label: "Trash" }
];

function DriveSidebar({ active = "My Files" }) {
  const activeLabel = active === "Shared" ? "Shared" : active;
  return (
    <aside className="hidden md:flex flex-col h-screen p-md space-y-unit bg-surface border-r border-outline-variant w-64 shrink-0">
      <div className="flex items-center gap-sm px-sm py-md">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white">cloud</span>
        </div>
        <div>
          <h1 className="text-h3 font-semibold text-primary">CloudDrive</h1>
          <p className="text-label-sm text-on-surface-variant">Storage</p>
        </div>
      </div>
      <Link
        to="/upload"
        className="w-full py-md px-lg bg-primary text-on-primary rounded-lg font-semibold flex items-center justify-center gap-sm"
      >
        <span className="material-symbols-outlined">add</span>Upload
      </Link>
      <nav className="flex-1 space-y-1 pt-sm">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center gap-md px-md py-sm rounded-lg ${
              activeLabel === item.label
                ? "bg-primary-container text-on-primary-container font-semibold"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-body-md">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-md bg-surface-container-low rounded-xl border border-outline-variant">
        <div className="flex justify-between mb-xs text-label-sm">
          <span className="text-on-surface-variant">Storage</span>
          <span className="font-semibold">75%</span>
        </div>
        <div className="w-full bg-outline-variant h-1 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-3/4" />
        </div>
        <p className="text-label-sm text-on-surface-variant mt-sm">15.2 GB of 20 GB used</p>
      </div>
    </aside>
  );
}

export default DriveSidebar;
