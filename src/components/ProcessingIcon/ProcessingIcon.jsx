function ProcessingIcon() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-md transition-colors">
      <div className="flex flex-col items-center space-y-6">
        {/* Pulse core */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 shadow-xl" />
        </div>

        {/* IOT LABS text */}
        <div className="relative text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 tracking-wide">
            IOT LABS
          </h2>
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 opacity-40 blur-sm" />
        </div>

        {/* Status message */}
        <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 animate-pulse">
          Initializing smart systems...
        </p>
      </div>
    </div>
  );
}

export default ProcessingIcon;
