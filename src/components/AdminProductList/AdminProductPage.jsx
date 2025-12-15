import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminProductPage({ menuOpen = false }) {
  const API_PORT = import.meta.env.VITE_API_PORT;
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    variant: "",
    initialQuantity: 0,      // total quantity ever added
    quantityAvailable: 0,    // currently available
    photoUrl: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingOriginal, setEditingOriginal] = useState(null); // keep original product

  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const [restoreInitial, setRestoreInitial] = useState(false);
  const [restoreAvailable, setRestoreAvailable] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_PORT}/api/v1/auth/productList`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load products. Please check your access.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // when toggling restore checkboxes, update form from original
  useEffect(() => {
    if (!editingOriginal) return;

    setForm((prev) => ({
      ...prev,
      initialQuantity: restoreInitial
        ? editingOriginal.initialQuantity
        : prev.initialQuantity,
      quantityAvailable: restoreAvailable
        ? editingOriginal.quantityAvailable
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
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      variant: product.variant,
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

  const confirmDelete = (productId) => {
    setDeleteTargetId(productId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
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
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product. Please try again.");
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative overflow-hidden">
      {/* soft blobs */}
      <div className="pointer-events-none absolute -top-16 -left-24 h-44 w-44 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/30" />
      <div className="pointer-events-none absolute -bottom-20 -right-28 h-48 w-48 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/30" />

      <div
        className={`relative z-10 transition duration-300 ${
          menuOpen ? "blur-sm scale-[0.98]" : "blur-0 scale-100"
        }`}
      >
        <section className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* page title */}
          <h1 className="relative text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-slate-900 dark:text-slate-50 mb-8">
            🛠 Admin{" "}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              product management
            </span>
          </h1>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 text-rose-600 dark:text-rose-400 text-sm text-center font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* product list */}
          <div className="mb-10">
            <h2 className="relative text-xl sm:text-2xl font-semibold mb-6 text-center text-slate-900 dark:text-slate-50">
              📦{" "}
              <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                all products
              </span>
            </h2>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex justify-between items-center p-4 sm:p-5 rounded-2xl shadow-sm border transition-colors ${
                    editingId === product._id
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-900/30"
                      : "border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-900/95"
                  }`}
                >
                  {/* left: text */}
                  <div className="flex flex-col items-start gap-1.5 text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      Variant: <span className="font-medium">{product.variant}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      Total quantity:{" "}
                      <span className="font-medium">
                        {product.initialQuantity}
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      Available:{" "}
                      <span className="font-medium">
                        {product.quantityAvailable ?? product.initialQuantity}
                      </span>
                    </p>
                  </div>

                  {/* right: image + actions */}
                  <div className="flex flex-col items-end gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setEnlargedImage(
                          product.photoUrl ||
                            `https://ui-avatars.com/api/?name=${product.name?.charAt(
                              0
                            )}&background=0ea5e9&color=fff&size=512`
                        )
                      }
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm transform transition hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400"
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

                    <div className="flex w-full justify-end items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center justify-center rounded-full border border-sky-200 dark:border-sky-500/60 bg-sky-50/70 dark:bg-sky-900/40 px-3 py-1.5 text-xs sm:text-sm text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-800 transition shadow-sm hover:shadow-md"
                        title="Edit product"
                      >
                        <FaEdit className="mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => confirmDelete(product._id)}
                        className="inline-flex items-center justify-center rounded-full border border-rose-200 dark:border-rose-500/60 bg-rose-50/80 dark:bg-rose-900/40 px-3 py-1.5 text-xs sm:text-sm text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-800 transition shadow-sm hover:shadow-md"
                        title="Delete product"
                      >
                        <FaTrashAlt className="mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* form section */}
          <div className="max-w-4xl mx-auto mb-6">
            <h2 className="relative text-xl sm:text-2xl font-semibold mb-6 text-center text-slate-900 dark:text-slate-50">
              {editingId ? "✏️" : "➕"}{" "}
              <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                {editingId ? "edit product" : "create new product"}
              </span>
            </h2>

            <form
              onSubmit={handleSubmit}
              className="bg-white/95 dark:bg-slate-900/95 p-5 sm:p-6 rounded-2xl shadow-sm space-y-5 border border-slate-200 dark:border-slate-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="p-2.5 border border-slate-300 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-sky-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Variant"
                    value={form.variant}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, variant: e.target.value }))
                    }
                    className="p-2.5 border border-slate-300 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-sky-500 outline-none"
                    required
                  />

                  {/* total quantity with restore option */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        Total quantity (initialQuantity)
                      </label>
                      {editingOriginal && (
                        <label className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={restoreInitial}
                            onChange={(e) => setRestoreInitial(e.target.checked)}
                            className="w-3 h-3 accent-sky-600"
                          />
                          <span>Restore old ({editingOriginal.initialQuantity})</span>
                        </label>
                      )}
                    </div>
                    <input
                      type="number"
                      min="0"
                      placeholder="Total quantity"
                      value={form.initialQuantity}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          initialQuantity: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      className="p-2.5 border border-slate-300 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-sky-500 outline-none"
                      required
                    />
                  </div>

                  {/* available quantity with restore option */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        Quantity available (quantityAvailable)
                      </label>
                      {editingOriginal && (
                        <label className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={restoreAvailable}
                            onChange={(e) =>
                              setRestoreAvailable(e.target.checked)
                            }
                            className="w-3 h-3 accent-sky-600"
                          />
                          <span>
                            Restore old (
                            {editingOriginal.quantityAvailable ??
                              editingOriginal.initialQuantity}
                            )
                          </span>
                        </label>
                      )}
                    </div>
                    <input
                      type="number"
                      min="0"
                      placeholder="Quantity available"
                      value={form.quantityAvailable}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          quantityAvailable: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      className="p-2.5 border border-slate-300 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-sky-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* image upload column stays identical to your code */}
                <div>
                  <label className="flex flex-col gap-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                    <span>Product image</span>
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                      <div className="flex flex-col items-center justify-center pt-4 pb-4">
                        {/* icon + text same as before */}
                        {/* ... */}
                      </div>
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
                        className="hidden"
                      />
                    </label>
                  </label>
                </div>
              </div>

              {photoFile && (
                <div className="flex justify-center mt-3">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm transform transition hover:scale-105">
                    <img
                      src={URL.createObjectURL(photoFile)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 mt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-xs sm:text-sm text-white rounded-full font-semibold shadow-md transition transform hover:scale-105"
                >
                  {editingId ? "Update product" : "Create product"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-50 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>

      {/* delete confirmation & image lightbox kept same as your original */}
    </main>
  );
}
