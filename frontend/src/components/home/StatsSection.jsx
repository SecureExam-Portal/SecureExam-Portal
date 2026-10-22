
import { motion } from "framer-motion";

const stats = [
  { value: "AI", label: "Assisted Proctoring" },
  { value: "24/7", label: "Online Exam Access" },
  { value: "100%", label: "Digital Examination" },
  { value: "Real-time", label: "Activity Monitoring" },
];

function StatsSection() {
  return (
    <section className="bg-blue-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            SecureExam-AI at a Glance
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
            Built for Secure Online Exams
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center rounded-xl border border-white/15 bg-white/5 p-6"
            >
              <p className="text-3xl sm:text-4xl font-bold text-amber-400">
                {stat.value}
              </p>
              <p className="mt-3 text-sm text-blue-100">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
