import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigationItems = [
  { label: "Overview", icon: "⌂", href: "/dashboard" },
  { label: "My Exams", icon: "▤", href: "/exams" },
  { label: "Results", icon: "▥", href: "/results" },
  { label: "Profile", icon: "◉", href: "/profile" },
];

function Sidebar({ isOpen, onClose, activeItem }) {
  const location = useLocation();
  const { logout } = useAuth();

  const isCurrentActive = (item) => {
    if (activeItem) return activeItem.toLowerCase() === item.label.toLowerCase();
    if (item.href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(item.href);
  };

  const content = (
    <div className="flex h-full min-h-screen w-72 flex-col bg-blue-950 px-5 py-6 text-white shadow-xl">
      <Link to="/dashboard" className="mb-10 flex items-center gap-3 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-xl font-bold text-blue-950 transition-transform group-hover:scale-105">
          S
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">SecureExam</h2>
          <p className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
            Student Portal
          </p>
        </div>
      </Link>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-blue-300/80">
        Menu
      </p>

      <nav className="flex flex-col gap-1.5 flex-1">
        {navigationItems.map((item) => {
          const active = isCurrentActive(item);

          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-amber-400 text-blue-950 shadow-md font-semibold"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-lg" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-white/10">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs">
          <p className="font-semibold text-white">Need help?</p>
          <p className="mt-1 text-blue-200/80 leading-relaxed">
            Contact your proctor or administrator for assistance.
          </p>
        </div>

        <button
          onClick={() => {
            if (onClose) onClose();
            logout();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

export function MobileMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none lg:hidden rounded-lg hover:bg-gray-100"
      aria-label="Toggle navigation menu"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

export default Sidebar;
