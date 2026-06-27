import { useEffect, useState } from "react";
import { FaUndo } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function BorrowList() {
  const [requests, setRequests] = useState([]);
  const [returningId, setReturningId] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("approved");
  const [adminRequestMessage, setAdminRequestMessage] = useState("");
  const API_PORT = import.meta.env.VITE_API_PORT;

  const statusOptions = ["approved", "pending", "returned", "declined", "onHold"];
  const statusLabels = {
    approved: "🟢 Approved",
    pending: "🟡 Pending",
    returned: "✅ Returned",
    declined: "❌ Declined",
    onHold: "⏸️ On Hold",
  };

  useEffect(() => {
    fetch(`${API_PORT}/api/v1/auth/my`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRequests(data?.data || []))
      .catch((err) => console.error("Failed to fetch borrow requests:", err));
  }, [API_PORT]);

  const openReturnForm = (request) => {
    setReturningId(request._id);
    setReturnItems(
      request.items.map((item) => ({
        product: item.product?._id || null,
        quantityRequested: item.quantityRequested,
        alreadyReturned: item.quantityReturned || 0,
        quantityReturned: 0,
        condition: "good",
        notes: "",
      }))
    );
  };

  const handleReturnSubmit = async () => {
    const nonZeroItems = returnItems.filter((item) => item.quantityReturned > 0);

    if (returnItems.length === 1 && nonZeroItems.length === 0) {
      alert("You must return at least one item.");
      return;
    }
    if (returnItems.length > 1 && nonZeroItems.length === 0) {
      alert("Please enter a valid quantity for at least one item.");
      return;
    }

    const filteredItems = nonZeroItems.map((item) => ({
      product: item.product,
      quantityReturned: item.quantityReturned,
      condition: item.condition,
      notes: item.notes,
    }));

    try {
      const res = await fetch(`${API_PORT}/api/v1/auth/${returningId}/return`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: filteredItems }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Return failed.");
        return;
      }

      setReturningId(null);
      setReturnItems([]);
      setAdminRequestMessage("✅ Return request submitted successfully!");
      setTimeout(() => setAdminRequestMessage(""), 4000);

      const updated = await fetch(`${API_PORT}/api/v1/auth/my`, {
        credentials: "include",
      });
      const data = await updated.json();
      setRequests(data?.data || []);
    } catch (err) {
      console.error("Return failed:", err);
      alert("Something went wrong while submitting your return.");
    }
  };

  const grouped = {
    approved: requests.filter((r) => r.status === "approved"),
    pending: requests.filter((r) => r.status === "pending"),
    returned: requests.filter((r) => r.status === "returned"),
    declined: requests.filter((r) => r.status === "declined"),
    onHold: requests.filter((r) => r.status === "on-hold"),
  };

  const sortedRequests =
    selectedStatus === "approved"
      ? [...grouped.approved].sort((a, b) => {
        const aCanReturn = a.returnStatus !== "complete";
        const bCanReturn = b.returnStatus !== "complete";
        return bCanReturn - aCanReturn;
      })
      : grouped[selectedStatus];

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8 sm:mb-10">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-sky-500 font-mono mb-2">
          User Account
        </span>
        <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-slate-900 dark:text-white font-display">
          Your{" "}
          <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
            borrowed items
          </span>
        </h2>
        <div className="h-0.5 w-12 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full mt-3.5" />
      </div>


      {/* Status tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.05] active:scale-95 shadow-sm ${selectedStatus === status
              ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/25"
              : "backdrop-blur-md bg-white/60 text-slate-700 border border-slate-200 hover:bg-sky-500/5 hover:border-sky-500/30 dark:bg-slate-900/40 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-sky-500/10 dark:hover:border-sky-500/30"
              }`}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Requests */}
      {sortedRequests.length > 0 ? (
        sortedRequests.map((req) => (
          <div
            key={req._id}
            className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-md p-5 sm:p-6 mb-6 hover:shadow-xl hover:scale-[1.01] hover:border-sky-500/20 dark:hover:border-sky-500/30 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 break-all">
                Request ID:{" "}
                <span className="text-sky-600 dark:text-sky-400">{req._id}</span>
              </p>

              <span
                className={`inline-flex items-center justify-center px-3 py-1 rounded-full shadow-sm text-[11px] sm:text-xs font-semibold ${req.status === "approved"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100"
                  : req.status === "returned"
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-100"
                    : req.status === "on hold"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100"
                      : req.status === "declined"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-800 dark:text-rose-100"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100"
                  }`}
              >
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </div>

            {/* Purpose + expiry */}
            <div className="mb-3 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {req.purpose && (
                <p>
                  <span className="font-semibold">Purpose:</span> {req.purpose}
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

            {/* Items */}
            <div className="space-y-4">
              {req.items.map((item, index) => {
                const remaining = item.quantityRequested - item.quantityReturned;
                return (
                  <div
                    key={item.product?._id || `${req._id}-${index}`}
                    className="relative border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 shadow-sm"
                  >
                    <div className="absolute top-0 right-0 w-5 h-5 bg-sky-500 dark:bg-sky-700 rounded-bl-xl" />

                    <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      <span className="font-medium">Requested at:</span>{" "}
                      {new Date(req.requestedAt).toLocaleString()}
                    </div>

                    <h3 className="relative text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                      <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                        {item.product?.name || "Unknown product"}
                      </span>
                    </h3>


                    <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <p>
                        <span className="font-semibold">Variant:</span>{" "}
                        {item.product?.variant || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Requested:</span>{" "}
                        {item.quantityRequested}
                      </p>
                      {item.quantityReturned > 0 && (
                        <p className="text-emerald-600 dark:text-emerald-400">
                          <span className="font-semibold">Returned:</span>{" "}
                          {item.quantityReturned}
                        </p>
                      )}
                      {item.pendingReturn > 0 && (
                        <p className="text-sky-600 dark:text-sky-400">
                          <span className="font-semibold">
                            Requested to return:
                          </span>{" "}
                          {item.pendingReturn}
                        </p>
                      )}
                      {remaining > 0 && req.status !== "declined" && (
                        <p className="text-amber-600 dark:text-amber-400">
                          <span className="font-semibold">Remaining:</span>{" "}
                          {remaining}
                        </p>
                      )}
                      {item.notes && (
                        <p className="mt-2 italic text-slate-600 dark:text-slate-400 border-l-2 border-sky-300 dark:border-sky-600 pl-2">
                          “{item.notes}”
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Return button */}
            {selectedStatus === "approved" && req.returnStatus !== "complete" && (
              <div className="mt-5 text-center">
                <button
                  onClick={() => openReturnForm(req)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:from-sky-600 hover:to-indigo-600 hover:shadow-lg transition"
                >
                  <FaUndo className="text-sm" />
                  Return items
                </button>
              </div>
            )}

            {/* Return form */}
            {returningId === req._id && (
              <div className="mt-7 border-t border-slate-200 dark:border-slate-700 pt-6">
                <div className="flex flex-col items-center mb-5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-sky-500 font-mono mb-1.5">
                    Action Required
                  </span>
                  <h4 className="relative text-lg sm:text-xl font-bold text-center text-slate-900 dark:text-white font-display">
                    Return Form
                  </h4>
                  <div className="h-0.5 w-8 bg-sky-500 rounded-full mt-2" />
                </div>


                <div className="space-y-4 sm:space-y-6">
                  {returnItems.map((item, index) => {
                    const original = req.items.find(
                      (i) => i.product._id === item.product
                    );
                    const alreadyReturned = original?.quantityReturned || 0;
                    const maxReturnable =
                      (original?.quantityRequested || 0) - alreadyReturned;

                    return (
                      <div
                        key={item.product || `${req._id}-return-${index}`}
                        className="flex flex-col md:flex-row gap-4 sm:gap-5 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 bg-slate-50 dark:bg-slate-900"
                      >
                        {/* Left */}
                        <div className="flex-1 space-y-3">
                          <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                            <span className="font-semibold">Requested:</span>{" "}
                            {original?.quantityRequested} •{" "}
                            <span className="text-emerald-600">
                              Returned:
                            </span>{" "}
                            {alreadyReturned} •{" "}
                            <span className="text-amber-600">
                              Remaining:
                            </span>{" "}
                            {maxReturnable}
                          </div>

                          <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                            Quantity to return (max {maxReturnable})
                            <input
                              type="number"
                              min="0"
                              max={maxReturnable}
                              value={item.quantityReturned}
                              onChange={(e) =>
                                setReturnItems((prev) =>
                                  prev.map((i, idx) =>
                                    idx === index
                                      ? {
                                        ...i,
                                        quantityReturned: Math.min(
                                          Number(e.target.value),
                                          maxReturnable
                                        ),
                                      }
                                      : i
                                  )
                                )
                              }
                              className="mt-1 w-full border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </label>

                          <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                            Notes
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) =>
                                setReturnItems((prev) =>
                                  prev.map((i, idx) =>
                                    idx === index
                                      ? { ...i, notes: e.target.value }
                                      : i
                                  )
                                )
                              }
                              className="mt-1 w-full border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </label>
                        </div>

                        {/* Right */}
                        <div className="w-full md:w-40 flex flex-col justify-between items-end gap-3">
                          <label className="block w-full text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                            Condition
                            <select
                              value={item.condition}
                              onChange={(e) =>
                                setReturnItems((prev) =>
                                  prev.map((i, idx) =>
                                    idx === index
                                      ? { ...i, condition: e.target.value }
                                      : i
                                  )
                                )
                              }
                              className="mt-1 w-full border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                              <option value="good">Good</option>
                              <option value="damaged">Damaged</option>
                              <option value="lost">Lost</option>
                            </select>
                          </label>

                          <span
                            className={`mt-1 px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-full shadow-sm text-center ${item.condition === "good"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100"
                              : item.condition === "damaged"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-800 dark:text-rose-100"
                              }`}
                          >
                            {item.condition.charAt(0).toUpperCase() +
                              item.condition.slice(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleReturnSubmit}
                    className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sky-400 transition"
                  >
                    ✅ Submit return request
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          No {statusLabels[selectedStatus]} requests found.
        </p>
      )}

      {/* Toast */}
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
