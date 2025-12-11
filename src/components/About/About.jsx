import { motion } from "framer-motion";

const blocks = [
  {
    label: "Mission",
    title: "Turn clutter into clarity.",
    body: "InventoryPro turns cardboard‑box chaos into a searchable, accountable system designed for student labs.",
  },
  {
    label: "Why now",
    title: "Hardware deserves real UX.",
    body: "Borrowing a sensor should feel as smooth as opening a doc. No more lost kits, mystery boxes, or endless spreadsheets.",
  },
  {
    label: "Built at IOT LABS",
    title: "By builders, for builders.",
    body: "Designed with real clubs, tech teams, and fest crews – tuned for how students actually prototype and ship.",
  },
];

function About() {
  return (
    <div className="w-full">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.p
            className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-20% 0px -10%", once: false }}
            transition={{ duration: 0.4 }}
          >
            About the system
          </motion.p>

          <motion.h2
            className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-20% 0px -10%", once: false }}
            transition={{ duration: 0.45 }}
          >
            The operating layer{" "}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              for your lab.
            </span>
          </motion.h2>

          <motion.p
            className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-20% 0px -10%", once: false }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            From first‑year breadboard experiments to final‑year capstones,
            InventoryPro keeps gear discoverable, reliable, and shared across
            teams.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {blocks.map((b, idx) => (
            <motion.div
              key={b.title}
              className="relative rounded-2xl border border-slate-200 bg-white/95 px-5 py-6 shadow-sm hover:shadow-lg transition-all dark:border-slate-800 dark:bg-slate-900/90"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20% 0px -10%", once: false }}
              transition={{ duration: 0.45, delay: 0.08 * idx }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent opacity-70" />
              <p className="text-[11px] uppercase tracking-[0.2em] text-sky-500 mb-2">
                {b.label}
              </p>
              <h3 className="text-base font-semibold text-slate-900 mb-2 dark:text-slate-50">
                {b.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {b.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chips */}
        <motion.div
          className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 text-[11px]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20% 0px -10%", once: false }}
          transition={{ duration: 0.45 }}
        >
          {[
            "Borrow logs",
            "Role based access",
            "Exportable reports",
            "Event planning view",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-sky-500/40 bg-sky-50 px-3 py-1 text-sky-700 dark:bg-slate-900 dark:border-sky-500/40 dark:text-sky-200"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

export default About;
