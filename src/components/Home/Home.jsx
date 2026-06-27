// import { useState } from "react";
// import { Typewriter } from "react-simple-typewriter";
// import { FaPlus, FaBoxes, FaHandHolding, FaUndo, FaUsers } from "react-icons/fa";
// import { Link } from "react-router-dom";

// function Home() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const toggleMenu = () => setMenuOpen((prev) => !prev);

//   return (
//     <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white relative overflow-hidden">
//       {/* Blurable Content */}
//       <div className={`transition duration-300 ${menuOpen ? "blur-sm scale-[0.98]" : "blur-0 scale-100"}`}>
//         {/* Hero Section */}
//         <section className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
//           <h1 className="text-4xl font-bold mb-4">
//             <span className="text-blue-600 dark:text-blue-400">
//               <Typewriter
//                 words={[
//                   "IOT LABS",
//                   "Welcomes you to InventoryPro",
//                   "Borrow. Build. Achieve.",
//                   "Share , Build , Grow.",
//                 ]}
//                 loop={0}
//                 cursor
//                 cursorStyle="|"
//                 typeSpeed={50}
//                 deleteSpeed={50}
//                 delaySpeed={1500}
//               />
//             </span>
//           </h1>
//           <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
//              Streamlining access to shared components so students can focus on building, experimenting, and innovating together.
//           </p>
//           <div className="flex justify-center gap-4">
//             <Link to="/inventory" className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
//               Get Started
//             </Link>
//             <Link to="/learn" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition">
//               Learn More
//             </Link>
//           </div>
//         </section>
//         {/* Features Section */}
//         <section className="bg-gray-50 dark:bg-gray-800 py-16 relative z-10">
//           <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
//             {[
//   {
//     icon: <FaBoxes className=" text-blue-600 dark:text-blue-400 text-3xl mb-4" />,
//     title: "Borrow & Return System",
//     desc: "Easily request, borrow, and return society-owned components for your technical projects.",
//   },
//   {
//     icon: <FaUndo className=" text-blue-600 dark:text-blue-400 text-3xl mb-4" />,
//     title: "Usage Insights",
//     desc: "Track borrowing history, popular items, and usage patterns to optimize resource planning.",
//   },
//   {
//     icon: <FaUsers className=" text-blue-600 dark:text-blue-400 text-3xl mb-4" />,
//     title: "Member Roles & Access",
//     desc: "Assign roles to team leads, coordinators, and members to manage inventory securely and efficiently.",
//   },
// ].map((feature, idx) => (
//               <div key={idx} className="p-6 bg-white dark:bg-gray-900 rounded shadow hover:shadow-md transition">
//                 {feature.icon}
//                 <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//                 <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>


//     </main>
//   );
// }

// export default Home;    {/* Floating Action Button + Menu */}
//       {/* <div className="fixed bottom-6 right-6 z-50"> */}
//         {/* Menu Options */}
//         {/* <div
//           className={`absolute bottom-20 right-0 flex flex-col items-end gap-4 transition-all duration-500 ${
//             menuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-0 translate-y-4 pointer-events-none"
//           }`}
//         >
//           {[
//             { icon: <FaBoxes />, label: "Inventory", path: "/inventory" },
//             { icon: <FaHandHolding />, label: "Borrow", path: "/borrow" },
//             { icon: <FaUndo />, label: "Return", path: "/return" },
//             { icon: <FaUsers />, label: "Teams", path: "/Teams" },
//           ].map((item, idx) => (
//             <Link
//               key={idx}
//               to={item.path}
//               className="bg-white dark:bg-gray-700 shadow rounded-full px-4 py-2 flex items-center gap-2 hover:scale-105 hover:shadow-lg transition text-gray-800 dark:text-white"
//             >
//               <span className="text-blue-600 dark:text-blue-400">{item.icon}</span>
//               <span className="text-sm font-medium">{item.label}</span>
//             </Link>
//           ))}
//         </div> */}

//         {/* Main FAB */}
//         {/* <button
//           onClick={toggleMenu}
//           aria-label="Toggle menu"
//           className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition ${
//             menuOpen ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
//           } text-white`}
//         >
//           <FaPlus size={24} />
//         </button> */}
//       {/* </div> */}
import { motion } from "framer-motion";
import { FaBoxes, FaUndo, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const featureCards = [
  {
    icon: FaBoxes,
    title: "All components, one view",
    desc: "Quickly see what your lab owns, what’s in use, and what’s available.",
  },
  {
    icon: FaUndo,
    title: "Smooth borrowing",
    desc: "Clean flows for taking, extending, and returning components.",
  },
  {
    icon: FaUsers,
    title: "Roles that fit teams",
    desc: "Different access for coordinators, mentors, and members.",
  },
];

function Home() {
  return (
    <div className="space-y-10">
      {/* Hero card */}
      <motion.div
        className="rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/40 shadow-xl shadow-slate-900/5 px-6 py-9 sm:px-10 sm:py-12"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ margin: "-20% 0px -10%", once: false }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-sky-500/10 text-sky-600 border border-sky-500/20 text-[11px] font-bold tracking-[0.18em] uppercase dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          IOT LABS • INVENTORY PRO
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] font-display">
          Track, share, and protect
          <span className="block bg-gradient-to-r from-sky-400 via-teal-400 to-indigo-500 bg-clip-text text-transparent mt-1">
            every lab component.
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
          InventoryPro keeps components organized and accessible so students
          spend less time searching and more time building.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/inventory"
            className="w-full sm:w-auto inline-flex justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            Open inventory
          </Link>
          <Link
            to="/learn"
            className="w-full sm:w-auto inline-flex justify-center rounded-full border border-sky-500/50 px-6 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-500/5 dark:text-sky-300 dark:border-sky-500/40 dark:hover:bg-sky-500/10 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            Learn more
          </Link>
        </div>

        {/* Stats – glassmorphic cards */}
        <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="rounded-2xl bg-slate-50/50 border border-slate-100/60 px-4 py-4 text-left dark:bg-slate-950/20 dark:border-slate-800/40 shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              480+
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium mt-0.5">
              Components tracked
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50/50 border border-slate-100/60 px-4 py-4 text-left dark:bg-slate-950/20 dark:border-slate-800/40 shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <p className="text-xl sm:text-2xl font-bold text-emerald-500 font-display">99.4%</p>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium mt-0.5">
              On‑time returns
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50/50 border border-slate-100/60 px-4 py-4 text-left dark:bg-slate-950/20 dark:border-slate-800/40 shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <p className="text-xl sm:text-2xl font-bold text-indigo-500 dark:text-indigo-400 font-display">24/7</p>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium mt-0.5">
              Self‑service access
            </p>
          </div>
        </div>
      </motion.div>

      {/* Features section */}
      <section>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              className="rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/40 px-5 py-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] hover:border-sky-500/20 dark:hover:border-sky-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20% 0px -10%", once: false }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/15 dark:border-sky-500/30 text-sky-600 dark:text-sky-300">
                <Icon size={19} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5 font-display">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
