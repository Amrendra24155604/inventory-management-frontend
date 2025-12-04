import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ViewAdminRequests() {
   const API_PORT= import.meta.env.VITE_API_PORT;
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [adminRequestMessage, setAdminRequestMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetct(`${API_PORT}/api/v1/auth/admin/requests`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setRequests(data.requests);
    } catch (err) {
      console.error(err);
      setError("Failed to load admin requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (targetUserId, action) => {
    setActioningId(targetUserId);
    try {
      const res = await fetch(`${API_PORT}/api/v1/auth/admin/handle-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ targetUserId, action }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setAdminRequestMessage(`Request ${action === "accept" ? "accepted" : "declined"} successfully`);
      setTimeout(() => setAdminRequestMessage(""), 3000);

      fetchRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to process request.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-6 py-16">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-10">
        🧑‍💼 Admin Requests
      </h1>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-600 dark:text-red-400 text-sm text-center mb-6"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No pending requests.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
          <AnimatePresence>
            {requests.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-xl shadow-md border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold mb-2">{user.username}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Email: <span className="font-medium">{user.email}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Roll No: <span className="font-medium">{user.rollNumber}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Domain: <span className="font-medium">{user.domain}</span>
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleAction(user._id, "accept")}
                    disabled={actioningId === user._id}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                  >
                    <FaCheckCircle />
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(user._id, "declin")}
                    disabled={actioningId === user._id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                  >
                    <FaTimesCircle />
                    Decline
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Success Popup */}
      <AnimatePresence>
  {adminRequestMessage && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="ixed bottom-10 inset-x-0 flex justify-center z-[999]"
    >
      <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg">
        {adminRequestMessage}
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </main>
  );
}