function ProcessingIcon() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-8">
        {/* Futuristic Pulse Core */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 animate-ping opacity-40"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 shadow-xl"></div>
        </div>

        {/* IOT LABS Beam Text */}
        <div className="relative">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-text-glow tracking-wide">
            IOT LABS
          </h2>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50 blur-sm"></div>
        </div>

        {/* Status Message */}
        <p className="text-gray-700 font-medium text-lg animate-pulse">
          Initializing smart systems...
        </p>
      </div>
    </div>
  );
}

export default ProcessingIcon;