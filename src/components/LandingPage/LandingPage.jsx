// // import { motion, useScroll, useTransform } from "framer-motion";
// // import { useEffect } from "react";
// // import Home from "../Home/Home.jsx";
// // import About from "../About/About.jsx";
// // import Contact from "../Contact/Contact.jsx";
// // import More from "../more/More.jsx";

// // function LandingPage() {
// //   const { scrollYProgress } = useScroll();
  
// //   useEffect(() => {
// //     document.documentElement.style.scrollBehavior = "smooth";
// //   }, []);

// //   // Home: Diagonal wipe reveal
// //   const homeClipPath = useTransform(scrollYProgress, [0, 0.2], [
// //     "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
// //     "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)"
// //   ]);

// //   // About: 3D card flip
// //   const aboutRotateY = useTransform(scrollYProgress, [0.25, 0.45], [-45, 0]);

// //   // Contact: Particle burst
// //   const contactScale = useTransform(scrollYProgress, [0.5, 0.65], [1.2, 1]);

// //   // More: Wave distortion
// //   const moreWave = useTransform(scrollYProgress, [0.7, 0.9], [0, 20]);

// //   return (
// //     <main className="w-full bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 relative">
      
// //       {/* HOME - Diagonal Wipe */}
// //       <section id="home" className="min-h-screen flex items-center justify-center py-24 px-6 lg:px-12">
// //         <motion.div
// //           className="w-full max-w-5xl mx-auto"
// //           style={{ clipPath: homeClipPath }}
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           transition={{ duration: 1.5 }}
// //         >
// //           <div className="relative">
// //             <Home />
// //             {/* Home accent glow */}
// //             <motion.div 
// //               className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl -z-10"
// //               animate={{ scale: [1, 1.1, 1] }}
// //               transition={{ duration: 3, repeat: Infinity }}
// //             />
// //           </div>
// //         </motion.div>
// //       </section>

// //       {/* ABOUT - 3D Card Flip */}
// //       <section id="about" className="py-28 px-6 lg:px-12">
// //         <motion.div
// //           className="max-w-6xl mx-auto perspective-1000"
// //           style={{ rotateY: aboutRotateY }}
// //           initial={{ opacity: 0, rotateY: 90 }}
// //           whileInView={{ opacity: 1 }}
// //           viewport={{ margin: "-20% 0px -15%" }}
// //           transition={{ duration: 1.8 }}
// //         >
// //           <div className="backface-hidden shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/50 dark:border-slate-800/50">
// //             <About />
// //           </div>
// //         </motion.div>
// //       </section>

// //       {/* CONTACT - Particle Burst */}
// //       <section id="contact" className="py-28 px-6 lg:px-12 relative overflow-hidden">
// //         <motion.div 
// //           className="absolute inset-0"
// //           style={{ scale: contactScale }}
// //           animate={{ 
// //             background: [
// //               "radial-gradient(circle at 20% 50%, #3B82F6 0%, transparent 50%)",
// //               "radial-gradient(circle at 80% 80%, #10B981 0%, transparent 50%)",
// //               "radial-gradient(circle at 40% 20%, #EF4444 0%, transparent 50%)"
// //             ]
// //           }}
// //           transition={{ duration: 4, repeat: Infinity }}
// //         />
// //         <motion.div
// //           className="max-w-4xl mx-auto relative z-10"
// //           initial={{ scale: 1.3, opacity: 0 }}
// //           whileInView={{ scale: 1, opacity: 1 }}
// //           viewport={{ margin: "-15% 0px" }}
// //           transition={{ duration: 1.6, type: "spring", stiffness: 80 }}
// //         >
// //           <Contact />
// //         </motion.div>
// //       </section>

// //       {/* MORE - Wave Distortion */}
// //       <section id="more" className="py-28 px-6 lg:px-12">
// //         <motion.div
// //           className="max-w-6xl mx-auto"
// //           style={{ skewY: moreWave }}
// //           initial={{ opacity: 0, skewY: 10 }}
// //           whileInView={{ opacity: 1, skewY: 0 }}
// //           viewport={{ margin: "-18% 0px" }}
// //           transition={{ 
// //             duration: 1.4, 
// //             skewY: { type: "spring", stiffness: 120 }
// //           }}
// //         >
// //           <div className="bg-gradient-to-r from-emerald-50/80 to-blue-50/80 dark:from-slate-900/70 dark:to-slate-800/70 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-emerald-200/50 dark:border-slate-700/50 shadow-xl">
// //             <More />
// //           </div>
// //         </motion.div>
// //       </section>

// //       {/* Progress ring */}
// //       <svg className="fixed top-6 right-6 w-12 h-12 z-50" viewBox="0 0 36 36">
// //         <motion.path
// //           className="stroke-slate-300 dark:stroke-slate-700"
// //           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
// //           style={{ pathLength: scrollYProgress }}
// //           strokeWidth="2"
// //           fill="none"
// //         />
// //         <circle cx="18" cy="18" r="10" fill="url(#gradient)" className="drop-shadow-lg"/>
// //       </svg>

