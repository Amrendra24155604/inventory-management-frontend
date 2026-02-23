function ProcessingIcon() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50/95 via-white/90 to-slate-50/95 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-950/95 backdrop-blur-2xl">
      <div className="flex flex-col items-center space-y-8 p-8 max-w-sm mx-4">
        {/* Premium CIRCULAR Orbit Loader */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28">
          {/* Outer ring - CIRCLE */}
          <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 backdrop-blur-xl ring-2 ring-sky-500/30 animate-spin-slow" />
          
          {/* Middle orbit - CIRCLE */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-sky-500/30 backdrop-blur-lg ring-1 ring-purple-500/40 animate-spin-reverse" />
          
          {/* Core pulse - CIRCLE */}
          <div className="absolute inset-8 sm:inset-9 w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-400 to-purple-500 shadow-2xl ring-2 ring-white/50 backdrop-blur-xl animate-pulse-glow">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/90 rounded-full shadow-lg animate-bounce-glow" />
          </div>
          
          {/* Particles - Perfect positioning */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-sky-400/80 rounded-full animate-float-1" />
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-purple-400/80 rounded-full animate-float-2" />
          <div className="absolute top-1/2 -right-1 w-2.5 h-2.5 bg-indigo-400/80 rounded-full animate-float-3" />
        </div>

        {/* Premium Typography - UNCHANGED */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.05em] bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-sky-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
            IoT LABS
          </h2>
          <div className="h-px w-20 mx-auto bg-gradient-to-r from-sky-400/50 via-indigo-400/50 to-purple-400/50 blur-sm" />
        </div>

        {/* Dynamic Status - UNCHANGED */}
        <div className="space-y-2 text-center">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide animate-fade-in-up">
            Initializing Smart Systems
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
            <span>Connecting to cloud...</span>
          </div>
        </div>

        {/* Progress Dots - UNCHANGED */}
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
