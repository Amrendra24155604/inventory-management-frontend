import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminProductPage({ menuOpen = false }) {
   const API_PORT= import.meta.env.VITE_API_PORT;
  const [products, setProducts] = useState([]);
const [form, setForm] = useState({
  name: "",
  variant: "",
  quantityAvailable: 0,
  photoUrl: ""   
});
const [photoFile, setPhotoFile] = useState(null); // track selected file
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  
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
// extra state to track selected file

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (form.quantityAvailable < 0) {
    setError("Quantity cannot be negative.");
    return;
  }

  let photoUrl = form.photoUrl; // keep existing if editing

  //  Upload photo if a new file was selected
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
        photoUrl = uploadJson.photos[0]; // Cloudinary URL
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

    setForm({ name: "", variant: "", quantityAvailable: 0, photoUrl: "" });
    setPhotoFile(null);
    setEditingId(null);
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
    initialQuantity: product.initialQuantity,
    photoUrl: product.photoUrl || "", // 👈 prefill photoUrl if exists
  });
  setEditingId(product._id);
};
  const confirmDelete = (productId) => {
    setDeleteTargetId(productId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const res = await fetch(`${API_PORT}api/v1/auth/products/${deleteTargetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product. Please try again.");
    }
  };

  const cancelEdit = () => {
  setForm({ name: "", variant: "", quantityAvailable: 0, photoUrl: "" });
  setPhotoFile(null);
  setEditingId(null);
};
const [enlargedImage, setEnlargedImage] = useState();
return (
  <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-black dark:text-white relative overflow-hidden">
    <div className={`transition duration-300 ${menuOpen ? "blur-sm scale-[0.98]" : "blur-0 scale-100"}`}>
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-600 dark:text-indigo-400 tracking-tight border-b pb-2 border-indigo-200 dark:border-indigo-700">
          🛠 Admin Product Management
        </h1>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 text-red-600 dark:text-red-400 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product List */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-center text-indigo-700 dark:text-indigo-400">
            📦 All Products
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                className={`flex justify-between items-center p-6 rounded-2xl shadow-lg border transition ${
                  editingId === product._id
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900"
                    : "border-gray-200 bg-white dark:bg-gray-800"
                }`}
              >
                {/* Text on the left */}
                <div className="flex flex-col items-start gap-2 text-left">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Variant:{" "}
                    <span className="font-medium">
                      {product.variant}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Quantity:{" "}
                    <span className="font-medium">
                      {product.initialQuantity}
                    </span>
                  </p>
                </div>

                {/* Image and actions on the right */}
                <div className="flex flex-col items-end gap-3">
                  {/* Product Image on the right (click to enlarge) */}
                  <button
                    type="button"
                    onClick={() =>
                      setEnlargedImage(
                        product.photoUrl ||
                        `https://ui-avatars.com/api/?name=${product.name?.charAt(0)}&background=4c51bf&color=fff&size=512`
                      )
                    }
                    className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

                  {/* Actions row, nicely aligned */}
                  <div className="flex w-full justify-end items-center gap-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center justify-center rounded-full border border-indigo-200 dark:border-indigo-500/60 bg-indigo-50/70 dark:bg-indigo-900/40 px-3 py-2 text-sm text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-shadow shadow-sm hover:shadow-md"
                      title="Edit Product"
                    >
                      <FaEdit className="mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => confirmDelete(product._id)}
                      className="inline-flex items-center justify-center rounded-full border border-red-200 dark:border-red-500/60 bg-red-50/80 dark:bg-red-900/40 px-3 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 transition-shadow shadow-sm hover:shadow-md"
                      title="Delete Product"
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

        {/* Form Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center text-indigo-700 dark:text-indigo-400">
            {editingId ? "✏️ Edit Product" : "➕ Create New Product"}
          </h2>

         <form
  onSubmit={handleSubmit}
  className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl space-y-6 border border-gray-200 dark:border-gray-700"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left column: stacked inputs */}
    <div className="flex flex-col gap-6">
      <input
        type="text"
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="p-3 border rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        required
      />
      <input
        type="text"
        placeholder="Variant"
        value={form.variant}
        onChange={(e) => setForm({ ...form, variant: e.target.value })}
        className="p-3 border rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        required
      />
      <input
        type="number"
        placeholder="Initial Quantity"
        min="1"
        value={form.initialQuantity}
        onChange={(e) =>
          setForm({
            ...form,
            initialQuantity: Math.max(0, Number(e.target.value)),
          })
        }
        className="p-3 border rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        required
      />
    </div>

    {/* Right column: file upload */}
    <div>
      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        <span>Product Image</span>
        <div className="flex items-center gap-3">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0l-4 4m4-4l4 4M17 8v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, JPEG (max 5MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setPhotoFile(e.target.files?.[0] || null);
                setForm({ ...form, photoUrl: "" });
              }}
              className="hidden"
            />
          </label>
        </div>
      </label>
    </div>
  </div>

  {/* Preview */}
  {photoFile && (
    <div className="flex justify-center mt-6">
      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <img
          src={URL.createObjectURL(photoFile)}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )}

  {/* Buttons */}
  <div className="flex justify-center gap-6 mt-6">
    <button
      type="submit"
      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 hover:brightness-110 text-white rounded-lg font-semibold shadow-md transition transform hover:scale-105"
    >
      {editingId ? "Update Product" : "Create Product"}
    </button>
    {editingId && (
      <button
        type="button"
        onClick={cancelEdit}
        className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition font-semibold"
      >
        Cancel
      </button>
    )}
  </div>
</form>
        </div>
      </section>
    </div>

    {/* Delete Confirmation Modal */}
    <AnimatePresence>
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[999]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-6">
              {/* Delete button */}
              <button
                onClick={() => {
                  handleDeleteConfirmed(deleteTargetId);
                  setShowDeleteConfirm(false);
                  setDeleteTargetId(null);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition transform font-semibold shadow-md"
              >
                Delete
              </button>

              {/* Cancel button */}
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTargetId(null);
                }}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
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
          onClick={() => setEnlargedImage(null)}  // click anywhere to close
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-96 h-96 rounded-full overflow-hidden shadow-2xl border-8 border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-black/20"
            onClick={(e) => e.stopPropagation()}  // prevent close when clicking on image
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
  </main>
);
}