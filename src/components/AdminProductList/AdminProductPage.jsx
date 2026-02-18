import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminProductPage({ menuOpen = false }) {
  const API_PORT = import.meta.env.VITE_API_PORT;
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    variant: "",
    initialQuantity: 0,
    quantityAvailable: 0,
    photoUrl: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingOriginal, setEditingOriginal] = useState(null);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetProduct, setDeleteTargetProduct] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const [restoreInitial, setRestoreInitial] = useState(false);
  const [restoreAvailable, setRestoreAvailable] = useState(false);
  const [loadingActions, setLoadingActions] = useState({});

  const token = localStorage.getItem("token");

  // ActionButton Component (AdminBorrowApproval Style)
  const ActionButton = ({ label, color, loading, onClick }) => (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileTap={{ scale: 0.97 }}
      className={`w-full sm:w-auto px-4 py-2 rounded-full shadow text-xs sm:text-sm font-semibold text-white flex items-center justify-center transition-all ${
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

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_PORT}/api/v1/auth/productList`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.data || data);
    } catch (err) {
      console.error(err);
      setError("Unable to load products. Please check your access.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!editingOriginal) return;

    setForm((prev) => ({
      ...prev,
      initialQuantity: restoreInitial
        ? editingOriginal.initialQuantity
        : prev.initialQuantity,
      quantityAvailable: restoreAvailable
        ? editingOriginal.quantityAvailable ?? editingOriginal.initialQuantity ?? 0
        : prev.quantityAvailable,
    }));
  }, [restoreInitial, restoreAvailable, editingOriginal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.initialQuantity < 0 || form.quantityAvailable < 0) {
      setError("Quantities cannot be negative.");
      return;
    }
    if (form.quantityAvailable > form.initialQuantity) {
      setError("Available quantity cannot exceed total quantity.");
      return;
    }

    const actionKey = editingId ? `edit-${editingId}` : "create";
    setLoadingActions(prev => ({ ...prev, [actionKey]: true }));

    let photoUrl = form.photoUrl;

    if (photoFile) {
      const uploadData = new FormData();
      uploadData.append("photos", photoFile);

      try {
        const uploadRes = await fetch(`${API_PORT}/api/v1/upload`, {
          method: "POST",
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();

        if (uploadRes.ok && uploadJson.photos?.length > 0) {
          photoUrl = uploadJson.photos[0];
        }
      } catch (err) {
        console.error("Upload failed:", err);
        setError("Image upload failed");
        setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
        return;
      }
    }

    const url = editingId
      ? `${API_PORT}/api/v1/auth/products/${editingId}`
      : `${API_PORT}/api/v1/auth/createProduct`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ ...form, photoUrl }),
      });

      if (!res.ok) throw new Error("Failed to submit product");

      resetFormState();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please check your input and access.");
    } finally {
      setLoadingActions(prev => {
        const next = { ...prev };
        delete next[actionKey];
        return next;
      });
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      variant: product.variant || "",
      initialQuantity: product.initialQuantity ?? 0,
      quantityAvailable: product.quantityAvailable ?? product.initialQuantity ?? 0,
      photoUrl: product.photoUrl || "",
    });
    setEditingId(product._id);
    setEditingOriginal(product);
    setPhotoFile(null);
    setRestoreInitial(false);
    setRestoreAvailable(false);
  };

  const confirmDelete = (productId, product) => {
    setDeleteTargetId(productId);
    setDeleteTargetProduct(product);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    setLoadingActions(prev => ({ ...prev, [`delete-${deleteTargetId}`]: true }));

    try {
      const res = await fetch(
        `${API_PORT}/api/v1/auth/products/${deleteTargetId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to delete product");

      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
      setDeleteTargetProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoadingActions(prev => {
        const next = { ...prev };
        delete next[`delete-${deleteTargetId}`];
        return next;
      });
    }
  };

  const resetFormState = () => {
    setForm({
      name: "",
      variant: "",
      initialQuantity: 0,
      quantityAvailable: 0,
      photoUrl: "",
    });
    setPhotoFile(null);
    setEditingId(null);
    setEditingOriginal(null);
    setRestoreInitial(false);
    setRestoreAvailable(false);
  };

  const cancelEdit = () => {
    resetFormState();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-16 -left-24 h-44 w-44 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/30" />
        <div className="absolute -bottom-20 -right-28 h-48 w-48 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/30" />
      </div>

      <div className={`relative z-10 transition-all duration-300 ${menuOpen ? "blur-sm scale-[0.98]" : ""}`}>
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-slate-900 dark:text-slate-50 mb-8 sm:mb-10">
          🛠️ Admin{" "}
          <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            Product Management
          </span>
        </h1>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-2xl text-sm text-rose-800 dark:text-rose-200 font-medium text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List */}
       <div className="mb-10"> 
  <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center text-slate-900 dark:text-slate-50">
    📦{" "}
    <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
      All Products
    </span>
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
    {products.map((product) => (
      <motion.div
        key={product._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 bg-white/95 dark:bg-slate-900/95 shadow-sm hover:shadow-md transition-all ${
          editingId === product._id ? "ring-2 ring-sky-500 ring-offset-2" : ""
        }`}
      >
        {/* MOBILE ONLY: Perfect left text + right photo */}
        <div className="block md:hidden flex items-start gap-3 mb-3 p-2">
          {/* Mobile: LEFT TEXT */}
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1 leading-tight line-clamp-2">
              {product.name}
            </h3>
            {product.variant && (
              <p className="text-xs font-medium text-sky-600 dark:text-sky-400 mb-1">
                ({product.variant})
              </p>
            )}
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
              <div>Total: <span className="font-semibold text-slate-900 dark:text-slate-50">{product.initialQuantity}</span></div>
              <div>Available: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{product.quantityAvailable ?? product.initialQuantity}</span></div>
            </div>
          </div>
          
          {/* Mobile: RIGHT PHOTO CIRCLE */}
          <div className="flex-shrink-0 w-14 h-14">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEnlargedImage(product.photoUrl || `https://ui-avatars.com/api/?name=${product.name?.charAt(0)}&background=0ea5e9&color=fff&size=512`)}
              className="w-full h-full rounded-full overflow-hidden border-2 border-sky-400 shadow-md hover:shadow-lg transition-all"
            >
              <img
                src={product.photoUrl || `https://ui-avatars.com/api/?name=${product.name?.charAt(0)}&background=0ea5e9&color=fff&size=128`}
                alt={product.name}
                className="w-full h-full object-cover object-center rounded-full"
              />
            </motion.button>
          </div>
        </div>

        {/* DESKTOP ONLY: ORIGINAL LAYOUT (md:hidden → hidden md:block) */}
        <div className="hidden md:flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base lg:text-lg font-semibold text-slate-900 dark:text-slate-50 truncate">
              {product.name}
            </h3>
            {product.variant && (
              <p className="text-[11px] lg:text-xs text-sky-600 dark:text-sky-400 font-medium mt-1">
                ({product.variant})
              </p>
            )}
            <div className="mt-2 text-[11px] lg:text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
              <div>Total: <span className="font-semibold">{product.initialQuantity}</span></div>
              <div>Available: <span className="font-semibold">{product.quantityAvailable ?? product.initialQuantity}</span></div>
            </div>
          </div>

          {/* Desktop: Image + Actions */}
          <div className="flex flex-col items-end gap-3 lg:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEnlargedImage(product.photoUrl || `https://ui-avatars.com/api/?name=${product.name?.charAt(0)}&background=0ea5e9&color=fff&size=512`)}
              className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={product.photoUrl || `https://ui-avatars.com/api/?name=${product.name?.charAt(0)}&background=0ea5e9&color=fff&size=128`}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </motion.button>

            <div className="flex gap-2 w-full justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(product)}
                className="inline-flex items-center justify-center rounded-full border border-sky-200 dark:border-sky-500/60 bg-sky-50/70 dark:bg-sky-900/40 px-3 py-1.5 text-xs lg:text-sm text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-800 transition shadow-sm hover:shadow-md"
              >
                <FaEdit className="w-3.5 h-3.5" />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => confirmDelete(product._id, product)}
                className="inline-flex items-center justify-center rounded-full border border-rose-200 dark:border-rose-500/60 bg-rose-50/80 dark:bg-rose-900/40 px-3 py-1.5 text-xs lg:text-sm text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-800 transition shadow-sm hover:shadow-md"
              >
                <FaTrashAlt className="w-3.5 h-3.5" />
                Delete
              </motion.button>
            </div>
          </div>
        </div>

        {/* MOBILE ONLY: Buttons below photo */}
        <div className="block md:hidden flex flex-col gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(product)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 dark:border-sky-500/60 bg-sky-50/70 dark:bg-sky-900/40 px-4 py-2.5 text-sm font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-800 transition-all shadow-sm hover:shadow-md h-11"
          >
            <FaEdit className="w-4 h-4" />
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => confirmDelete(product._id, product)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-500/60 bg-rose-50/80 dark:bg-rose-900/40 px-4 py-2.5 text-sm font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-800 transition-all shadow-sm hover:shadow-md h-11"
          >
            <FaTrashAlt className="w-4 h-4" />
            Delete
          </motion.button>
        </div>
      </motion.div>
    ))}
  </div>

  {products.length === 0 && (
    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
      <div className="w-24 h-24 mx-auto mb-4 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
        📦
      </div>
      <p className="text-lg">No products found</p>
    </div>
  )}