// //       <defs>
// //         <radialGradient id="gradient" cx="50%" cy="50%">
// //           <stop offset="0%" stopColor="#3B82F6"/>
// //           <stop offset="70%" stopColor="#8B5CF6"/>
// //           <stop offset="100%" stopColor="#EC4899"/>
// //         </radialGradient>
// //       </defs>
// //     </main>
// //   );
// // }

// // export default LandingPage;
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useEffect } from "react";
// import Home from "../Home/Home.jsx";
// import About from "../About/About.jsx";
// import Contact from "../Contact/Contact.jsx";
// import More from "../more/More.jsx";

// function LandingPage() {
//   const { scrollYProgress } = useScroll();

//   useEffect(() => {
//     document.documentElement.style.scrollBehavior = "smooth";
//   }, []);

//   return (
//     <main className="w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/80 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-white relative">
      
//       {/* Subtle parallax background */}
//       <motion.div 
//         className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50/50 via-white/30 dark:from-slate-900/50 to-purple-50/30 dark:to-slate-800/50"
//         style={{ y: useTransform(scrollYProgress, [0, 1], [0, -60]) }}
//       />

//       {/* Home - Simple fade + slide */}
//       <section id="home" className="min-h-screen flex items-center justify-center py-20 px-6 lg:px-12">
//         <motion.div
//           className="w-full max-w-5xl mx-auto"
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ margin: "-20% 0px -10%", once: false }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           <Home />
//         </motion.div>
//       </section>

//       {/* About - Gentle lift */}
//       <section id="about" className="py-24 px-6 lg:px-12">
//         <motion.div
//           className="max-w-6xl mx-auto"
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ margin: "-20% 0px -10%", once: false }}
//           transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 80 }}
//         >
//           <About />
//         </motion.div>
//       </section>

//       {/* Contact - Smooth slide */}
//       <section id="contact" className="py-24 px-6 lg:px-12 bg-slate-50/50 dark:bg-slate-800/50">
//         <motion.div
//           className="max-w-4xl mx-auto"
//           initial={{ opacity: 0, x: 40 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           viewport={{ margin: "-20% 0px -10%", once: false }}
//           transition={{ duration: 0.9, ease: "easeOut" }}
//         >
//           <Contact />
//         </motion.div>
//       </section>

//       {/* More - Scale + fade */}
//       <section id="more" className="py-24 px-6 lg:px-12">
//         <motion.div
//           className="max-w-6xl mx-auto"
//           initial={{ opacity: 0, scale: 0.98 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           viewport={{ margin: "-20% 0px -10%", once: false }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           <More />
//         </motion.div>
//       </section>

//       {/* Clean progress bar */}
//       <motion.div
//         className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 shadow-md z-50 origin-left"
//         style={{ scaleX: scrollYProgress }}
//       />
//     </main>
//   );
// }

// export default LandingPage;
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useEffect } from "react";
// import Home from "../Home/Home.jsx";
// import About from "../About/About.jsx";
// import Contact from "../Contact/Contact.jsx";
// import More from "../more/more.jsx";

// function LandingPage() {
//   const { scrollYProgress } = useScroll();

//   useEffect(() => {
//     document.documentElement.style.scrollBehavior = "smooth";
//   }, []);

//   const parallaxBg = useTransform(scrollYProgress, [0, 1], [0, -120]);
//   const glowY = useTransform(scrollYProgress, [0, 1], [0, -40]);

//   return (
//     <main className="w-full min-h-screen text-slate-900 dark:text-slate-100 relative overflow-hidden bg-slate-950">
//       {/* Futuristic background */}
//       <motion.div
//         className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950"
//         style={{ y: parallaxBg }}
//       />
//       {/* Neon blobs */}
//       <motion.div
//         className="fixed -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/25 blur-3xl -z-10"
//         animate={{ x: [0, 40, -20, 0], y: [0, 20, -10, 0], opacity: [0.5, 0.9, 0.6, 0.5] }}
//         transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
//       />
//       <motion.div
//         className="fixed bottom-[-120px] right-[-80px] w-[520px] h-[520px] rounded-full bg-purple-500/25 blur-3xl -z-10"
//         style={{ y: glowY }}
//         animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.5] }}
//         transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
//       />

//       {/* Scroll progress bar */}
//       <motion.div
//         className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-sky-500 via-cyan-400 to-purple-500 shadow-lg z-50 origin-left"
//         style={{ scaleX: scrollYProgress }}
//       />

