
function DashboardHeader({ title = "Dashboard", studentName = "Student" }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div>
        <p className="text-sm text-slate-500">Student Portal / Overview</p>
        <h1 className="mt-1 text-2xl font-bold text-blue-950">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">{studentName}</p>
          <p className="text-xs text-slate-500">Student Account</p>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-900"
          aria-label={`${studentName} avatar`}
        >
          {studentName.trim().charAt(0).toUpperCase() || "S"}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
