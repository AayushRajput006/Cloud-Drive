import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SettingsModal from "./SettingsModal";

function DriveTopbar({ title = "CloudDrive", searchPlaceholder = "Search files, folders" }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="flex justify-between items-center w-full px-lg h-16 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-xl flex-1">
          <span className="text-h2 font-bold text-primary hidden lg:block">{title}</span>
          <div className="relative w-full max-w-xl">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-body-md"
              placeholder={searchPlaceholder}
            />
          </div>
        </div>
        <div className="flex items-center gap-sm">
          {["notifications", "help"].map((icon) => (
            <button key={icon} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full">
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="flex items-center gap-sm">
            <div className="text-right">
              <p className="text-sm font-medium text-on-surface">{user?.name || "User"}</p>
              <p className="text-xs text-on-surface-variant">{user?.email || ""}</p>
            </div>
            <div className="relative">
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container hover:text-on-primary-container transition-colors"
                title="Logout"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

export default DriveTopbar;
