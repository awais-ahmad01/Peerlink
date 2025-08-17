const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-slate-800 to-slate-950 text-white font-inter text-center px-4">
      <h1 className="text-7xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Oops! Page not found</h2>
      <p className="text-gray-300 max-w-md mb-8">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <a
        href="/"
        className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg text-white transition-colors"
      >
        Go Home
      </a>
    </div>
  );
}

export default NotFound;
