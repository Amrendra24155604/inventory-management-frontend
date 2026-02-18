import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaUser, // Added for profile icon
} from "react-icons/fa";

function Sidebar({ isOpen, onClose, user, activeSection, onNavClick }) {
  const API_PORT = import.meta.env.VITE_API_PORT;
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState("");
  const [adminRequestMessage, setAdminRequestMessage] = useState("");
  // Add state for admin requests
  const [adminRequests, setAdminRequests] = useState([]);

  // Fetch admin requests if user is admin
  useEffect(() => {
    const fetchAdminRequests = async () => {
      if (user?.isAdmin) {
        try {
          const res = await fetch(`${API_PORT}/api/v1/auth/admin-requests`, {
            method: "GET",
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            setAdminRequests(data.requests || []);
          }
        } catch (err) {
          console.error("Error fetching admin requests:", err);
        }
      }
    };
    fetchAdminRequests();
  }, [user, API_PORT]);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowLeaveConfirm(false);
        setShowLogoutConfirm(false);
        onClose();
      }
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
            onClick={() => {
              setShowLeaveConfirm(false);
              setShowLogoutConfirm(false);
              onClose();
            }}
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
            onClick={() => {
              setShowLeaveConfirm(false);
              setShowLogoutConfirm(false);
              onClose();
            }}
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

        {/* nav - FIRST 4 BUTTONS (unchanged, perfect spacing) */}
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

          {/* BOTTOM SECTION - Proper margins/spacing for all buttons */}
          <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6 space-y-2">
            {/* Profile Option - Available to ALL users */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/profile";
                onClose();
              }}
              className={sectionBtnClass("profile")}
            >
              <FaUser className="text-sm" />
              <span>Profile</span>
            </button>

            {user?.role === 'admin' ? (
              <>
                {/* View Admin Requests Button */}
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/admin/requests";
                  }}
                  className={sectionBtnClass("admin-requests")}
                >
                  <FaUserCircle className="text-sm" />
                  <span>View Admin Requests</span>
                </button>

                {/* Pending Admin Requests List */}
                <div className="mb-3">
                  {adminRequests.length > 0 && (
                    <ul className="space-y-2 text-sm">
                      {adminRequests.map((req) => (
                        <li
                          key={req.id}
                          className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 flex justify-between items-center"
                        >
                          <span className="text-slate-700 dark:text-slate-300">
                            {req.username} ({req.email})
                          </span>
                          {/* Approve / Reject buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  await fetch(`${API_PORT}/api/v1/auth/approve-admin/${req.id}`, {
                                    method: "POST",
                                    credentials: "include",
                                  });
                                  setAdminRequests((prev) =>
                                    prev.filter((r) => r.id !== req.id)
                                  );
                                } catch (err) {
                                  console.error("Approve failed:", err);
                                }
                              }}
                              className="px-2 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await fetch(`${API_PORT}/api/v1/auth/reject-admin/${req.id}`, {
                                    method: "POST",
                                    credentials: "include",
                                  });
                                  setAdminRequests((prev) =>
                                    prev.filter((r) => r.id !== req.id)
                                  );
                                } catch (err) {
                                  console.error("Reject failed:", err);
                                }
                              }}
                              className="px-2 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Leave Admin Role */}
                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(true)}
                  className={sectionBtnClass("leave-admin")}
                >
                  <FaSignOutAlt className="text-sm" />
                  <span>Leave Admin Role</span>
                </button>
              </>
            ) : (
              <>
                {/* Submit Admin Request */}
                <button
                  type="button"
                  onClick={handleAdminRequest}
                  className={sectionBtnClass("request-admin")}
                >
                  <FaUserCircle className="text-sm" />
                  <span>Request Admin Access</span>
                </button>
                {adminRequestMessage && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 px-3">
                    {adminRequestMessage}
                  </p>
                )}
              </>
            )}

            {/* Logout - Extra spacing at bottom */}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-3 py-2.5 w-full rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-rose-700 active:scale-95 transition-all duration-200 border border-rose-400/50 mt-4"
            >
              <FaSignOutAlt className="text-sm -ml-0.5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </motion.aside>

      {/* Leave Admin Confirmation Modal */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowLeaveConfirm(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-slate-200/50 dark:border-slate-700/50 shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mt-0.5">
                  <FaExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50 mb-1">
                    Leave Admin Role?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    This action will remove your admin privileges. You can request access again later.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <button
                  onClick={handleLeaveAdmin}
                  className="flex-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 border border-rose-400/50"
                >
                  Yes, Leave
                </button>
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 border border-slate-200/50 dark:border-slate-700/50"
                >
                  Cancel
                </button>
              </div>
              {leaveMessage && (
                <p className="mt-3 px-1 py-2 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200/50 dark:border-emerald-800/50 rounded-lg text-xs text-emerald-800 dark:text-emerald-200 text-center font-medium">
                  {leaveMessage}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-slate-200/50 dark:border-slate-700/50 shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-rose-100 dark:bg-rose-900/50 rounded-xl flex items-center justify-center mt-0.5">
                  <FaSignOutAlt className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50 mb-1">
                    Sign Out?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    You will need to log in again to access your account.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 border border-rose-400/50"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 border border-slate-200/50 dark:border-slate-700/50"
                >
                  Stay
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
