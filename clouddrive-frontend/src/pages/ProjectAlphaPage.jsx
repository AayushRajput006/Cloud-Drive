import AppShell from "../components/AppShell";
import DriveSidebar from "../components/DriveSidebar";
import DriveTopbar from "../components/DriveTopbar";

function ProjectAlphaPage() {
  return (
    <AppShell sidebar={<DriveSidebar active="Starred" />} topbar={<DriveTopbar searchPlaceholder="Search in Project Alpha..." />}>
      <div className="p-lg">
        <nav className="flex items-center space-x-xs text-on-surface-variant mb-lg">
          <span className="text-body-md">My Files</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-body-md font-bold text-on-surface">Project Alpha</span>
        </nav>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
          {["Brand Assets", "Q3_Project_Brief.pdf", "Hero_Concept_V1.jpg", "Budget_Allocation.xlsx"].map((item) => (
            <div key={item} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
              <h3 className="text-body-md font-semibold">{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default ProjectAlphaPage;