</div>


        {/* Form Section */}
       <div className="w-full max-w-4xl mx-auto"> 
  <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center text-slate-900 dark:text-slate-50">
    {editingId ? "✏️" : "➕"}{" "}
    <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
      {editingId ? "Edit Product" : "Create New Product"}
    </span>
  </h2>

  <motion.form
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onSubmit={handleSubmit}
    className="w-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl space-y-6"
  >
    {/* Form fields - SAME AS BEFORE */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      {/* LEFT: Form Fields - UNCHANGED */}
      <div className="space-y-4 lg:space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all shadow-sm h-12"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Variant (Optional)
          </label>
          <input
            type="text"
            placeholder="Size, color, model, etc."
            value={form.variant}
            onChange={(e) => setForm((prev) => ({ ...prev, variant: e.target.value }))}
            className="w-full px-4 py-3 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all shadow-sm h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between flex-wrap gap-2">
            Total Quantity *
            {editingOriginal && (
              <label className="flex items-center gap-1 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={restoreInitial}
                  onChange={(e) => setRestoreInitial(e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded"
                />
                <span className="text-slate-500 dark:text-slate-400">Restore ({editingOriginal.initialQuantity})</span>
              </label>
            )}
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={form.initialQuantity}
            onChange={(e) => setForm((prev) => ({
              ...prev,
              initialQuantity: Math.max(0, Number(e.target.value))
            }))}
            className="w-full px-4 py-3 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all shadow-sm h-12"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between flex-wrap gap-2">
            Available Quantity *
            {editingOriginal && (
              <label className="flex items-center gap-1 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={restoreAvailable}
                  onChange={(e) => setRestoreAvailable(e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded"
                />
                <span className="text-slate-500 dark:text-slate-400">
                  Restore ({editingOriginal.quantityAvailable ?? editingOriginal.initialQuantity})
                </span>
              </label>
            )}
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={form.quantityAvailable}
            onChange={(e) => setForm((prev) => ({
              ...prev,
              quantityAvailable: Math.max(0, Number(e.target.value))
            }))}
            className="w-full px-4 py-3 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all shadow-sm h-12"
            required
          />
        </div>
      </div>

      {/* RIGHT: Image Upload - UNCHANGED */}
      <div className="space-y-4 lg:space-y-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Product Image
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setPhotoFile(file);
              if (file) {
                setForm((prev) => ({ ...prev, photoUrl: "" }));
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-2xl"
          />
          <div className="w-full h-40 sm:h-48 lg:h-52 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 flex flex-col items-center justify-center hover:border-sky-400 hover:bg-sky-50/30 dark:hover:bg-sky-900/30 transition-all cursor-pointer p-6 shadow-sm hover:shadow-md">
            {photoFile ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden mx-auto shadow-lg ring-2 ring-sky-500/30">
                <img src={URL.createObjectURL(photoFile)} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : form.photoUrl ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden mx-auto shadow-lg ring-2 ring-sky-500/30">
                <img src={form.photoUrl} alt="Current" className="w-full h-full object-cover" />
              </div>
            ) : (
              <>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-sky-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center mb-1">Click to upload product image</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG up to 5MB</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* SMALL ROUNDED CENTERED BUTTONS */}
   {/* Replace ONLY the buttons section with this: */}

<div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6">
  <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
    {editingId && (
      <button
        type="button"
        onClick={cancelEdit}
        className="px-8 py-3 rounded-3xl bg-slate-500 hover:bg-slate-600 text-white font-semibold text-sm shadow-xl hover:shadow-2xl transition-all border border-slate-400/30 whitespace-nowrap flex-1 sm:flex-none min-w-[120px] h-12"
      >
        ❌ Cancel
      </button>
    )}
    <button
      type="submit"
      disabled={loadingActions[editingId ? `edit-${editingId}` : "create"]}
      className="px-8 py-3 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-semibold text-sm shadow-2xl hover:shadow-3xl transition-all border border-sky-400/30 whitespace-nowrap flex-1 sm:flex-none min-w-[140px] h-12 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loadingActions[editingId ? `edit-${editingId}` : "create"] 
        ? "Loading..." 
        : editingId ? "✅ Update Product" : "➕ Create Product"
      }
    </button>
  </div>
</div>

  </motion.form>
</div>


      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal />

      {/* Image Lightbox Modal */}
      <ImageLightbox />
    </div>
  );

  // Delete Confirmation Modal Component
  function DeleteConfirmModal() {
    return (
      <AnimatePresence>
        {showDeleteConfirm && deleteTargetProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setShowDeleteConfirm(false);
              setDeleteTargetId(null);
              setDeleteTargetProduct(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-50">
                    🗑️ Delete Product
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteTargetId(null);
                      setDeleteTargetProduct(null);
                    }}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <FaTimes className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-rose-100 dark:bg-rose-900/50 rounded-2xl flex items-center justify-center">
                    <FaTrashAlt className="w-10 h-10 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Delete "{deleteTargetProduct.name}"?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    This action <strong>cannot be undone</strong>. Product <span className="font-semibold">{deleteTargetProduct.variant || 'N/A'}</span> and all related data will be permanently removed.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 pt-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-3xl">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteTargetId(null);
                      setDeleteTargetProduct(null);
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-xs sm:text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Cancel
                  </motion.button>
                  
                  <ActionButton
                    label="🗑️ Delete Product"
                    color="bg-rose-600 hover:bg-rose-500"
                    loading={loadingActions[`delete-${deleteTargetId}`]}
                    onClick={handleDeleteConfirmed}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Image Lightbox Modal Component
  function ImageLightbox() {
    return (
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEnlargedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  📸 Product Image
                </h4>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEnlargedImage(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </motion.button>
              </div>

              {/* Image */}
              <div className="max-h-[60vh] overflow-auto flex justify-center p-4">
                <img
                  src={enlargedImage}
                  alt="Product"
                  className="w-full h-auto max-h-[50vh] object-contain rounded-2xl shadow-xl max-w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}



// import { useEffect, useState } from "react";
// import { FaEdit, FaTrashAlt } from "react-icons/fa";
// import { AnimatePresence, motion } from "framer-motion";


// export default function AdminProductPage({ menuOpen = false }) {
//   const API_PORT = import.meta.env.VITE_API_PORT;
//   const [products, setProducts] = useState([]);


//   const [form, setForm] = useState({
//     name: "",
//     variant: "",
//     initialQuantity: 0,      // total quantity ever added
//     quantityAvailable: 0,    // currently available
//     photoUrl: "",
//   });


//   const [photoFile, setPhotoFile] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editingOriginal, setEditingOriginal] = useState(null); // keep original product


//   const [error, setError] = useState("");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteTargetId, setDeleteTargetId] = useState(null);
//   const [enlargedImage, setEnlargedImage] = useState(null);


//   const [restoreInitial, setRestoreInitial] = useState(false);
//   const [restoreAvailable, setRestoreAvailable] = useState(false);


//   const token = localStorage.getItem("token");


//   const fetchProducts = async () => {
//     try {
//       const res = await fetch(`${API_PORT}/api/v1/auth/productList`, {
//         headers: { Authorization: `Bearer ${token}` },
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to fetch products");
//       const data = await res.json();
//       setProducts(data);
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load products. Please check your access.");
//     }
//   };


//   useEffect(() => {
//     fetchProducts();
//   }, []);


//   // when toggling restore checkboxes, update form from original
//   useEffect(() => {
//     if (!editingOriginal) return;


//     setForm((prev) => ({
//       ...prev,
//       initialQuantity: restoreInitial
//         ? editingOriginal.initialQuantity
//         : prev.initialQuantity,
//       quantityAvailable: restoreAvailable
//         ? editingOriginal.quantityAvailable
//         : prev.quantityAvailable,
//     }));
//   }, [restoreInitial, restoreAvailable, editingOriginal]);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");


//     if (form.initialQuantity < 0 || form.quantityAvailable < 0) {
//       setError("Quantities cannot be negative.");
//       return;
//     }
//     if (form.quantityAvailable > form.initialQuantity) {
//       setError("Available quantity cannot exceed total quantity.");
//       return;
//     }


//     let photoUrl = form.photoUrl;


//     if (photoFile) {
//       const uploadData = new FormData();
//       uploadData.append("photos", photoFile);


//       try {
//         const uploadRes = await fetch(`${API_PORT}/api/v1/upload`, {
//           method: "POST",
//           body: uploadData,
//         });
//         const uploadJson = await uploadRes.json();


//         if (uploadRes.ok && uploadJson.photos?.length > 0) {
//           photoUrl = uploadJson.photos[0];
//         }
//       } catch (err) {
//         console.error("Upload failed:", err);
//         setError("Image upload failed");
//         return;
//       }
//     }


//     const url = editingId
//       ? `${API_PORT}/api/v1/auth/products/${editingId}`
//       : `${API_PORT}/api/v1/auth/createProduct`;


//     const method = editingId ? "PUT" : "POST";


//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({ ...form, photoUrl }),
//       });


//       if (!res.ok) throw new Error("Failed to submit product");


//       resetFormState();
//       fetchProducts();
//     } catch (err) {
//       console.error(err);
//       setError("Submission failed. Please check your input and access.");
//     }
//   };


//   const handleEdit = (product) => {
//     setForm({
//       name: product.name,
//       variant: product.variant,
//       initialQuantity: product.initialQuantity ?? 0,
//       quantityAvailable: product.quantityAvailable ?? product.initialQuantity ?? 0,
//       photoUrl: product.photoUrl || "",
//     });
//     setEditingId(product._id);
//     setEditingOriginal(product);
//     setPhotoFile(null);
//     setRestoreInitial(false);
//     setRestoreAvailable(false);
//   };


//   const confirmDelete = (productId) => {
//     setDeleteTargetId(productId);
//     setShowDeleteConfirm(true);
//   };


//   const handleDeleteConfirmed = async () => {
//     try {
//       const res = await fetch(
//         `${API_PORT}/api/v1/auth/products/${deleteTargetId}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//           credentials: "include",
//         }
//       );


//       if (!res.ok) throw new Error("Failed to delete product");


//       setShowDeleteConfirm(false);
//       setDeleteTargetId(null);
//       fetchProducts();
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete product. Please try again.");
//     }
//   };


//   const resetFormState = () => {
//     setForm({
//       name: "",
//       variant: "",
//       initialQuantity: 0,
//       quantityAvailable: 0,
//       photoUrl: "",
//     });
//     setPhotoFile(null);
//     setEditingId(null);
//     setEditingOriginal(null);
//     setRestoreInitial(false);
//     setRestoreAvailable(false);
//   };


//   const cancelEdit = () => {
//     resetFormState();
//   };


//   return (
//     <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative overflow-hidden">
//       {/* soft blobs */}
//       <div className="pointer-events-none absolute -top-16 -left-24 h-44 w-44 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/30" />
//       <div className="pointer-events-none absolute -bottom-20 -right-28 h-48 w-48 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/30" />


//       <div
//         className={`relative z-10 transition duration-300 ${
//           menuOpen ? "blur-sm scale-[0.98]" : "blur-0 scale-100"
//         }`}
//       >
//         <section className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//           {/* page title */}
//           <h1 className="relative text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-slate-900 dark:text-slate-50 mb-8">
//             🛠 Admin{" "}
//             <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
//               product management
//             </span>
//           </h1>


//           <AnimatePresence>
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="mb-4 text-rose-600 dark:text-rose-400 text-sm text-center font-medium"
//               >
//                 {error}
//               </motion.div>
//             )}
//           </AnimatePresence>


//           {/* product list */}
//           <div className="mb-10">
//             <h2 className="relative text-xl sm:text-2xl font-semibold mb-6 text-center text-slate-900 dark:text-slate-50">
//               📦{" "}
//               <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
//                 all products
//               </span>
//             </h2>


//             <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
//               {products.map((product) => (
//                 <motion.div
//                   key={product._id}
//                   initial={{ opacity: 0, scale: 0.97 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.2 }}
//                   whileHover={{ scale: 1.02 }}
//                   className={`flex justify-between items-center p-4 sm:p-5 rounded-2xl shadow-sm border transition-colors ${
//                     editingId === product._id
//                       ? "border-sky-500 bg-sky-50 dark:bg-sky-900/30"
//                       : "border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-900/95"
//                   }`}
//                 >
//                   {/* left: text */}
//                   <div className="flex flex-col items-start gap-1.5 text-left">
//                     <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
//                       {product.name}
//                     </h3>
//                     <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
//                       Variant: <span className="font-medium">{product.variant}</span>
//                     </p>
//                     <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
//                       Total quantity:{" "}
//                       <span className="font-medium">
//                         {product.initialQuantity}
//                       </span>
//                     </p>
//                     <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
//                       Available:{" "}
//                       <span className="font-medium">
//                         {product.quantityAvailable ?? product.initialQuantity}
//                       </span>
//                     </p>
//                   </div>


//                   {/* right: image + actions */}
//                   <div className="flex flex-col items-end gap-3">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setEnlargedImage(
//                           product.photoUrl ||
//                             `https://ui-avatars.com/api/?name=${product.name?.charAt(
//                               0
//                             )}&background=0ea5e9&color=fff&size=512`
//                         )
//                       }
//                       className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm transform transition hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400"
//                     >
//                       <img
//                         src={
//                           product.photoUrl ||
//                           `https://ui-avatars.com/api/?name=${product.name?.charAt(
//                             0
//                           )}&background=0ea5e9&color=fff&size=128`
//                         }
//                         alt={product.name}
//                         className="w-full h-full object-cover object-center"
//                       />
//                     </button>


//                     <div className="flex w-full justify-end items-center gap-2">
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="inline-flex items-center justify-center rounded-full border border-sky-200 dark:border-sky-500/60 bg-sky-50/70 dark:bg-sky-900/40 px-3 py-1.5 text-xs sm:text-sm text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-800 transition shadow-sm hover:shadow-md"
//                         title="Edit product"
//                       >
//                         <FaEdit className="mr-1" />
//                         <span className="hidden sm:inline">Edit</span>
//                       </button>
//                       <button
//                         onClick={() => confirmDelete(product._id)}
//                         className="inline-flex items-center justify-center rounded-full border border-rose-200 dark:border-rose-500/60 bg-rose-50/80 dark:bg-rose-900/40 px-3 py-1.5 text-xs sm:text-sm text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-800 transition shadow-sm hover:shadow-md"
//                         title="Delete product"
//                       >
//                         <FaTrashAlt className="mr-1" />
//                         <span className="hidden sm:inline">Delete</span>
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>


//           {/* form section */}
//           <div className="max-w-4xl mx-auto mb-6">
//             <h2 className="relative text-xl sm:text-2xl font-semibold mb-6 text-center text-slate-900 dark:text-slate-50">
//               {editingId ? "✏️" : "➕"}{" "}
//               <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
//                 {editingId ? "edit product" : "create new product"}
//               </span>
//             </h2>


//             <form
//               onSubmit={handleSubmit}
//               className="bg-white/95 dark:bg-slate-900/95 p-5 sm:p-6 rounded-2xl shadow-sm space-y-5 border border-slate-200 dark:border-slate-700"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div className="flex flex-col gap-4">
//                   <input
//                     type="text"
//                     placeholder="Product name"
//                     value={form.name}
//                     onChange={(e) =>
//                       setForm((prev) => ({ ...prev, name: e.target.value }))
//                     }
//                     className="p-2.5 border border-slate-300 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-sky-500 outline-none"
//                     required
//                   />
//                   <input
//                     type="text"
//                     placeholder="Variant"
//                     value={form.variant}
//                     onChange={(e) =>
//                       setForm((prev) => ({ ...prev, variant: e.target.value }))
//                     }
//                     className="p-2.5 border border-slate-300 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-sky-500 outline-none"
//                     required
//                   />


//                   {/* total quantity with restore option */}
//                   <div className="space-y-1">
//                     <div className="flex items-center justify-between gap-2">
//                       <label className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
//                         Total quantity (initialQuantity)
//                       </label>
//                       {editingOriginal && (
//                         <label className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={restoreInitial}
//                             onChange={(e) => setRestoreInitial(e.target.checked)}
//                             className="w-3 h-3 accent-sky-600"
//                           />
//                           <span>Restore old ({editingOriginal.initialQuantity})</span>
//                         </label>
//                       )}
//                     </div>
//                     <input
//                       type="number"
//                       min="0"
//                       placeholder="Total quantity"
//                       value={form.initialQuantity}
//                       onChange={(e) =>
//                         setForm((prev) => ({
//                           ...prev,
//                           initialQuantity: Math.max(0, Number(e.target.value)),
//                         }))
//                       }
//                       className="p-2.5 border border-slate-300 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-sky-500 outline-none"
//                       required
//                     />
//                   </div>


//                   {/* available quantity with restore option */}
//                   <div className="space-y-1">
//                     <div className="flex items-center justify-between gap-2">
//                       <label className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
//                         Quantity available (quantityAvailable)
//                       </label>
//                       {editingOriginal && (
//                         <label className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={restoreAvailable}
//                             onChange={(e) =>
//                               setRestoreAvailable(e.target.checked)
//                             }
//                             className="w-3 h-3 accent-sky-600"
//                           />
//                           <span>
//                             Restore old (
//                             {editingOriginal.quantityAvailable ??
//                               editingOriginal.initialQuantity}
//                             )
//                           </span>
//                         </label>
//                       )}
//                     </div>
//                     <input
//                       type="number"
//                       min="0"
//                       placeholder="Quantity available"
//                       value={form.quantityAvailable}
//                       onChange={(e) =>
//                         setForm((prev) => ({
//                           ...prev,
//                           quantityAvailable: Math.max(0, Number(e.target.value)),
//                         }))
//                       }
//                       className="p-2.5 border border-slate-300 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-sky-500 outline-none"
//                       required
//                     />
//                   </div>
//                 </div>


//                 {/* image upload column stays identical to your code */}
//                 <div>
//                   <label className="flex flex-col gap-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
//                     <span>Product image</span>
//                     <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
//                       <div className="flex flex-col items-center justify-center pt-4 pb-4">
//                         {/* icon + text same as before */}
//                         {/* ... */}
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => {
//                           const file = e.target.files?.[0] || null;
//                           setPhotoFile(file);
//                           if (file) {
//                             setForm((prev) => ({ ...prev, photoUrl: "" }));
//                           }
//                         }}
//                         className="hidden"
//                       />
//                     </label>
//                   </label>
//                 </div>
//               </div>


//               {photoFile && (
//                 <div className="flex justify-center mt-3">
//                   <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm transform transition hover:scale-105">
//                     <img
//                       src={URL.createObjectURL(photoFile)}
//                       alt="Preview"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//               )}


//               <div className="flex justify-center gap-4 mt-4">
//                 <button
//                   type="submit"
//                   className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-xs sm:text-sm text-white rounded-full font-semibold shadow-md transition transform hover:scale-105"
//                 >
//                   {editingId ? "Update product" : "Create product"}
//                 </button>
//                 {editingId && (
//                   <button
//                     type="button"
//                     onClick={cancelEdit}
//                     className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-50 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition font-semibold"
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </section>
//       </div>


//       {/* delete confirmation & image lightbox kept same as your original */}
//     </main>
//   );}