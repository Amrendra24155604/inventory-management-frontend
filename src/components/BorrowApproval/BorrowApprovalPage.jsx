import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// const statusOptions = ["pending", "approved", "declined", "on-hold", "returned", "return"];
const statusOptions = ["pending", "approved", "declined", "on-hold", "returned", "return", "expired"];
export default function AdminBorrowApproval() {
   const API_PORT= import.meta.env.VITE_API_PORT;
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [adminRequestMessage, setAdminRequestMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
  try {
    const endpoint =
      selectedStatus === "expired"
        ? `${API_PORT}/api/v1/auth/borrow/expired-approved`
        : `${API_PORT}/api/v1/auth/all`;

    const res = await fetch(endpoint, { credentials: "include" });
    const data = await res.json();
    setRequests(data?.data || []);
  } catch {
    showMessage("❌ Failed to fetch borrow requests.");
  }
};
useEffect(() => {
  fetchRequests();
}, [selectedStatus]);

  const showMessage = (msg) => {
    setAdminRequestMessage(msg);
    setTimeout(() => setAdminRequestMessage(""), 3000);
  };

  const handleAction = async (id, type) => {
    const endpoints = {
      approveBorrow: `/borrow/${id}/approve`,
      approveReturn: `/${id}/return/approve`,
      returnDirect: `/borrow/${id}/return/direct`,
      decline: `/borrow/${id}/decline`,
      hold: `/borrow/${id}/hold`,
      delete: `/borrow/${id}`,
    };

    const method = type === "delete" ? "DELETE" : "PATCH";
    const endpoint = endpoints[type];
    if (!endpoint) return;

    try {
      const res = await fetch(`${API_PORT}/api/v1/auth${endpoint}`, {
        method,
        credentials: "include",
      });
      const result = await res.json();

      if (!res.ok || result.success === false) {
        if (result.details) {
          const issues = result.details
            .map((item) => `${item.name}: requested ${item.requested}, available ${item.available}`)
            .join(" | ");
          showMessage(`❌ Insufficient stock: ${issues}`);
        } else {
          showMessage(`❌ ${result.message || `Failed to ${type}`}`);
        }
      } else {
        showMessage(`✅ ${result.message || `${type} successful`}`);
        fetchRequests();
      }
    } catch {
      showMessage(`❌ Error while trying to ${type}`);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (selectedStatus === "returned") {
      return req.status === "returned" || req.returnStatus === "partial";
    }
    if (selectedStatus === "approved") {
      return req.status === "approved" && req.returnStatus === "none";
    }
    if (selectedStatus === "return") {
      const isReturnable = ["pending", "none", "partial"].includes(req.returnStatus);
      const isValidStatus = !["on-hold", "declined"].includes(req.status);
      return isReturnable && isValidStatus;
    }
    if (selectedStatus === "expired") {
      return req.status === "approved" && req.expiry && new Date(req.expiry) < new Date();
    }
    return req.status === selectedStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 dark:from-gray-950 dark:to-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-6">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-indigo-700 dark:text-white">
        🛠️ Admin Borrow Approval
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-10">
        {statusOptions.map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 sm:px-5 sm:py-2 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
              selectedStatus === status
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-indigo-600 dark:text-white border hover:bg-indigo-100 dark:hover:bg-gray-700"
            }`}
          >
            {status === "returned" ? "History" : status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRequests.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            {selectedStatus === "return"
              ? "No return requests at the moment."
              : selectedStatus === "returned"
              ? "No completed returns yet."
              : `No ${selectedStatus} requests found.`}
          </div>
        ) : (
          filteredRequests.map((req) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 sm:p-6 bg-white dark:bg-gray-900 shadow hover:shadow-xl transition"
            >
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:hidden">
                Status: {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </p>

              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                <p className="text-base sm:text-lg font-semibold dark:text-white flex items-center gap-2">
                  Request ID: <span className="text-indigo-700 dark:text-indigo-400">{req._id}</span>
                </p>
                <span className="font-medium">Requested At:</span>{" "}
                {new Date(req.requestedAt).toLocaleString()}
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
                <p className="text-sm">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">User:</span>{" "}
                  {req.user?.name || "Unknown"}
                </p>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
                  <motion.span
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-center whitespace-nowrap ${
                      req.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                        : req.status === "approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        : req.status === "declined"
                        ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                        : req.status === "on-hold"
                        ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {req.status === "approved"
                      ? "Borrow Approved"
                      : req.status === "returned"
                      ? "Returned"
                      : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </motion.span>

                  {req.returnStatus !== "none" && (
                    <motion.span
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-center whitespace-nowrap ${
                        req.returnStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                          : req.returnStatus === "partial"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                      }`}
                    >
                      {req.returnStatus === "pending"
                        ? "Return Pending"
                        : req.returnStatus === "partial"
                        ? "Returned (Partial)"
                        : "Return Approved"}
                    </motion.span>
                  )}
                </div>
              </div>

        {/* Purpose and Expiry */}
