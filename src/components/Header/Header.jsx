import { useEffect, useState, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "../Sidebar/Sidebar";
import { useTheme } from "../../context/ThemeContext.jsx";
import "../../index.css";
function Header() {
    const API_PORT= import.meta.env.VITE_API_PORT;

  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

 useEffect(() => {
  const excludedPaths = ["/logout"]; // Add any paths you want to exclude

  if (excludedPaths.includes(location.pathname)) return;

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_PORT}/api/v1/auth/current-user`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Unauthorized");

      const data = await response.json();
      setUser(data.data); 
      setIsLoggedIn(true);
    } catch (error) {
      console.warn("User not logged in");
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  fetchUser();
}, [location.pathname]); 
useEffect(() => {
  console.log("Fetched user:", user);
}, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const linkClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-medium transition duration-300 ${
      isActive ? "text-blue-600" : "text-gray-700"
    } hover:text-blue-600 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:scale-x-0 after:bg-blue-600 after:transition-transform after:duration-300 hover:after:scale-x-100`;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md dark:bg-gray-900 dark:text-white">
  <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4 md:gap-0">
    {/* Left: Sidebar Icon + Logo */}
    <div className="flex items-center gap-4 flex-shrink-0">
      <button
        onClick={() => setShowSidebar(true)}
        className="text-indigo-600 hover:text-purple-600 transition transform hover:scale-110"
        aria-label="Open sidebar"
      >
        <RxHamburgerMenu className="text-2xl" />
      </button>
      <NavLink
        to="/"
        className="text-xl font-bold text-blue-600 dark:text-white hover:text-blue-700 transition"
      >
        IOT Labs
      </NavLink>
    </div>

    {/* Center: Navigation (hidden on mobile) */}
    <nav className="hidden md:flex gap-6 justify-center flex-1">
      <NavLink to="/" className={linkClass}>Home</NavLink>
      <NavLink to="/about" className={linkClass}>About</NavLink>
      <NavLink to="/contact" className={linkClass}>Contact</NavLink>
      <NavLink to="/more" className={linkClass}>More</NavLink>
    </nav>

    {/* Right: Theme + Auth Buttons */}
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-300 dark:border-gray-700 hover:scale-110 hover:rotate-[15deg] transition-all duration-300 ease-in-out group"
        aria-label="Toggle theme"
      >
        <span className="text-xl transition-transform duration-300 group-hover:scale-125">
          {darkMode ? "🌙" : "☀️"}
        </span>
      </button>

      {/* Auth Buttons */}
      {location.pathname === "/register" ? (
        <NavLink to="/login">
          <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-md hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-300 ease-in-out">
            Log in
          </button>
        </NavLink>
      ) : location.pathname === "/login" ? (
        <NavLink to="/register">
          <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-md hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-300 ease-in-out">
            Register
          </button>
        </NavLink>
      ) : isLoggedIn ? (
        <NavLink to="/borrow">
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full hover:scale-105 hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transform transition duration-300 ease-in-out">
            <FaBookOpen className="text-white text-base" />
            Borrow
          </button>
        </NavLink>
      ) : (
        <NavLink to="/login">
          <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-md hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-300 ease-in-out">
            Log in
          </button>
        </NavLink>
      )}
    </div>
  </div>
</header>

      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} user={user} />
    </>
  );
}

export default Header;