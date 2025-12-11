function Features() {
  return (
    <section
      id="features"
      className="py-24 px-6 border-b border-neutral-900 bg-neutral-950/50 dark:border-neutral-900 dark:bg-neutral-900/20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-8 rounded-2xl border border-neutral-800 bg-black hover:border-brand-800 hover:shadow-neutral-800/50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-brand-900 hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 reveal">
            <div className="w-12 h-12 rounded-xl bg-brand-950 text-brand-400 dark:bg-brand-900/30 dark:text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <iconify-icon icon="lucide:box" width="24" stroke-width="1.5" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-100 dark:text-white mb-3">
              Borrow &amp; Return System
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Easily request, borrow, and return society-owned components for
              your technical projects. Managed digitally.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 rounded-2xl border border-neutral-800 bg-black hover:border-brand-800 hover:shadow-neutral-800/50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-brand-900 hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 reveal delay-100">
            <div className="w-12 h-12 rounded-xl bg-brand-950 text-brand-400 dark:bg-brand-900/30 dark:text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <iconify-icon icon="lucide:history" width="24" stroke-width="1.5" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-100 dark:text-white mb-3">
              Usage Insights
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Track borrowing history, popular items, and usage patterns to
              optimize resource planning for the lab.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 rounded-2xl border border-neutral-800 bg-black hover:border-brand-800 hover:shadow-neutral-800/50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-brand-900 hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 reveal delay-200">
            <div className="w-12 h-12 rounded-xl bg-brand-950 text-brand-400 dark:bg-brand-900/30 dark:text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <iconify-icon icon="lucide:users" width="24" stroke-width="1.5" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-100 dark:text-white mb-3">
              Member Roles &amp; Access
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Assign roles to team leads, coordinators, and members to manage
              inventory securely and efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
