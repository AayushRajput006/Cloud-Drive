import DriveSidebar from "../components/DriveSidebar";

function ShareFilePage() {
  return (
    <div className="bg-background min-h-screen flex">
      <DriveSidebar active="My Files" />
      <main className="flex-grow flex items-center justify-center p-md bg-surface-container-low">
        <div className="w-full max-w-[520px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg overflow-hidden">
          <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
            <h2 className="font-h3 text-h3">Share "Annual_Report_2024.pdf"</h2>
            <span className="material-symbols-outlined">close</span>
          </div>
          <div className="p-lg space-y-lg">
            <div className="space-y-sm">
              <div className="p-md border border-outline-variant rounded-lg">Public</div>
              <div className="p-md border border-outline-variant rounded-lg">Private</div>
            </div>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm"
              readOnly
              value="https://clouddrive.com/s/7h2k9Lp-2024-report"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ShareFilePage;
