
const navigationItems = [
  { label: "Overview", icon: "⌂", href: "#overview" },
  { label: "My Exams", icon: "▤", href: "#exams" },
  { label: "Results", icon: "▥", href: "#results" },
  { label: "Profile", icon: "◉", href: "#profile" },
];

function Sidebar({ activeItem = "Overview" }) {
  return (
    <aside className="flex h-full min-h-screen w-64 flex-col bg-blue-950 px-5 py-6 text-white">
      <a href="/" className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-xl font-bold text-blue-950">
          S
        </div>
        <div>
          <h2 className="text-lg font-bold">SecureExam</h2>
          <p className="text-xs uppercase tracking-widest text-amber-400">
            Student Portal
          </p>
        </div>
      </a>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-blue-300">
        Menu
      </p>

      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => {
          const isActive = activeItem === item.label;

          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-400 text-blue-950"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-lg" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold">Need help?</p>
        <p className="mt-1 text-xs leading-relaxed text-blue-200">
          Contact your institution if you need assistance with an examination.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
