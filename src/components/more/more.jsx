import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Playbook & Docs",
    desc: "Step‑by‑step setup, data model, and best practices for running InventoryPro in your lab.",
    to: "/docs",
  },
  {
    title: "Community Space",
    desc: "See how other clubs structure gear, share templates, and request new features.",
    to: "/community",
  },
  {
    title: "FAQ & Patterns",
    desc: "Borrowing rules, penalty patterns, and examples for multi‑team and long‑term projects.",
    to: "/faq",
  },
];

const quickGlance = [
  { label: "Labs using InventoryPro", value: "12+" },
  { label: "Average checkout time", value: "35s" },
  { label: "Components synced nightly", value: "480+" },
];

function More() {
  return (
    <div className="w-full">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20% 0px -10%", once: false }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-500">
            Explore more
          </p>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Keep the{" "}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              builds
            </span>{" "}
            flowing.
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Go beyond the basics with docs, patterns, and a community of teams
            that already run their hardware labs on InventoryPro.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, idx) => (
            <motion.div
              key={c.title}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 px-5 py-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all dark:border-slate-800 dark:bg-slate-900/90"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20% 0px -10%", once: false }}
              transition={{ duration: 0.45, delay: 0.08 * idx }}
            >
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 dark:text-slate-50">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {c.desc}
                </p>
              </div>
              <div className="mt-5">
                <Link
                  to={c.to}
                  className="inline-flex items-center justify-center rounded-full border border-sky-500/70 px-4 py-2 text-xs sm:text-sm font-semibold text-sky-700 hover:bg-sky-50 dark:text-sky-200 dark:hover:bg-slate-900/70 transition"
                >
                  Open section
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra: quick stats strip to extend page + add context */}
        <motion.div
          className="mt-10 sm:mt-12 rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/90"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20% 0px -10%", once: false }}
          transition={{ duration: 0.45 }}
        >
          <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
            Quick lab snapshot
          </div>
          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3 sm:gap-4 w-full sm:w-auto">
            {quickGlance.map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-slate-50 px-3 py-3 text-left border border-slate-100 dark:bg-slate-900 dark:border-slate-700"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {item.value}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default More;
