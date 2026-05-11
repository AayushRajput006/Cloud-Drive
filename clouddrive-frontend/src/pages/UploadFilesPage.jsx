import AppShell from "../components/AppShell";
import DriveSidebar from "../components/DriveSidebar";
import DriveTopbar from "../components/DriveTopbar";

function UploadFilesPage() {
  return (
    <AppShell sidebar={<DriveSidebar active="My Files" />} topbar={<DriveTopbar searchPlaceholder="Search your files" />}>
      <div className="relative h-full">
        <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-md">
          <div className="bg-white w-full max-w-2xl rounded-xl border border-outline-variant">
            <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-h3 font-h3">Upload Files</h3>
              <span className="material-symbols-outlined">close</span>
            </div>
            <div className="p-lg space-y-lg">
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-xl text-center bg-surface-container-low">
                <p className="text-body-lg font-bold">Drag and drop files here</p>
                <button className="mt-md px-lg py-sm border border-primary text-primary rounded-lg">Browse Files</button>
              </div>
            </div>
            <div className="px-lg py-md border-t border-outline-variant flex justify-end gap-md">
              <button className="px-lg py-sm text-on-surface-variant">Cancel</button>
              <button className="px-xl py-sm bg-primary text-on-primary rounded-lg">Done</button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default UploadFilesPage;
