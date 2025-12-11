import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUndo } from "react-icons/fa";
export default function Inventory() {
  const API_PORT = import.meta.env.VITE_API_PORT;
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [borrowedRequests, setBorrowedRequests] = useState([]);
  const [returningId, setReturningId] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState();
  const [visibleSections, setVisibleSections] = useState({
    pending: false,
    approved: true,
    onHold: false,
    returned: false,
    history: false,
  });
  const [adminRequestMessage, setAdminRequestMessage] = useState("");
  const [purpose, setPurpose] = useState("");
  const [expiryEnabled, setExpiryEnabled] = useState(false);
  const [expiry, setExpiry] = useState(() => {
    const minExpiry = new Date();
    minExpiry.setMonth(minExpiry.getMonth() + 1);
    return minExpiry.toISOString().slice(0, 10);
  });

  useEffect(() => {
    fetch(`${API_PORT}/api/v1/auth/productList`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProducts(data?.data || data))
      .catch((err) => console.error("Failed to fetch products:", err));
    fetchBorrowedRequests();
  }, [API_PORT]);

  const fetchBorrowedRequests = () => {
    fetch(`${API_PORT}/api/v1/auth/my`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setBorrowedRequests(data?.data || []))
      .catch((err) => console.error("Failed to fetch borrow requests:", err));
  };

  const toggleSection = (key) => {
    setVisibleSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      updated[productId] ? delete updated[productId] : (updated[productId] = 1);
      return updated;
    });
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts((prev) => ({ ...prev, [productId]: quantity }));
  };

  const handleBorrow = async () => {
    const items = Object.entries(selectedProducts)
      .filter(([_, qty]) => qty > 0)
      .map(([product, quantityRequested]) => ({ product, quantityRequested }));

    if (!purpose.trim()) {
      alert("Please specify a purpose for borrowing.");
      return;
    }

    if (expiryEnabled) {
      const minExpiry = new Date();
      minExpiry.setMonth(minExpiry.getMonth() + 1);
      const selectedExpiry = new Date(expiry);
      if (selectedExpiry < minExpiry) {
        alert("The expiry date must be at least 1 month from today.");
        return;
      }
    }

    if (items.length === 0) return;

    try {
      const res = await fetch(`${API_PORT}/api/v1/auth/borrow`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          purpose,
          expiry: expiryEnabled ? expiry : null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Borrow request failed.");
        return;
      }
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Borrow request failed.");
        return;
      }

      setSelectedProducts({});
      setPurpose("");
      const minExpiry = new Date();
      minExpiry.setMonth(minExpiry.getMonth() + 1);
      setExpiry(minExpiry.toISOString().slice(0, 10));
      setExpiryEnabled(false);
      fetchBorrowedRequests();

      setAdminRequestMessage("✅ Borrow request submitted successfully!");
      setTimeout(() => setAdminRequestMessage(""), 4000);
    } catch (err) {
      console.error("Failed to submit borrow request:", err);
      alert("Something went wrong while submitting your borrow request.");
    }
  };

  const openReturnForm = (request) => {
    setReturningId(request._id);
    setReturnItems(
      request.items.map((item) => ({
        product: item.product._id,
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
    if (!nonZeroItems.length) {
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
      await fetch(`${API_PORT}/api/v1/auth/${returningId}/return`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: filteredItems }),
      });
      setReturningId(null);
      setReturnItems([]);
      fetchBorrowedRequests();

      setAdminRequestMessage("✅ Return request submitted successfully!");
      setTimeout(() => setAdminRequestMessage(""), 4000);
    } catch (err) {
      console.error("Failed to submit return request:", err);
      alert("Something went wrong while submitting your return.");
    }
  };

  const returnPending = borrowedRequests.filter((r) => r.returnStatus === "pending");
  const approved = borrowedRequests.filter(
    (r) => r.status === "approved" && r.returnStatus === "none"
  );
  const onHold = borrowedRequests.filter((r) => r.status === "on hold");
  const returned = borrowedRequests.filter(
    (r) => r.returnStatus !== "none" && r.returnStatus !== "pending"
  );
  const history = borrowedRequests.filter(
    (r) => r.status !== "approved" && r.status !== "on hold" && r.returnStatus === "none"
  );

  const sections = [
    { key: "pending", title: "⏳ Return Pending", data: returnPending },
    { key: "approved", title: "✅ Approved Borrowed Items", data: approved, showReturn: true },
    { key: "onHold", title: "⏸️ On Hold Requests", data: onHold },
    { key: "returned", title: "📦 Returned Items", data: returned, showNotes: true },
    { key: "history", title: "📜 Request History", data: history },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Soft background image tint */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&fit=crop&crop=center')] bg-cover bg-center bg-no-repeat opacity-5 dark:opacity-10 -z-10" />

      {/* Available products */}
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center text-slate-900 dark:text-indigo-300 tracking-tight">
        📦 Available Products
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleBorrow();
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10"
      >
        {products.map((product) => {
          const isSelected = product._id in selectedProducts;
          return (
            <div
              key={product._id}
              onClick={() => handleCheckboxChange(product._id)}
              className={`flex justify-between items-center p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-sm hover:shadow-lg ${
                isSelected
                  ? "ring-2 ring-sky-500 bg-sky-50 dark:bg-slate-900"
                  : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700"
              }`}
            >
              {/* Text */}
              <div className="flex flex-col items-start gap-1.5 text-left flex-1 pr-3">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-indigo-200">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Variant: <span className="font-medium">{product.variant || "N/A"}</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Available:{" "}
                  <span className="font-medium">{product.quantityAvailable}</span>
                </p>
                {isSelected && (
                  <input
                    type="number"
                    min="1"
                    max={product.quantityAvailable}
                    value={selectedProducts[product._id]}
                    onChange={(e) =>
                      handleQuantityChange(product._id, Number(e.target.value))
                    }
                    placeholder="Quantity to borrow"
                    className="mt-2 w-full border border-slate-300 rounded-lg bg-white px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    required
                  />
                )}
              </div>

              {/* Image + checkbox */}
              <div className="flex flex-col items-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEnlargedImage(
                      product.photoUrl ||
                        `https://ui-avatars.com/api/?name=${product.name?.charAt(
                          0
                        )}&background=0ea5e9&color=fff&size=256`
                    );
                  }}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-sky-400 shadow-md hover:shadow-lg hover:scale-105 transition"
                >
                  <img
                    src={
                      product.photoUrl ||
                      `https://ui-avatars.com/api/?name=${product.name?.charAt(
                        0
                      )}&background=0ea5e9&color=fff&size=128`
                    }
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCheckboxChange(product._id)}
                  className="w-4 h-4 accent-sky-600 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          );
        })}

        {/* Purpose + expiry card */}
        <div className="md:col-span-2 mt-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-700">
          <label className="block mb-4">
            <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
              Purpose
            </span>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mt-1 w-full border border-slate-300 px-3 py-2 rounded-lg bg-white text-sm focus:ring-2 focus:ring-sky-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="State your reason for borrowing"
              required
            />
          </label>

          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="expiry-toggle"
              checked={expiryEnabled}
              onChange={(e) => setExpiryEnabled(e.target.checked)}
              className="mr-2 w-4 h-4 accent-sky-600 cursor-pointer"
            />
            <label
              htmlFor="expiry-toggle"
              className="cursor-pointer text-xs sm:text-sm text-slate-700 dark:text-slate-300"
            >
              Add expiry date (optional)
            </label>
          </div>

          {expiryEnabled && (
            <label className="block mb-2">
              <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                Expiry date (minimum 1 month)
              </span>
              <input
                type="date"
                value={expiry}
                min={(() => {
                  const minDate = new Date();
                  minDate.setMonth(minDate.getMonth() + 1);
                  return minDate.toISOString().slice(0, 10);
                })()}
                onChange={(e) => setExpiry(e.target.value)}
                className="mt-1 w-full border border-slate-300 px-3 py-2 rounded-lg bg-white text-sm focus:ring-2 focus:ring-sky-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required={expiryEnabled}
              />
            </label>
          )}
        </div>

        <div className="md:col-span-2 text-center mt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sky-400 transition"
          >
            Submit borrow request
          </button>
        </div>
      </form>

      {/* Requests */}
      <h2 className="text-2xl sm:text-3xl font-semibold mt-10 mb-6 text-center text-slate-900 dark:text-indigo-300 tracking-tight">
        📋 My Requests
      </h2>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
        {sections.map(({ key, title }) => (
          <button
            key={key}
            onClick={() =>
              setVisibleSections(
                Object.fromEntries(sections.map(({ key: k }) => [k, k === key]))
              )
            }
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              visibleSections[key]
                ? "bg-sky-500 text-white shadow-md"
                : "bg-white text-sky-700 border border-slate-200 hover:bg-sky-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      {sections.map(({ key, data, showReturn, showNotes }) =>
        visibleSections[key] ? (
          <div key={key} className="mb-8">
            {data.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 text-center">
                No items in this section.
              </p>
            ) : (
              data.map((req) => (
                <div
                  key={req._id}
                  className="border border-slate-200 rounded-2xl p-4 sm:p-5 mb-5 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-700"
                >
                  {/* header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                    <p className="font-semibold text-xs sm:text-sm break-all">
                      Request ID: {req._id}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {/* Borrow status */}
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${
                          req.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100"
                            : req.status === "approved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100"
                            : req.status === "declined"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-800 dark:text-rose-100"
                            : req.status === "returned"
                            ? "bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-100"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100"
                        }`}
                      >
                        {req.status === "approved"
                          ? "Borrow approved"
                          : req.status === "returned"
                          ? "Returned"
                          : req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)}
                      </span>

                      {/* Return status */}
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

                  {/* items */}
                  <ul className="list-disc list-inside text-xs sm:text-sm mb-2">
                    {req.items.map((item) => {
                      const remaining =
                        item.quantityRequested - item.quantityReturned;
                      return (
                        <li key={item.product?._id || item._id} className="mb-1">
                          <span className="font-semibold text-slate-900 dark:text-indigo-200">
                            {item.product?.name || "Unknown product"}
                          </span>{" "}
                          — requested: {item.quantityRequested}
                          {item.quantityReturned > 0 && (
                            <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                              • returned: {item.quantityReturned}
                            </span>
                          )}
                          {remaining > 0 && (
                            <span className="ml-2 text-amber-600 dark:text-amber-400">
                              • remaining: {remaining}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  <p className="text-[11px] sm:text-xs mt-1 text-slate-500 dark:text-slate-400">
                    <strong>Purpose:</strong> {req.purpose || "N/A"} •{" "}
                    <strong>Expiry:</strong>{" "}
                    {req.expiry
                      ? new Date(req.expiry).toLocaleDateString()
                      : "N/A"}
                  </p>

                  {showNotes && req.returnNotes && (
                    <p className="text-xs italic text-slate-600 dark:text-slate-400 mt-1">
                      Notes: {req.returnNotes}
                    </p>
                  )}

                  {showReturn && (
                    <div className="mt-3">
                      <div className="flex justify-end mb-3">
                        <button
                                         onClick={() => openReturnForm(req)}
                                         className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:from-sky-600 hover:to-indigo-600 hover:shadow-lg transition"
                                       >
                                         <FaUndo className="text-sm" />
                                         Return items
                                       </button>
                      </div>

                      {returningId === req._id && (
                        <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                          <h4 className="text-lg sm:text-xl font-semibold mb-3 text-slate-900 dark:text-indigo-200 text-center">
                            🔄 Return form
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
                            <strong>Original purpose:</strong>{" "}
                            {req.purpose || "N/A"} •{" "}
                            <strong>Expiry:</strong>{" "}
                            {req.expiry
                              ? new Date(req.expiry).toLocaleDateString()
                              : "N/A"}
                          </p>

                          <div className="space-y-4">
                            {returnItems.map((item, index) => {
                              const original = req.items.find(
                                (i) => i.product._id === item.product
                              );
                              const alreadyReturned =
                                original?.quantityReturned || 0;
                              const maxReturnable =
                                (original?.quantityRequested || 0) -
                                alreadyReturned;

                              return (
                                <div
                                  key={item.product}
                                  className="flex flex-col md:flex-row gap-4 border border-slate-200 rounded-2xl p-4 bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                                >
                                  <div className="flex-1 space-y-3">
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

                                  <div className="w-full md:w-40 flex flex-col justify-between items-end gap-3">
                                    <label className="block w-full text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                                      Condition
                                      <select
                                        value={item.condition}
                                        onChange={(e) =>
                                          setReturnItems((prev) =>
                                            prev.map((i, idx) =>
                                              idx === index
                                                ? {
                                                    ...i,
                                                    condition: e.target.value,
                                                  }
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
                                      className={`mt-1 px-3 py-1 text-[11px] font-semibold rounded-full text-center ${
                                        item.condition === "good"
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
                  )}
                </div>
              ))
            )}
          </div>
        ) : null
      )}

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

      {/* image modal */}
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            key="image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setEnlargedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-sky-400 bg-black/20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={enlargedImage}
                alt="Enlarged product"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
