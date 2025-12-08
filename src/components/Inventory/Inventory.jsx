import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Inventory() {
  const API_PORT= import.meta.env.VITE_API_PORT;
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
  }, []);

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
      .map(([product, qty]) => ({ product, quantityRequested: qty }));

    if (!purpose.trim()) {
      alert("Please specify a purpose for borrowing.");
      return;
    }

    if (expiryEnabled) {
      const today = new Date();
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
// const text = await res.text(); // get raw response
// console.log(text);             // inspect what came back
// try {
//   data = JSON.parse(text);
// } catch (err) {
//   console.error("Response was not JSON:", text);
//   return;
// }

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
      // reset expiry to 1 month from today
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
      request.items.map((item) => {
        const remaining = item.quantityRequested - item.quantityReturned;
        return {
          product: item.product._id,
          quantityRequested: item.quantityRequested,
          alreadyReturned: item.quantityReturned || 0,
          quantityReturned: 0,
          condition: "good",
          notes: "",
        };
      })
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

  const StatusBadge = ({ status }) => {
    const normalized = status?.toLowerCase();
    const labelMap = {
      approved: "Borrow Approved",
      returned: "Return Approved",
      pending: "Pending",
      "on hold": "On Hold",
    };
    const colorMap = {
      approved: "bg-green-600",
      returned: "bg-blue-600",
      pending: "bg-yellow-500",
      "on hold": "bg-orange-500",
    };
    const label = labelMap[normalized] || status;
    const color = colorMap[normalized] || "bg-gray-500";
    return (
      <span className={`text-white text-xs px-3 py-1 rounded-full font-semibold ${color}`}>
        {label}
      </span>
    );
  };

  const returnPending = borrowedRequests.filter((r) => r.returnStatus === "pending");
  const approved = borrowedRequests.filter((r) => r.status === "approved" && r.returnStatus === "none");
  const onHold = borrowedRequests.filter((r) => r.status === "on hold");
  const returned = borrowedRequests.filter((r) => r.returnStatus !== "none" && r.returnStatus !== "pending");
  const history = borrowedRequests.filter((r) =>
    r.status !== "approved" && r.status !== "on hold" && r.returnStatus === "none"
  );

  const sections = [
    { key: "pending", title: "⏳ Return Pending", data: returnPending, statusKey: "returnStatus" },
    { key: "approved", title: "✅ Approved Borrowed Items", data: approved, statusKey: "status", showReturn: true },
    { key: "onHold", title: "⏸️ On Hold Requests", data: onHold, statusKey: "status" },
    { key: "returned", title: "📦 Returned Items", data: returned, statusKey: "returnStatus", showNotes: true },
    { key: "history", title: "📜 Request History", data: history, statusKey: "status" },
  ];
return (
  <div className="relative min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 p-6 transition-colors duration-300">
   
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=center')] bg-cover bg-center bg-no-repeat opacity-5 dark:opacity-10 -z-10"></div>
    <h2 className="text-3xl font-bold mb-10 text-center text-indigo-600 dark:text-indigo-400 tracking-tight border-b pb-2 border-indigo-200 dark:border-indigo-700">
      📦 Available Products
    </h2>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleBorrow();
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
    >
      {products.map((product) => {
        const isSelected = product._id in selectedProducts;
        return (
          <div
            key={product._id}
            onClick={() => handleCheckboxChange(product._id)}
            className={`flex justify-between items-center p-5 rounded-xl cursor-pointer transition-all duration-300 border shadow-md hover:shadow-xl transform hover:-translate-y-1 ${
              isSelected
                ? "ring-2 ring-indigo-500 bg-indigo-50 dark:bg-gray-800 scale-105"
                : "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            }`}
          >
            {/* Text on the left */}
            <div className="flex flex-col items-start gap-2 text-left flex-1 pr-4">
              <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Variant:{" "}
                <span className="font-medium">{product.variant || "N/A"}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available:{" "}
                <span className="font-medium">{product.quantityAvailable}</span>
              </p>
              {isSelected && (
                <input
                  type="number"
                  min="1"
                  max={product.quantityAvailable}
                  value={selectedProducts[product._id]}
                  onChange={(e) => handleQuantityChange(product._id, Number(e.target.value))}
                  placeholder="Quantity to borrow"
                  className="w-full mt-2 border px-3 py-2 rounded bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              )}
            </div>

            {/* Image and checkbox on the right */}
            <div className="flex flex-col items-end gap-3">
              {/* Clickable product image - click to enlarge */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEnlargedImage(
                    product.photoUrl ||
                    `https://ui-avatars.com/api/?name=${product.name?.charAt(0)}&background=4c51bf&color=fff&size=512`
                  );
                }}
                className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <img
                  src={
                    product.photoUrl ||
                    `https://ui-avatars.com/api/?name=${product.name?.charAt(0)}&background=4c51bf&color=fff&size=128`
                  }
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </button>

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleCheckboxChange(product._id)}
                className="w-5 h-5 accent-indigo-600 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        );
      })}
      <div className="md:col-span-2 mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-6">
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Purpose:</span>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="State your reason for borrowing"
            required
          />
        </label>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="expiry-toggle"
            checked={expiryEnabled}
            onChange={(e) => setExpiryEnabled(e.target.checked)}
            className="mr-2 w-4 h-4 accent-indigo-600 cursor-pointer"
          />
          <label
            htmlFor="expiry-toggle"
            className="cursor-pointer text-gray-700 dark:text-gray-300 text-sm"
          >
            Add Expiry Date (optional)
          </label>
        </div>
        {expiryEnabled && (
          <label className="block mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date (minimum 1 month):</span>
            <input
              type="date"
              value={expiry}
              min={(() => {
                const minDate = new Date();
                minDate.setMonth(minDate.getMonth() + 1);
                return minDate.toISOString().slice(0, 10);
              })()}
              onChange={(e) => setExpiry(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              required={expiryEnabled}
            />
          </label>
        )}
      </div>
      <div className="md:col-span-2 text-center">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Submit Borrow Request
        </button>
      </div>
    </form>
    <h2 className="text-3xl font-bold mt-20 mb-8 text-center text-indigo-600 dark:text-indigo-400 tracking-tight border-b pb-2 border-indigo-200 dark:border-gray-700">
      📋 My Requests
    </h2>
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {sections.map(({ key, title }) => (
        <button
          key={key}
          onClick={() =>
            setVisibleSections(Object.fromEntries(sections.map(({ key: k }) => [k, k === key])))
          }
          className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
            visibleSections[key]
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 text-indigo-600 dark:text-white border hover:bg-indigo-100 dark:hover:bg-gray-700"
          }`}
        >
          {title}
        </button>
      ))}
    </div>
    {sections.map(({ key, data, statusKey, showReturn, showNotes }) =>
      visibleSections[key] ? (
        <div key={key}>
          {data.length === 0 ? (
            <p className="text-sm text-gray-500 mb-6 text-center">No items in this section.</p>
          ) : (
            data.map((req) => (
              <div key={req._id} className="border rounded-xl p-5 mb-6 bg-white dark:bg-gray-900 shadow">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">Request ID: {req._id}</p>
                  <StatusBadge status={key === "returned" ? "Return Approved" : req[statusKey]} />
                </div>
                <ul className="list-disc list-inside text-sm mb-2">
                  {req.items.map((item) => {
                    const remaining = item.quantityRequested - item.quantityReturned;
                    return (
                     <li key={item.product?._id || item._id} className="mb-1">
  <span className="font-semibold text-indigo-700 dark:text-indigo-300">
    {item.product?.name || "Unknown Product"}
  </span>
  — Requested: {item.quantityRequested}
  {item.quantityReturned > 0 && (
    <span className="ml-2 text-green-600 dark:text-green-400">
      • Returned: {item.quantityReturned}
    </span>
  )}
  {remaining > 0 && (
    <span className="ml-2 text-yellow-600 dark:text-yellow-400">
      • Remaining: {remaining}
    </span>
  )}
</li>
                    );
                  })}
                </ul>
                <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                  <strong>Purpose: </strong>{req.purpose || "N/A"}&nbsp;|&nbsp;
                  <strong>Expiry: </strong>{req.expiry ? new Date(req.expiry).toLocaleDateString() : "N/A"}
                </p>
                {showNotes && req.returnNotes && (
                  <p className="text-sm italic text-gray-600 dark:text-gray-400">Notes: {req.returnNotes}</p>
                )}
                {showReturn && (
                  <div className="mt-4">
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() => openReturnForm(req)}
                        className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-full shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 ease-in-out"
                      >
                        🔄 Return Items
                      </button>
                    </div>
                    {returningId === req._id && (
                      <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-6">
                        <h4 className="text-2xl font-semibold mb-6 text-center text-indigo-700 dark:text-indigo-300">
                          🔄 Return Form
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                          <strong>Original Purpose:</strong> {req.purpose || "N/A"} <br />
                          <strong>Expiry:</strong> {req.expiry ? new Date(req.expiry).toLocaleDateString() : "N/A"}
                        </p>
                        <div className="space-y-8">
                          {returnItems.map((item, index) => {
                            const original = req.items.find((i) => i.product._id === item.product);
                            const alreadyReturned = original?.quantityReturned || 0;
                            const maxReturnable = original?.quantityRequested - alreadyReturned;
                            return (
                              <div
                                key={item.product}
                                className="flex flex-col md:flex-row justify-between gap-6 border border-gray-300 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-md"
                              >
                                <div className="flex-1 space-y-4">
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
                                      className="mt-1 w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                      className="mt-1 w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                  </label>
                                </div>
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
                                      className="mt-1 w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                      <option value="good">Good</option>
                                      <option value="damaged">Damaged</option>
                                      <option value="lost">Lost</option>
                                    </select>
                                  </label>
                                  <span
                                    className={`mt-4 px-3 py-1 text-xs font-semibold rounded-full shadow-sm text-center ${
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
                          <div className="mt-10 text-center">
                            <button
                              onClick={handleReturnSubmit}
                              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition-all duration-300"
                            >
                              ✅ Submit Return Request
                            </button>
                          </div>
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

    {/* Image Lightbox / Enlarge Modal */}
    <AnimatePresence>
      {enlargedImage && (
        <motion.div
          key="image-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setEnlargedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-96 h-96 rounded-full overflow-hidden shadow-2xl border-8 border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-black/20"
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