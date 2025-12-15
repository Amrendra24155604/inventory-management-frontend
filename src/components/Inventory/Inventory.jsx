import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUndo } from "react-icons/fa";

export default function Inventory() {
  const API_PORT = import.meta.env.VITE_API_PORT;

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [borrowedRequests, setBorrowedRequests] = useState([]);

  const [returningId, setReturningId] = useState(null);
  const [returnItems, setReturnItems] = useState([]);

  const [enlargedImage, setEnlargedImage] = useState(null);

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

  // map of productId -> input element, so we can focus when selected
  const quantityRefs = useRef({});

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

  const handleCheckboxToggle = (productId) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      const wasSelected = productId in updated;

      if (wasSelected) {
        delete updated[productId];
      } else {
        updated[productId] = 1;
      }

      // focus the quantity input after state update if newly selected
      if (!wasSelected) {
        setTimeout(() => {
          const input = quantityRefs.current[productId];
          if (input) input.focus();
        }, 0);
      }

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

  const returnPending = borrowedRequests.filter(
    (r) => r.returnStatus === "pending"
  );
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
      {/* background */}
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
              onClick={() => handleCheckboxToggle(product._id)}
              className={`flex justify-between items-center p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-sm hover:shadow-lg ${
                isSelected
                  ? "ring-2 ring-sky-500 bg-sky-50 dark:bg-slate-900"
                  : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700"
              }`}
            >
              {/* info */}
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
                    ref={(el) => (quantityRefs.current[product._id] = el)}
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

              {/* image + checkbox */}
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
                  onChange={() => handleCheckboxToggle(product._id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 accent-sky-600 cursor-pointer"
                />
              </div>
            </div>
          );
        })}

        {/* purpose + expiry */}
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

      {/* My Requests, sections, return form, toast, and image modal remain the same as in your original component.
         Paste your existing sections/return UI code here unchanged, since the checkbox/quantity changes
         only affect the product cards above. */}
    </div>
  );
}
