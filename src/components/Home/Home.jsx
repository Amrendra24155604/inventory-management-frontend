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
        className="rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg px-5 py-8 sm:px-8 sm:py-10"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ margin: "-20% 0px -10%", once: false }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-sky-50 text-sky-700 text-[11px] font-semibold tracking-[0.18em] uppercase dark:bg-sky-900/40 dark:text-sky-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          IOT LABS • INVENTORY PRO
        </div>

        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Track, share, and protect
          <span className="block bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            every lab component.
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
          InventoryPro keeps components organized and accessible so students
          spend less time searching and more time building.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/inventory"
            className="w-full sm:w-auto inline-flex justify-center rounded-full bg-sky-500 px-6 py-2.75 text-sm font-semibold text-white shadow-md shadow-sky-500/30 hover:bg-sky-400 transition"
          >
            Open inventory
          </Link>
          <Link
            to="/learn"
            className="w-full sm:w-auto inline-flex justify-center rounded-full border border-sky-500/70 px-6 py-2.75 text-sm font-semibold text-sky-700 hover:bg-sky-50 dark:text-sky-200 dark:hover:bg-slate-900/60 transition"
          >
            Learn more
          </Link>
        </div>

        {/* Stats – big tap areas on mobile */}
        <div className="mt-7 grid grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-3 text-left dark:bg-slate-900 dark:border-slate-700">
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              480+
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
              Components tracked
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-3 text-left dark:bg-slate-900 dark:border-slate-700">
            <p className="font-semibold text-emerald-500">99.4%</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
              On‑time returns
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-3 text-left dark:bg-slate-900 dark:border-slate-700">
            <p className="font-semibold text-indigo-500">24 / 7</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
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
              className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-4 py-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20% 0px -10%", once: false }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
                <Icon size={18} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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
