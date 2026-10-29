
function StatCard({
  title,
  value = "—",
  description = "Your latest activity",
  icon = "▤",
  accent = "blue",
}) {
  const accentStyles = {
    blue: "bg-blue-100 text-blue-900",
    amber: "bg-amber-100 text-amber-800",
    green: "bg-emerald-100 text-emerald-800",
    violet: "bg-violet-100 text-violet-800",
  };

  const iconStyle = accentStyles[accent] || accentStyles.blue;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-blue-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${iconStyle}`}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </article>
  );
}

export default StatCard;
