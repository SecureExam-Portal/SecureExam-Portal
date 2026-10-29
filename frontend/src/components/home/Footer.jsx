
function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-300 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-8 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              SecureExam<span className="text-amber-400">-AI</span>
            </h2>
            <p className="mt-3 text-sm text-gray-400 max-w-md">
              A smarter and more secure way to conduct online examinations
              with AI-assisted proctoring.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a href="#home" className="hover:text-amber-400 transition-colors">
                Home
              </a>
              <a href="#features" className="hover:text-amber-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
                How It Works
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SecureExam-AI. All rights reserved.</p>
          <p>Secure. Smart. Reliable.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
