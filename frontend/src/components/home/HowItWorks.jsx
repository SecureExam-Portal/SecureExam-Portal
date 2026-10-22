
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Register securely and access the examination portal using your student or admin account.",
  },
  {
    number: "02",
    title: "Take Your Exam",
    description:
      "Open your scheduled exam, answer questions, and keep track of your time with the live timer.",
  },
  {
    number: "03",
    title: "Stay Secure",
    description:
      "Browser monitoring and AI-assisted proctoring help identify suspicious activity during the exam.",
  },
  {
    number: "04",
    title: "View Your Results",
    description:
      "Submit your answers and view your results when they are published by the platform.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
            Simple and Secure
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-blue-900">
            How It Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            From registration to results, SecureExam-AI makes online
            examinations simple, organized, and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-xl border border-gray-200 bg-gray-50 p-7 hover:border-amber-400 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-900 text-amber-400 text-lg font-bold mb-6">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
