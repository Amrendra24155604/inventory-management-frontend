import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
// const [leaveMessage, setLeaveMessage] = useState("");
function Sidebar({ isOpen, onClose, user }) {
   const API_PORT= import.meta.env.VITE_API_PORT;
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState(""); 
  const [adminRequestMessage, setAdminRequestMessage] = useState("");
  const location = useLocation();

useEffect(() => {
  if (isOpen) {
    onClose(); // Close sidebar when route changes
  }
}, [location.pathname]);
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
    setTimeout(() => setAdminRequestMessage(""), 2000); // Hide after 2 seconds
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
      }, 2000); // Redirect after 2 seconds
    } else {
      alert(data.message || "Failed to leave admin role.");
    }
  } catch (err) {
    console.error("Error leaving admin post:", err);
  }
};

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-indigo-600 dark:text-white">Your Profile</h2>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center gap-3">
            {user ? (
              <img
                src={
                  user.avatarUrl ||user.photoUrl||
                  `https://ui-avatars.com/api/?name=${user.username?.charAt(0)}&background=4c51bf&color=fff`
                }
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border-4 border-indigo-500"
              />
            ) : (
              <FaUserCircle className="w-12 h-12 text-gray-400" />
            )}
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                {user?.username || "Guest"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || "Not logged in"}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3 mt-6">
            <NavLink
              to="/" onClick={onClose}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <FaHome /> Home
            </NavLink>
            <NavLink
              to="/about" onClick={onClose}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <FaInfoCircle /> About
            </NavLink>
            <NavLink
              to="/contact" onClick={onClose}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <FaEnvelope /> Contact
            </NavLink>
            <NavLink
              to="/profile" onClick={onClose}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <i className="fa fa-address-book" aria-hidden="true"></i> Your Profile
            </NavLink>

            {/* Admin-only: View Requests & Leave Post */}
            {user?.role === "admin" && (
              <>
                <NavLink
                  to="/admin/requests" onClick={onClose}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  <i className="fa fa-user-shield" aria-hidden="true"></i> View Admin Requests
                </NavLink>
                <div
                  onClick={() => setShowLeaveConfirm(true)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
                >
                  <FaUserCircle />
                  <span>Leave Admin Post</span>
                </div>
              </>
            )}

            {/* User-only: Request Admin Access */}
            {user?.role === "user" && (
              <button
                onClick={handleAdminRequest}
                className="flex items-center justify-between w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
              >
                <span>Request Admin Access</span>
                <FaUserCircle className="text-white" />
              </button>
            )}{/* Logout Button for Mobile */}
<div className="block sm:hidden">
  <button
    onClick={handleLogout}
    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
  >
    Logout <FaSignOutAlt className="text-white" />
  </button>
</div>
          </nav>
        </div>

        {/* Logout Button for Desktop */}
<div className="absolute bottom-6 left-6 right-6 hidden sm:block">
  <button
    onClick={handleLogout}
    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
  >
    Logout <FaSignOutAlt className="text-white" />
  </button>
</div>
      </div>

      {/* Full-page Confirmation Modal */}
      <AnimatePresence>
  {showLeaveConfirm && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-sm w-full text-center"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Are you sure you want to leave the admin post?
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleLeaveAdmin}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Yes, Leave
          </button>
          <button
            onClick={() => setShowLeaveConfirm(false)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
<AnimatePresence>
  {leaveMessage && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-10 inset-x-0 flex justify-center z-[999]"
    >
      <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg">
        {leaveMessage}
      </div>
    </motion.div>
  )}
</AnimatePresence>
<AnimatePresence>
  {adminRequestMessage && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-10 inset-x-0 flex justify-center z-[999]"
    >
      <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg">
        {adminRequestMessage}
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}

export default Sidebar;