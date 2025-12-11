import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const statusOptions = [
  "pending",
  "approved",
  "declined",
  "on-hold",
  "returned",
  "return",
  "expired",
];

export default function AdminBorrowApproval() {
  const API_PORT = import.meta.env.VITE_API_PORT;
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [adminRequestMessage, setAdminRequestMessage] = useState("");
  const [loadingActions, setLoadingActions] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [selectedStatus]);

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
      setLoadingActions((prev) => ({ ...prev, [`${id}-${type}`]: true }));

      const res = await fetch(`${API_PORT}/api/v1/auth${endpoint}`, {
        method,
        credentials: "include",
      });
      const result = await res.json();

      if (!res.ok || result.success === false) {
        if (result.details) {
          const issues = result.details
            .map(
              (item) =>
                `${item.name}: requested ${item.requested}, available ${item.available}`
            )
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
    } finally {
      setLoadingActions((prev) => {
        const next = { ...prev };
        delete next[`${id}-${type}`];
        return next;
      });
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
      const isReturnable = ["pending", "none", "partial"].includes(
        req.returnStatus
      );
      const isValidStatus = !["on-hold", "declined"].includes(req.status);
      return isReturnable && isValidStatus;
    }
    if (selectedStatus === "expired") {
      return (
        req.status === "approved" &&
        req.expiry &&
        new Date(req.expiry) < new Date()
      );
    }
    return req.status === selectedStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* title */}
      <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-slate-900 dark:text-slate-50 mb-8 sm:mb-10">
        🛠️ Admin{" "}
        <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
          borrow approval
        </span>
      </h2>

      {/* filters */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
        {statusOptions.map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full font-medium text-xs sm:text-sm transition-all ${
              selectedStatus === status
                ? "bg-sky-500 text-white shadow-md"
                : "bg-white text-sky-700 border border-slate-200 hover:bg-sky-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            }`}
          >
            {status === "returned"
              ? "History"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 gap-5">
        {filteredRequests.length === 0 ? (
          <div className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 bg-white/95 dark:bg-slate-900/95 shadow-sm"
            >
              {/* top meta */}
              <div className="mb-2">
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 break-all">
                  Request ID:{" "}
                  <span className="text-sky-600 dark:text-sky-400">
                    {req._id}
                  </span>
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="font-medium">Requested at:</span>{" "}
                  {new Date(req.requestedAt).toLocaleString()}
                </p>
              </div>

              {/* user + badges */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-sky-600 dark:text-sky-400">
                    User:
                  </span>{" "}
                  {req.user?.name || "Unknown"}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${
                      req.status === "pending"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100"
                        : req.status === "approved"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100"
                        : req.status === "declined"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-800 dark:text-rose-100"
                        : req.status === "on-hold"
                        ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100"
                    }`}
                  >
                    {req.status === "approved"
                      ? "Borrow approved"
                      : req.status === "returned"
                      ? "Returned"
                      : req.status.charAt(0).toUpperCase() +
                        req.status.slice(1)}
                  </span>

                  {req.returnStatus !== "none" && (
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${
                        req.returnStatus === "pending"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100"
                          : req.returnStatus === "partial"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-100"
                          : "bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-100"
                      }`}
                    >
                      {req.returnStatus === "pending"
                        ? "Return pending"
                        : req.returnStatus === "partial"
                        ? "Returned (partial)"
                        : "Return approved"}
                    </span>
                  )}
                </div>
              </div>

              {/* purpose + expiry */}
              <div className="mb-3 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {req.purpose && (
                  <p>
                    <span className="font-semibold">Purpose:</span>{" "}
                    {req.purpose}
                  </p>
                )}
                {req.expiry && (
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">Expiry:</span>{" "}
                    {new Date(req.expiry).toLocaleDateString()}
                    {new Date(req.expiry) < new Date() && (
                      <span className="text-[11px] font-semibold text-rose-600 bg-rose-100 dark:bg-rose-800 dark:text-rose-100 px-2 py-0.5 rounded-full">
                        ⏰ Expired
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* items */}
              <ul className="space-y-3 mb-4">
                {req.items.map((item, index) => (
                  <li
                    key={item.product?._id || `${req._id}-${index}`}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 sm:p-4 rounded-xl shadow-xs"
                  >
                    <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50">
                      {item.product?.name || "Unknown product"}
                      {item.product?.variant && (
                        <span className="ml-1.5 text-[11px] sm:text-xs font-medium text-sky-600 dark:text-sky-400">
                          ({item.product.variant})
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                      <div>
                        <span className="font-semibold">Requested:</span>{" "}
                        {item.quantityRequested}
                      </div>
                      {item.quantityReturned > 0 && (
                        <div className="text-emerald-600 dark:text-emerald-400">
                          <span className="font-semibold">Returned:</span>{" "}
                          {item.quantityReturned}
                        </div>
                      )}
                      {item.pendingReturn > 0 && (
                        <div className="text-sky-600 dark:text-sky-400">
                          <span className="font-semibold">
                            Requested to return:
                          </span>{" "}
                          {item.pendingReturn}
                        </div>
                      )}
                      {item.product?.initialQuantity !== undefined && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Stock: {item.product.quantityAvailable}/
                          {item.product.initialQuantity}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-2">
                {(selectedStatus === "pending" ||
                  selectedStatus === "on-hold") &&
                  (!req.expiry || new Date(req.expiry) >= new Date()) && (
                    <>
                      <ActionButton
                        label="✅ Approve borrow"
                        color="bg-sky-500 hover:bg-sky-400"
                        loading={loadingActions[`${req._id}-approveBorrow`]}
                        onClick={() => handleAction(req._id, "approveBorrow")}
                      />
                      <ActionButton
                        label="❌ Decline"
                        color="bg-rose-600 hover:bg-rose-500"
                        loading={loadingActions[`${req._id}-decline`]}
                        onClick={() => handleAction(req._id, "decline")}
                      />
                      {selectedStatus === "pending" && (
                        <ActionButton
                          label="⏸️ Put on hold"
                          color="bg-amber-500 hover:bg-amber-400"
                          loading={loadingActions[`${req._id}-hold`]}
                          onClick={() => handleAction(req._id, "hold")}
                        />
                      )}
                    </>
                  )}

                {selectedStatus === "return" &&
                  req.returnStatus === "pending" && (
                    <ActionButton
                      label="✅ Approve return"
                      color="bg-emerald-600 hover:bg-emerald-500"
                      loading={loadingActions[`${req._id}-approveReturn`]}
                      onClick={() => handleAction(req._id, "approveReturn")}
                    />
                  )}

                {selectedStatus === "return" &&
                  ["none", "partial"].includes(req.returnStatus) && (
                    <ActionButton
                      label="📦 Mark as returned"
                      color="bg-sky-600 hover:bg-sky-500"
                      loading={loadingActions[`${req._id}-returnDirect`]}
                      onClick={() => handleAction(req._id, "returnDirect")}
                    />
                  )}

                {selectedStatus === "returned" && (
                  <ActionButton
                    label="🗑️ Delete request"
                    color="bg-rose-600 hover:bg-rose-500"
                    loading={loadingActions[`${req._id}-delete`]}
                    onClick={() => handleAction(req._id, "delete")}
                  />
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* toast */}
      <AnimatePresence>
        {adminRequestMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 inset-x-0 flex justify-center z-[999]"
          >
            <div className="bg-sky-600 text-white px-5 py-2.5 rounded-full shadow-lg text-xs sm:text-sm text-center max-w-[90vw]">
              {adminRequestMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({ label, color, loading, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileTap={{ scale: 0.97 }}
      className={`w-full sm:w-auto px-4 py-2 rounded-full shadow text-xs sm:text-sm font-semibold text-white flex items-center justify-center transition ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      } ${color}`}
    >
      {loading ? (
        <>
          <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4" />
          Processing...
        </>
      ) : (
        label
      )}
    </motion.button>
  );
}
