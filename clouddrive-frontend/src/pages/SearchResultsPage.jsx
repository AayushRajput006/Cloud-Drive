import AppShell from "../components/AppShell";
import DriveSidebar from "../components/DriveSidebar";
import DriveTopbar from "../components/DriveTopbar";

function SearchResultsPage() {
  return (
    <AppShell sidebar={<DriveSidebar active="My Files" />} topbar={<DriveTopbar searchPlaceholder="report" />}>
      <div className="p-lg">
        <h1 className="font-h1 text-h1">Search Results</h1>
        <p className="text-body-md text-on-surface-variant mb-lg">Found 12 items matching your query</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-lg">
          <div className="md:col-span-2 bg-white border border-outline-variant rounded-xl p-lg">
            <h3 className="font-h2 text-h2">Annual_Financial_Report_2023.pdf</h3>
            <p className="text-body-md text-on-surface-variant">PDF</p>
          </div>
          {["Q3_Revenue_Chart.png", "Weekly_Status_Report.docx", "Reports_Archive"].map((r) => (
            <div key={r} className="bg-white border border-outline-variant rounded-xl p-md">
              <p className="font-body-md font-semibold">{r}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default SearchResultsPage;
