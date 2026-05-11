function AppShell({ sidebar, topbar, children, mobileNav }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {sidebar}
      <div className="flex flex-1 flex-col overflow-hidden">
        {topbar}
        <main className="flex-1 overflow-y-auto bg-surface-container-lowest">{children}</main>
      </div>
      {mobileNav}
    </div>
  );
}

export default AppShell;
