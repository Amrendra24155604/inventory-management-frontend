import { useEffect, useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { useTheme } from "../../context/ThemeContext.jsx";
import "../../index.css";

function Header({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const isLoggedIn = !!user;

  // Scrollspy: highlight links when scrolling on landing page
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const sections = document.querySelectorAll("main section[id]");
    if (!sections.length) {
      console.warn("No sections found for scrollspy");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            console.log("visible section:", id); // debug
            setActiveSection(id);
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: "-72px 0px 0px 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  const linkClass = (id) =>
    `relative px-3 py-1 text-sm font-medium transition-colors duration-300
     ${
       activeSection === id
         ? "text-sky-600 dark:text-sky-300 after:scale-x-100 after:origin-left"
         : "text-slate-700 dark:text-slate-300 after:scale-x-0 after:origin-right"
     }
     hover:text-sky-600
     after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full
     after:bg-sky-500 after:transition-transform after:duration-300 after:content-['']`;

  // Shared handler for header + sidebar
  const handleNavClick = (eOrId, maybeId) => {
    let targetId;

    // header: (event, "home"), sidebar: ("home")
    if (typeof eOrId === "string") {
      targetId = eOrId;
    } else {
      eOrId.preventDefault();
      targetId = maybeId;
    }

    const scrollToTarget = () => {
      const el = document.getElementById(targetId);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `/#${targetId}`);
      setActiveSection(targetId);
    };

    if (location.pathname === "/") {
      scrollToTarget();
    } else {
      navigate(`/#${targetId}`);
      setTimeout(scrollToTarget, 150);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-slate-50/90 backdrop-blur-xl shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          {/* Left: menu + logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setShowSidebar(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-sky-600 hover:shadow-md active:scale-95 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <RxHamburgerMenu className="text-lg" />
            </button>

            <a
              href="/#home"
              onClick={(e) => handleNavClick(e, "home")}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white text-sm font-bold shadow-sm">
                I
              </div>
              <span className="text-sm sm:text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                IOT Labs
              </span>
            </a>
          </div>

          {/* Center nav */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-6">
            <a
              href="/#home"
              onClick={(e) => handleNavClick(e, "home")}
              className={linkClass("home")}
            >
              Home
            </a>
            <a
              href="/#about"
              onClick={(e) => handleNavClick(e, "about")}
              className={linkClass("about")}
            >
              About
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className={linkClass("contact")}
            >
              Contact
            </a>
            <a
              href="/#more"
              onClick={(e) => handleNavClick(e, "more")}
              className={linkClass("more")}
            >
              More
            </a>
          </nav>

          {/* Right side (short) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:scale-105 hover:shadow-md transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              aria-label="Toggle theme"
            >
              <span className="text-base">{darkMode ? "🌙" : "☀️"}</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => navigate("/inventory")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-md hover:from-sky-600 hover:to-indigo-600 hover:shadow-lg active:scale-95 transition-all"
              >
                <FaBookOpen className="text-sm" />
                <span>Borrow</span>
              </button>
            ) : (
              <a href="/login">
                <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all dark:bg-sky-500 dark:hover:bg-sky-400">
                  Log in
                </button>
              </a>
            )}
          </div>
        </div>
      </header>

      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        user={user}
        activeSection={activeSection}
        onNavClick={(id) => handleNavClick(id)}
      />
    </>
  );
}

export default Header;
