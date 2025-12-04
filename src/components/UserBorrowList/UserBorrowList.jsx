import { useEffect, useState } from "react";
import { FaUndo, FaClipboardCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function BorrowList() {
  const [requests, setRequests] = useState([]);
  const [returningId, setReturningId] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("approved");
  const [adminRequestMessage, setAdminRequestMessage] = useState("");
 const API_PORT= import.meta.env.VITE_API_PORT;
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
  }, []);

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

  // ❌ Block if single item and quantityReturned is 0
  if (returnItems.length === 1 && nonZeroItems.length === 0) {
    alert("You must return at least one item.");
    return;
  }

  // ❌ Block if multiple items but all quantities are 0
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

    const updated = await fetch(`${API_PORT}/api/v1/auth/my`, { credentials: "include" });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-indigo-600 dark:text-indigo-400">
        📦 My Borrowed Items
      </h2>

      {/* Status Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
              selectedStatus === status
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-indigo-600 dark:text-white border hover:bg-indigo-100 dark:hover:bg-gray-700"
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
            className="border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl p-4 sm:p-6 mb-8 bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-6">
              <p className="text-base sm:text-lg font-semibold dark:text-white flex items-center gap-2">
                Request ID: <span className="text-indigo-700 dark:text-indigo-400">{req._id}</span>
              </p>
             <span
  className={`inline-block px-3 py-1 rounded-full shadow-sm text-center whitespace-nowrap font-semibold text-xs sm:text-sm ${
    req.status === "approved"
      ? "bg-green-600 text-white"
      : req.status === "returned"
      ? "bg-blue-600 text-white"
      : req.status === "on hold"
      ? "bg-yellow-500 text-white"
      : req.status === "declined"
      ? "bg-red-600 text-white"
      : "bg-gray-500 text-white"
  }`}
>
  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
</span>
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
            <div className="space-y-4 sm:space-y-6">
              {req.items.map((item, index) => {
                const remaining = item.quantityRequested - item.quantityReturned;
                return (
                  <div
                    key={item.product?._id || `${req._id}-${index}`}
                    className="relative border border-gray-300 dark:border-gray-700 rounded-xl p-4 sm:p-6 bg-white dark:bg-gray-900 shadow-md"
                  >
                    <div className="absolute top-0 right-0 w-6 h-6 bg-indigo-500 dark:bg-indigo-700 rounded-bl-xl"></div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-medium">Requested At:</span>{" "}
                      {new Date(req.requestedAt).toLocaleString()}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                      {item.product?.name || "Unknown Product"}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <p>
                        <span className="font-semibold">Variant:</span>{" "}
                        {item.product?.variant || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Requested:</span>{" "}
                        {item.quantityRequested}
                      </p>
                      {item.quantityReturned > 0 && (
                        <p className="text-green-600 dark:text-green-400">
                          <span className="font-semibold">Returned:</span>{" "}
                          {item.quantityReturned}
                        </p>
                      )}
                      {item.pendingReturn > 0 && (
                        <p className="text-blue-600 dark:text-blue-400">
                          <span className="font-semibold">Requested to Return:</span>{" "}
                          {item.pendingReturn}
                        </p>
                      )}
                     {remaining > 0 && req.status !== "declined" && (
  <p className="text-yellow-600 dark:text-yellow-400">
    <span className="font-semibold">Remaining:</span> {remaining}
  </p>
)}
                      {item.notes && (
                        <p className="mt-3 italic text-gray-600 dark:text-gray-400 border-l-4 border-indigo-300 dark:border-indigo-600 pl-3">
                          “{item.notes}”
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Return Button */}
            {selectedStatus === "approved" && req.returnStatus !== "complete" && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => openReturnForm(req)}
                  className="w-full sm:w-auto px-5 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-full shadow hover:shadow-lg flex items-center gap-2 justify-center"
                >
                  <FaUndo /> Return Items
                </button>
              </div>
            )}

            {/* Return Form */}
{returningId === req._id && (
  <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-8">
    <h4 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-indigo-700 dark:text-indigo-300">
      🔄 Return Form
    </h4>

    <div className="space-y-6 sm:space-y-8">
      {returnItems.map((item, index) => {
        const original = req.items.find((i) => i.product._id === item.product);
        const alreadyReturned = original?.quantityReturned || 0;
        const maxReturnable = original?.quantityRequested - alreadyReturned;

        return (
          <div
            key={item.product || `${req._id}-return-${index}`}
            className="flex flex-col md:flex-row gap-4 sm:gap-6 border border-gray-300 dark:border-gray-700 rounded-xl p-4 sm:p-6 bg-gray-50 dark:bg-gray-900"
          >
            {/* Left Section */}
            <div className="flex-1 space-y-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Requested:</span> {original?.quantityRequested} •{" "}
                <span className="text-green-600">Returned:</span> {alreadyReturned} •{" "}
                <span className="text-yellow-600">Remaining:</span> {maxReturnable}
              </div>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity to Return (max {maxReturnable}):
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
                  className="mt-1 w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes:
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) =>
                    setReturnItems((prev) =>
                      prev.map((i, idx) =>
                        idx === index ? { ...i, notes: e.target.value } : i
                      )
                    )
                  }
                  className="mt-1 w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-48 flex flex-col justify-between items-end">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 w-full">
                Condition:
                <select
                  value={item.condition}
                  onChange={(e) =>
                    setReturnItems((prev) =>
                      prev.map((i, idx) =>
                        idx === index ? { ...i, condition: e.target.value } : i
                      )
                    )
                  }
                  className="mt-1 w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="good">Good</option>
                  <option value="damaged">Damaged</option>
                  <option value="lost">Lost</option>
                </select>
              </label>

              <span
                className={`mt-4 px-3 py-1 text-xs sm:text-sm font-semibold rounded-full shadow-sm text-center ${
                  item.condition === "good"
                    ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                    : item.condition === "damaged"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                    : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                }`}
              >
                {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
              </span>
            </div>
          </div>
        );
      })}

      {/* Submit Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleReturnSubmit}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow hover:bg-green-700 transition-all duration-300"
        >
          ✅ Submit Return Request
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No {statusLabels[selectedStatus]} requests found.
        </p>
      )}
      <AnimatePresence>
  {adminRequestMessage && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-6 inset-x-0 flex justify-center z-[999]"
    >
      <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg text-sm sm:text-base text-center max-w-[90vw] w-fit">
        {adminRequestMessage}
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}