<div className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
  {req.purpose && (
    <p>
      <span className="font-semibold">Purpose:</span> {req.purpose}
    </p>
  )}
  {req.expiry && (
    <p className="flex items-center gap-2">
      <span className="font-semibold">Expiry:</span>{" "}
      {new Date(req.expiry).toLocaleDateString()}
      {new Date(req.expiry) < new Date() && (
        <span className="text-xs font-semibold text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200 px-2 py-1 rounded-full">
          ⏰ Expired
        </span>
      )}
    </p>
  )}
</div>

              {/* Items */}
<ul className="space-y-4 mb-4">
  {req.items.map((item, index) => (
    <li
      key={item.product?._id || `${req._id}-${index}`}
      className="bg-indigo-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
    >
      <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
        {item.product?.name || "Unknown Product"}
        {item.product?.variant && (
          <span className="ml-2 text-sm font-medium text-indigo-500 dark:text-indigo-400">
            ({item.product.variant})
          </span>
        )}
      </div>
      <div className="mt-1 text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <div><strong>Requested:</strong> {item.quantityRequested}</div>
        {item.quantityReturned > 0 && (
          <div className="text-green-600 dark:text-green-400">
            <strong>Returned:</strong> {item.quantityReturned}
          </div>
        )}
        {item.pendingReturn > 0 && (
          <div className="text-blue-600 dark:text-blue-400">
            <strong>Requested to Return:</strong> {item.pendingReturn}
          </div>
        )}
        {item.condition && (
          <div className="italic text-gray-500 dark:text-gray-400">{item.condition}</div>
        )}
        {item.product?.initialQuantity !== undefined && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Stock: {item.product.quantityAvailable}/{item.product.initialQuantity}
          </div>
        )}
      </div>
    </li>
  ))}
</ul>

{/* Action Buttons */}
<div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
  {(selectedStatus === "pending" || selectedStatus === "on-hold") &&
    (!req.expiry || new Date(req.expiry) >= new Date()) && (
      <>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleAction(req._id, "approveBorrow")}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:shadow-lg transition-all duration-300"
        >
          ✅ Approve Borrow
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleAction(req._id, "decline")}
          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-full shadow hover:shadow-lg transition-all duration-300"
        >
          ❌ Decline
        </motion.button>

        {selectedStatus === "pending" && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleAction(req._id, "hold")}
            className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white rounded-full shadow hover:shadow-lg transition-all duration-300"
          >
            ⏸️ Put on Hold
          </motion.button>
        )}
      </>
    )}

  {selectedStatus === "return" && req.returnStatus === "pending" && (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => handleAction(req._id, "approveReturn")}
      className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-full shadow hover:shadow-lg transition-all duration-300"
    >
      ✅ Approve Return
    </motion.button>
  )}

  {selectedStatus === "return" && ["none", "partial"].includes(req.returnStatus) && (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => handleAction(req._id, "returnDirect")}
      className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:shadow-lg transition-all duration-300"
    >
      📦 Mark as Returned
    </motion.button>
  )}

  {selectedStatus === "returned" && (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => handleAction(req._id, "delete")}
      className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-full shadow hover:shadow-lg transition-all duration-300"
    >
      🗑️ Delete Request
    </motion.button>
  )}
</div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {adminRequestMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 inset-x-0 flex justify-center z-[999]"
          >
            <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg text-sm sm:text-base">
              {adminRequestMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
