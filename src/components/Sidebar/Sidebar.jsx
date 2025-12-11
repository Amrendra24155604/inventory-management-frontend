import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar({ isOpen, onClose, user, activeSection, onNavClick }) {
  const API_PORT = import.meta.env.VITE_API_PORT;
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState("");
  const [adminRequestMessage, setAdminRequestMessage] = useState("");

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_PORT}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        localStorage.removeItem("justRegistered");
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleAdminRequest = async () => {
    try {
      const res = await fetch(`${API_PORT}/api/v1/auth/request-admin`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setAdminRequestMessage(data.message || "Request sent.");
      setTimeout(() => setAdminRequestMessage(""), 2000);
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  const handleLeaveAdmin = async () => {
    try {
      const res = await fetch(`${API_PORT}/api/v1/auth/leave-admin`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setLeaveMessage(data.message || "You have left the admin role.");
        setShowLeaveConfirm(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        alert(data.message || "Failed to leave admin role.");
      }
    } catch (err) {
      console.error("Error leaving admin post:", err);
    }
  };

  const avatarSrc = user
    ? user.avatarUrl ||
      user.photoUrl ||
      `https://ui-avatars.com/api/?name=${user.username?.charAt(
        0
      )}&background=0ea5e9&color=fff`
    : null;

  const linkBase =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
  const linkInactive =
    "text-slate-600 hover:text-sky-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-sky-400 dark:hover:bg-slate-800";

  const sectionBtnClass = (id) =>
    `${linkBase} ${
      activeSection === id
        ? "text-sky-600 bg-sky-50 dark:text-sky-300 dark:bg-slate-800"
        : linkInactive
    } w-full text-left`;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed top-0 right-0 z-50 h-full w-72 bg-white/95 dark:bg-slate-950/95 border-l border-slate-200 dark:border-slate-800 shadow-xl flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25 }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              your profile
            </span>
          </h2>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="text-slate-500 hover:text-rose-500 dark:text-slate-300 dark:hover:text-rose-400 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* profile */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-11 h-11 rounded-full object-cover border-2 border-sky-400 shadow-sm"
              />
            ) : (
              <FaUserCircle className="w-11 h-11 text-slate-400" />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {user?.username || "Guest"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email || "Not logged in"}
              </p>
            </div>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              onNavClick("home");
              onClose();
            }}
            className={sectionBtnClass("home")}
          >
            <FaHome className="text-sm" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavClick("about");
              onClose();
            }}
            className={sectionBtnClass("about")}
          >
            <FaInfoCircle className="text-sm" />
            <span>About</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavClick("contact");
              onClose();
            }}
            className={sectionBtnClass("contact")}
          >
            <FaEnvelope className="text-sm" />
            <span>Contact</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavClick("more");
              onClose();
            }}
            className={sectionBtnClass("more")}
          >
            <i className="fa fa-layer-group text-sm" aria-hidden="true" />
            <span>More</span>
          </button>

          {/* keep your admin / logout section here */}
        </nav>
      </motion.aside>
    </>
  );
}

export default Sidebar;
