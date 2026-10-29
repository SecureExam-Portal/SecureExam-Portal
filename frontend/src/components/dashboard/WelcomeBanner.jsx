
function WelcomeBanner({ studentName = "Student" }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-6 text-white shadow-lg sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-amber-400/10" />
      <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />

      <div className="relative z-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
          Student Dashboard
        </p>

        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
          Welcome back, {studentName}!
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
          Stay prepared for your upcoming examinations. Review available exams,
          check your progress, and keep track of your results in one place.
        </p>

        <a
          href="#exams"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-blue-950 transition-colors hover:bg-amber-300"
        >
          Explore Exams
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

export default WelcomeBanner;
