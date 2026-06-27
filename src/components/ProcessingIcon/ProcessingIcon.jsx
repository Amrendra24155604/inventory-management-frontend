function ProcessingIcon() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50/95 via-white/90 to-slate-50/95 dark:from-[#030712]/95 dark:via-[#0b1329]/90 dark:to-[#030712]/95 backdrop-blur-2xl transition-colors duration-500">
      
      {/* Dynamic Speeder CSS Injection */}
      <style>{`
        :root {
          --loader-color: #0284c7; /* Sky-600 in light mode */
        }
        .dark {
          --loader-color: #38bdf8; /* Sky-400 in dark mode */
        }

        .loader {
          position: absolute;
          top: 50%;
          margin-top: -12px;
          margin-left: -70px;
          left: 50%;
          animation: speeder 0.4s linear infinite;
        }
        .loader > span {
          height: 5px;
          width: 35px;
          background: var(--loader-color);
          position: absolute;
          top: -19px;
          left: 60px;
          border-radius: 2px 10px 1px 0;
          transition: background-color 0.3s ease;
        }
        .base span {
          position: absolute;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-right: 100px solid var(--loader-color);
          border-bottom: 6px solid transparent;
          transition: border-color 0.3s ease;
        }
        .base span:before {
          content: "";
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: var(--loader-color);
          position: absolute;
          right: -110px;
          top: -16px;
          transition: background-color 0.3s ease;
        }
        .base span:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-right: 55px solid var(--loader-color);
          border-bottom: 16px solid transparent;
          top: -16px;
          right: -98px;
          transition: border-color 0.3s ease;
        }
        .face {
          position: absolute;
          height: 12px;
          width: 20px;
          background: var(--loader-color);
          border-radius: 20px 20px 0 0;
          transform: rotate(-40deg);
          right: -125px;
          top: -15px;
          transition: background-color 0.3s ease;
        }
        .face:after {
          content: "";
          height: 12px;
          width: 12px;
          background: var(--loader-color);
          right: 4px;
          top: 7px;
          position: absolute;
          transform: rotate(40deg);
          transform-origin: 50% 50%;
          border-radius: 0 0 0 2px;
          transition: background-color 0.3s ease;
        }
        .loader > span > span:nth-child(1),
        .loader > span > span:nth-child(2),
        .loader > span > span:nth-child(3),
        .loader > span > span:nth-child(4) {
          width: 30px;
          height: 1px;
          background: var(--loader-color);
          position: absolute;
          animation: fazer1 0.2s linear infinite;
          transition: background-color 0.3s ease;
        }
        .loader > span > span:nth-child(2) {
          top: 3px;
          animation: fazer2 0.4s linear infinite;
        }
        .loader > span > span:nth-child(3) {
          top: 1px;
          animation: fazer3 0.4s linear infinite;
          animation-delay: -1s;
        }
        .loader > span > span:nth-child(4) {
          top: 4px;
          animation: fazer4 1s linear infinite;
          animation-delay: -1s;
        }
        @keyframes fazer1 {
          0% { left: 0; }
          100% { left: -80px; opacity: 0; }
        }
        @keyframes fazer2 {
          0% { left: 0; }
          100% { left: -100px; opacity: 0; }
        }
        @keyframes fazer3 {
          0% { left: 0; }
          100% { left: -50px; opacity: 0; }
        }
        @keyframes fazer4 {
          0% { left: 0; }
          100% { left: -150px; opacity: 0; }
        }
        @keyframes speeder {
          0% { transform: translate(2px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -3px) rotate(-1deg); }
          20% { transform: translate(-2px, 0px) rotate(1deg); }
          30% { transform: translate(1px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 3px) rotate(-1deg); }
          60% { transform: translate(-1px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-2px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 1px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .longfazers {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        .longfazers span {
          position: absolute;
          height: 2px;
          width: 20%;
          background: var(--loader-color);
          transition: background-color 0.3s ease;
        }
        .longfazers span:nth-child(1) {
          top: 20%;
          animation: lf 0.6s linear infinite;
          animation-delay: -5s;
        }
        .longfazers span:nth-child(2) {
          top: 40%;
          animation: lf2 0.8s linear infinite;
          animation-delay: -1s;
        }
        .longfazers span:nth-child(3) {
          top: 60%;
          animation: lf3 0.6s linear infinite;
        }
        .longfazers span:nth-child(4) {
          top: 80%;
          animation: lf4 0.5s linear infinite;
          animation-delay: -3s;
        }
        @keyframes lf {
          0% { left: 200%; }
          100% { left: -200%; opacity: 0; }
        }
        @keyframes lf2 {
          0% { left: 200%; }
          100% { left: -200%; opacity: 0; }
        }
        @keyframes lf3 {
          0% { left: 200%; }
          100% { left: -100%; opacity: 0; }
        }
        @keyframes lf4 {
          0% { left: 200%; }
          100% { left: -100%; opacity: 0; }
        }
      `}</style>

      <div className="flex flex-col items-center space-y-8 p-8 max-w-sm w-full mx-4">
        
        {/* Container for Speeder loader */}
        <div className="relative w-full h-32 overflow-hidden rounded-2xl bg-white/40 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/40 shadow-inner backdrop-blur-xl">
          <div className="loader">
            <span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <div className="base">
              <span></span>
              <div className="face"></div>
            </div>
          </div>
          <div className="longfazers">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Premium Typography */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-sky-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent font-display">
            IoT LABS
          </h2>
          <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-sky-400/50 via-indigo-400/50 to-purple-400/50 blur-[1px]" />
        </div>

        {/* Dynamic Status */}
        <div className="space-y-2 text-center">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
            Initializing Smart Systems
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
            <span>Connecting to cloud...</span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse-glow [animation-delay:0s]" />
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse-glow [animation-delay:0.2s]" />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse-glow [animation-delay:0.4s]" />
        </div>

      </div>
    </div>
  );
}

export default ProcessingIcon;