//       {/* Sections */}
//       <section id="home" className="min-h-screen flex items-center justify-center py-20 px-6 lg:px-12">
//         <motion.div
//           className="w-full max-w-6xl mx-auto"
//           initial={{ opacity: 0, y: 60, scale: 0.97 }}
//           whileInView={{ opacity: 1, y: 0, scale: 1 }}
//           viewport={{ margin: "-20% 0px -10%", once: false }}
//           transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
//         >
//           <Home />
//         </motion.div>
//       </section>

//       <section id="about" className="py-24 px-6 lg:px-12">
//         <motion.div
//           className="max-w-6xl mx-auto"
//           initial={{ opacity: 0, y: 60 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ margin: "-20% 0px -10%", once: false }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           <About />
//         </motion.div>
//       </section>

//       <section id="contact" className="py-24 px-6 lg:px-12">
//         <motion.div
//           className="max-w-4xl mx-auto"
//           initial={{ opacity: 0, x: 60 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           viewport={{ margin: "-20% 0px -10%", once: false }}
//           transition={{ duration: 0.9, ease: "easeOut" }}
//         >
//           <Contact />
//         </motion.div>
//       </section>

//       <section id="more" className="py-24 px-6 lg:px-12 pb-28">
//         <motion.div
//           className="max-w-6xl mx-auto"
//           initial={{ opacity: 0, scale: 0.96, y: 40 }}
//           whileInView={{ opacity: 1, scale: 1, y: 0 }}
//           viewport={{ margin: "-20% 0px -10%", once: false }}
//           transition={{ duration: 0.9, ease: "easeOut" }}
//         >
//           <More />
//         </motion.div>
//       </section>
//     </main>
//   );
// }

// export default LandingPage;
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useEffect } from "react";
// import Home from "../Home/Home.jsx";
// import About from "../About/About.jsx";
// import Contact from "../Contact/Contact.jsx";
// import More from "../more/more.jsx";

// function LandingPage() {
//   const { scrollYProgress } = useScroll();
//   const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]);

//   useEffect(() => {
//     document.documentElement.style.scrollBehavior = "smooth";
//   }, []);
// useEffect(() => {
//   const hash = window.location.hash.replace("#", "");
//   if (!hash) return;
//   const el = document.getElementById(hash);
//   if (el) {
//     setTimeout(() => {
//       el.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 50);
//   }
// }, []);

//   return (
//     <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative overflow-hidden">
//       {/* Soft background for both themes */}
//       <motion.div
//         className="fixed inset-0 -z-20"
//         style={{ y: bgY }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
//         <div className="pointer-events-none absolute -top-32 -left-24 h-64 w-64 rounded-full bg-sky-400/25 blur-3xl dark:bg-sky-500/25" />
//         <div className="pointer-events-none absolute bottom-[-96px] right-[-64px] h-64 w-64 rounded-full bg-indigo-400/25 blur-3xl dark:bg-indigo-500/25" />
//       </motion.div>

//       {/* Scroll progress */}
//       <motion.div
//         className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-sky-500 via-cyan-500 to-purple-500 shadow-lg z-50 origin-left"
//         style={{ scaleX: scrollYProgress }}
//       />

//       {/* Sections – mobile‑first spacing */}
//       <section id="home" className="min-h-[90vh] flex items-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
//         <div className="w-full max-w-6xl mx-auto">
//           <Home />
//         </div>
//       </section>

//       <section id="about" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto">
//           <About />
//         </div>
//       </section>

//       <section id="contact" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/80 dark:bg-slate-900/80">
//         <div className="max-w-5xl mx-auto">
//           <Contact />
//         </div>
//       </section>

//       <section id="more" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 pb-20">
//         <div className="max-w-6xl mx-auto">
//           <More />
//         </div>
//       </section>
//     </main>
//   );
// }

// export default LandingPage;
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";
import Home from "../Home/Home.jsx";
import About from "../About/About.jsx";
import Contact from "../Contact/Contact.jsx";
import More from "../more/more.jsx";

function LandingPage() {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }, []);

  return (
    <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative overflow-hidden">
      {/* Background */}
      <motion.div className="fixed inset-0 -z-20" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <div className="pointer-events-none absolute -top-32 -left-24 h-64 w-64 rounded-full bg-sky-400/25 blur-3xl dark:bg-sky-500/25" />
        <div className="pointer-events-none absolute bottom-[-96px] right-[-64px] h-64 w-64 rounded-full bg-indigo-400/25 blur-3xl dark:bg-indigo-500/25" />
      </motion.div>

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-sky-500 via-cyan-500 to-purple-500 shadow-lg z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Sections – ids must match Header/sidebar */}
      <section
        id="home"
        className="min-h-[90vh] flex items-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-6xl mx-auto">
          <Home />
        </div>
      </section>

      <section id="about" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <About />
        </div>
      </section>

      <section
        id="contact"
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/80 dark:bg-slate-900/80"
      >
        <div className="max-w-5xl mx-auto">
          <Contact />
        </div>
      </section>

      <section id="more" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <More />
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
