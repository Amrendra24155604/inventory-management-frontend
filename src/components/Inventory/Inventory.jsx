// import { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaUndo, FaTimes } from "react-icons/fa";

// export default function Inventory() {
//   const API_PORT = import.meta.env.VITE_API_PORT;

//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState({});
//   const [borrowedRequests, setBorrowedRequests] = useState([]);

//   const [returningId, setReturningId] = useState(null);
//   const [returnItems, setReturnItems] = useState([]);

//   const [enlargedImage, setEnlargedImage] = useState(null);

//   const [visibleSections, setVisibleSections] = useState({
//     pending: false,
//     approved: true,
//     onHold: false,
//     returned: false,
//     history: false,
//   });

//   const [adminRequestMessage, setAdminRequestMessage] = useState("");
//   const [purpose, setPurpose] = useState("");
//   const [expiryEnabled, setExpiryEnabled] = useState(false);
//   const [expiry, setExpiry] = useState(() => {
//     const minExpiry = new Date();
//     minExpiry.setMonth(minExpiry.getMonth() + 1);
//     return minExpiry.toISOString().slice(0, 10);
//   });

//   const quantityRefs = useRef({});

//   useEffect(() => {
//     fetch(`${API_PORT}/api/v1/auth/productList`, { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => setProducts(data?.data || data))
//       .catch((err) => console.error("Failed to fetch products:", err));

//     fetchBorrowedRequests();
//   }, [API_PORT]);

//   const fetchBorrowedRequests = () => {
//     fetch(`${API_PORT}/api/v1/auth/my`, { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => setBorrowedRequests(data?.data || []))
//       .catch((err) => console.error("Failed to fetch borrow requests:", err));
//   };

//   const handleCheckboxToggle = (productId) => {
//     setSelectedProducts((prev) => {
//       const updated = { ...prev };
//       const wasSelected = productId in updated;

//       if (wasSelected) {
//         delete updated[productId];
//       } else {
//         updated[productId] = 1;
//       }

//       if (!wasSelected) {
//         setTimeout(() => {
//           const input = quantityRefs.current[productId];
//           if (input) input.focus();
//         }, 0);
//       }

//       return updated;
//     });
//   };

//   const handleQuantityChange = (productId, quantity) => {
//     setSelectedProducts((prev) => ({ ...prev, [productId]: quantity }));
//   };

//   const handleBorrow = async () => {
//     const items = Object.entries(selectedProducts)
//       .filter(([_, qty]) => qty > 0)
//       .map(([product, quantityRequested]) => ({ product, quantityRequested }));

//     if (!purpose.trim()) {
//       alert("Please specify a purpose for borrowing.");
//       return;
//     }

//     if (expiryEnabled) {
//       const minExpiry = new Date();
//       minExpiry.setMonth(minExpiry.getMonth() + 1);
//       const selectedExpiry = new Date(expiry);
//       if (selectedExpiry < minExpiry) {
//         alert("The expiry date must be at least 1 month from today.");
//         return;
//       }
//     }

//     if (items.length === 0) return;

//     try {
//       const res = await fetch(`${API_PORT}/api/v1/auth/borrow`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           items,
//           purpose,
//           expiry: expiryEnabled ? expiry : null,
//         }),
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         alert(error.message || "Borrow request failed.");
//         return;
//       }

//       const data = await res.json();
//       if (!data.success) {
//         alert(data.message || "Borrow request failed.");
//         return;
//       }

//       setSelectedProducts({});
//       setPurpose("");
//       const minExpiry = new Date();
//       minExpiry.setMonth(minExpiry.getMonth() + 1);
//       setExpiry(minExpiry.toISOString().slice(0, 10));
//       setExpiryEnabled(false);
//       fetchBorrowedRequests();

//       setAdminRequestMessage("✅ Borrow request submitted successfully!");
//       setTimeout(() => setAdminRequestMessage(""), 4000);
//     } catch (err) {
//       console.error("Failed to submit borrow request:", err);
//       alert("Something went wrong while submitting your borrow request.");
//     }
//   };

//   const openReturnForm = (request) => {
//     setReturningId(request._id);
//     setReturnItems(
//       request.items.map((item) => ({
//         product: item.product._id,
//         quantityRequested: item.quantityRequested,
//         alreadyReturned: item.quantityReturned || 0,
//         quantityReturned: 0,
//         condition: "good",
//         notes: "",
//       }))
//     );
//   };

//   const handleReturnSubmit = async () => {
//     const nonZeroItems = returnItems.filter((item) => item.quantityReturned > 0);
//     if (!nonZeroItems.length) {
//       alert("Please enter a valid quantity for at least one item.");
//       return;
//     }

//     const filteredItems = nonZeroItems.map((item) => ({
//       product: item.product,
//       quantityReturned: item.quantityReturned,
//       condition: item.condition,
//       notes: item.notes,
//     }));

//     try {
//       await fetch(`${API_PORT}/api/v1/auth/${returningId}/return`, {
//         method: "PATCH",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ items: filteredItems }),
//       });

//       setReturningId(null);
//       setReturnItems([]);
//       fetchBorrowedRequests();

//       setAdminRequestMessage("✅ Return request submitted successfully!");
//       setTimeout(() => setAdminRequestMessage(""), 4000);
//     } catch (err) {
//       console.error("Failed to submit return request:", err);
//       alert("Something went wrong while submitting your return.");
//     }
//   };

//   const updateReturnItem = (index, field, value) => {
//     setReturnItems((prev) =>
//       prev.map((item, i) =>
//         i === index ? { ...item, [field]: value } : item
//       )
//     );
//   };

//   // Computed sections data
//   const returnPending = borrowedRequests.filter(
//     (r) => r.returnStatus === "pending"
//   );
//   const approved = borrowedRequests.filter(
//     (r) => r.status === "approved" && r.returnStatus === "none"
//   );
//   const onHold = borrowedRequests.filter((r) => r.status === "on hold");
//   const returned = borrowedRequests.filter(
//     (r) => r.returnStatus !== "none" && r.returnStatus !== "pending"
//   );
//   const history = borrowedRequests.filter(
//     (r) => r.status !== "approved" && r.status !== "on hold" && r.returnStatus === "none"
//   );

//   const sections = [
//     { key: "pending", title: "⏳ Return Pending", data: returnPending, count: returnPending.length },
//     { key: "approved", title: "✅ Approved Borrowed Items", data: approved, count: approved.length, showReturn: true },
//     { key: "onHold", title: "⏸️ On Hold Requests", data: onHold, count: onHold.length },
//     { key: "returned", title: "📦 Returned Items", data: returned, count: returned.length, showNotes: true },
//     { key: "history", title: "📜 Request History", data: history, count: history.length },
//   ];

//   // Handle section toggle with exclusive selection
//   const toggleSection = (sectionKey) => {
//     setVisibleSections((prev) => {
//       const newState = {};
      
//       // If already selected, toggle it off
//       if (prev[sectionKey]) {
//         newState[sectionKey] = false;
//         // Keep others as they are
//         Object.keys(prev).forEach(key => {
//           if (key !== sectionKey) newState[key] = prev[key];
//         });
//       } else {
//         // Select only this one, deselect all others
//         Object.keys(prev).forEach(key => {
//           newState[key] = key === sectionKey;
//         });
//       }
      
//       return newState;
//     });
//   };

//   return (
//     <div className="relative min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
//       {/* background */}
//       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&fit=crop&crop=center')] bg-cover bg-center bg-no-repeat opacity-5 dark:opacity-10 -z-10" />

//       {/* Toast Message */}
//       <AnimatePresence>
//         {adminRequestMessage && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl"
//           >
//             {adminRequestMessage}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Available products - YOUR ORIGINAL CODE (UNCHANGED) */}
//       <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center text-slate-900 dark:text-indigo-300 tracking-tight">
//         📦 Available Products
//       </h2>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleBorrow();
//         }}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10"
//       >
//         {products.map((product) => {
//           const isSelected = product._id in selectedProducts;

//           return (
//             <div
//               key={product._id}
//               onClick={() => handleCheckboxToggle(product._id)}
//               className={`flex justify-between items-center p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-sm hover:shadow-lg ${
//                 isSelected
//                   ? "ring-2 ring-sky-500 bg-sky-50 dark:bg-slate-900"
//                   : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700"
//               }`}
//             >
//               {/* info */}
//               <div className="flex flex-col items-start gap-1.5 text-left flex-1 pr-3">
//                 <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-indigo-200">
//                   {product.name}
//                 </h3>
//                 <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
//                   Variant: <span className="font-medium">{product.variant || "N/A"}</span>
//                 </p>
//                 <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
//                   Available:{" "}
//                   <span className="font-medium">{product.quantityAvailable}</span>
//                 </p>

//                 {isSelected && (
//                   <input
//                     ref={(el) => (quantityRefs.current[product._id] = el)}
//                     type="number"
//                     min="1"
//                     max={product.quantityAvailable}
//                     value={selectedProducts[product._id]}
//                     onChange={(e) =>
//                       handleQuantityChange(product._id, Number(e.target.value))
//                     }
//                     placeholder="Quantity to borrow"
//                     className="mt-2 w-full border border-slate-300 rounded-lg bg-white px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
//                     required
//                   />
//                 )}
//               </div>

//               {/* image + checkbox */}
//               <div className="flex flex-col items-end gap-2 sm:gap-3">
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setEnlargedImage(
//                       product.photoUrl ||
//                         `https://ui-avatars.com/api/?name=${product.name?.charAt(
//                           0
//                         )}&background=0ea5e9&color=fff&size=256`
//                     );
//                   }}
//                   className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-sky-400 shadow-md hover:shadow-lg hover:scale-105 transition"
//                 >
//                   <img
//                     src={
//                       product.photoUrl ||
//                       `https://ui-avatars.com/api/?name=${product.name?.charAt(
//                         0
//                       )}&background=0ea5e9&color=fff&size=128`
//                     }
//                     alt={product.name}
//                     className="w-full h-full object-cover object-center"
//                   />
//                 </button>

//                 <input
//                   type="checkbox"
//                   checked={isSelected}
//                   onChange={() => handleCheckboxToggle(product._id)}
//                   onClick={(e) => e.stopPropagation()}
//                   className="w-4 h-4 accent-sky-600 cursor-pointer"
//                 />
//               </div>
//             </div>
//           );
//         })}

//         {/* purpose + expiry */}
//         <div className="md:col-span-2 mt-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-700">
//           <label className="block mb-4">
//             <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
//               Purpose
//             </span>
//             <input
//               type="text"
//               value={purpose}
//               onChange={(e) => setPurpose(e.target.value)}
//               className="mt-1 w-full border border-slate-300 px-3 py-2 rounded-lg bg-white text-sm focus:ring-2 focus:ring-sky-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
//               placeholder="State your reason for borrowing"
//               required
//             />
//           </label>

//           <div className="flex items-center mb-3">
//             <input
//               type="checkbox"
//               id="expiry-toggle"
//               checked={expiryEnabled}
//               onChange={(e) => setExpiryEnabled(e.target.checked)}
//               className="mr-2 w-4 h-4 accent-sky-600 cursor-pointer"
//             />
//             <label
//               htmlFor="expiry-toggle"
//               className="cursor-pointer text-xs sm:text-sm text-slate-700 dark:text-slate-300"
//             >
//               Add expiry date (optional)
//             </label>
//           </div>

//           {expiryEnabled && (
//             <label className="block mb-2">
//               <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
//                 Expiry date (minimum 1 month)
//               </span>
//               <input
//                 type="date"
//                 value={expiry}
//                 min={(() => {
//                   const minDate = new Date();
//                   minDate.setMonth(minDate.getMonth() + 1);
//                   return minDate.toISOString().slice(0, 10);
//                 })()}
//                 onChange={(e) => setExpiry(e.target.value)}
//                 className="mt-1 w-full border border-slate-300 px-3 py-2 rounded-lg bg-white text-sm focus:ring-2 focus:ring-sky-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
//                 required={expiryEnabled}
//               />
//             </label>
//           )}
//         </div>

//         <div className="md:col-span-2 text-center mt-2">
//           <button
//             type="submit"
//             className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sky-400 transition"
//           >
//             Submit borrow request
//           </button>
//         </div>
//       </form>

//       {/* My Requests - EXCLUSIVE TOGGLE SECTIONS */}
//       <div className="mb-12">
//         <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center text-slate-900 dark:text-indigo-300 tracking-tight">
//           📋 My Requests
//         </h2>

//         {/* Section Buttons - EXCLUSIVE SELECTION */}
//         <div className="flex flex-wrap gap-3 justify-center mb-8 p-2 bg-white/50 dark:bg-slate-900/50 rounded-2xl backdrop-blur-sm">
//           {sections.map((section) => (
//             <motion.button
//               key={section.key}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => toggleSection(section.key)}
//               className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${
//                 visibleSections[section.key]
//                   ? "bg-sky-500 text-white shadow-lg ring-2 ring-sky-400"
//                   : "bg-white/70 border border-slate-200 hover:bg-white dark:bg-slate-900/70 dark:border-slate-700 hover:shadow-md"
//               }`}
//             >
//               <span>{section.title.split(" ")[0]}</span>
//               <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
//                 {section.count}
//               </span>
//             </motion.button>
//           ))}
//         </div>

//         {/* Active Section Content Only */}
//         {sections.map((section) =>
//           visibleSections[section.key] && (
//             <motion.div
//               key={section.key}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 shadow-xl dark:bg-slate-900/80 dark:border-slate-700/50"
//             >
//               <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100">
//                 {section.title}
//               </h3>
              
//               {section.data.length === 0 ? (
//                 <div className="text-center py-12 text-slate-500">
//                   <div className="w-20 h-20 mx-auto mb-4 bg-slate-200 rounded-2xl flex items-center justify-center">
//                     📭
//                   </div>
//                   <p className="text-lg">No {section.key} requests</p>
//                 </div>
//               ) : (
//                 <div className="grid gap-4">
//                   {section.data.map((request) => (
//                     <motion.div
//                       key={request._id}
//                       whileHover={{ y: -2 }}
//                       className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
//                     >
//                       <div className="flex items-start justify-between mb-4">
//                         <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                           request.status === 'approved' 
//                             ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50'
//                             : request.status === 'on hold'
//                             ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50'
//                             : 'bg-slate-100 text-slate-800 dark:bg-slate-700'
//                         }`}>
//                           {request.status?.replace('_', ' ')}
//                         </span>
//                         {request.returnStatus && request.returnStatus !== 'none' && (
//                           <span className={`px-3 py-1 rounded-full text-sm font-semibold ml-2 ${
//                             request.returnStatus === 'completed'
//                               ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50'
//                               : 'bg-orange-100 text-orange-800 dark:bg-orange-900/50'
//                           }`}>
//                             Return: {request.returnStatus}
//                           </span>
//                         )}
//                         <span className="text-sm text-slate-500 ml-auto">
//                           {new Date(request.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>

//                       <h4 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">
//                         {request.purpose}
//                       </h4>

//                       {request.expiry && (
//                         <p className="text-sm text-slate-600 mb-4 dark:text-slate-400">
//                           ⏰ Expires: {new Date(request.expiry).toLocaleDateString()}
//                         </p>
//                       )}

//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
//                         {request.items.slice(0, 6).map((item) => (
//                           <div key={item.product._id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-slate-700/50 transition">
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
//                                 <img
//                                   src={item.product.photoUrl || `https://ui-avatars.com/api/?name=${item.product.name?.charAt(0)}&background=sky-500&color=white&size=64`}
//                                   alt={item.product.name}
//                                   className="w-full h-full object-cover"
//                                 />
//                               </div>
//                               <div className="min-w-0 flex-1">
//                                 <p className="font-medium text-sm truncate text-slate-900 dark:text-slate-100">
//                                   {item.product.name}
//                                 </p>
//                                 <p className="text-xs text-slate-600 dark:text-slate-400">
//                                   Qty: {item.quantityRequested}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                         {request.items.length > 6 && (
//                           <div className="col-span-full text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm text-slate-500">
//                             +{request.items.length - 6} more items
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
//                         <div className="text-sm text-slate-500">
//                           Total items: {request.items.length}
//                         </div>
//                         {section.showReturn && request.returnStatus === "none" && (
//                           <motion.button
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                             onClick={() => openReturnForm(request)}
//                             className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition shadow-md"
//                           >
//                             <FaUndo className="w-4 h-4" />
//                             Return Items
//                           </motion.button>
//                         )}
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </motion.div>
//           )
//         )}
//       </div>

//       {/* Return Form Modal & Image Modal - SAME AS BEFORE */}
//       <AnimatePresence>
//         {returningId && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
//             onClick={() => {
//               setReturningId(null);
//               setReturnItems([]);
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//               className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
//                 <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📦 Return Items</h3>
//                 <button
//                   onClick={() => {
//                     setReturningId(null);
//                     setReturnItems([]);
//                   }}
//                   className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//                 >
//                   <FaTimes className="w-5 h-5 text-slate-500" />
//                 </button>
//               </div>

//               <div className="space-y-6 mb-8">
//                 {returnItems.map((item, index) => (
//                   <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/50">
//                     <div className="flex items-start gap-4 mb-4">
//                       <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
//                         <img
//                           src={item.product.photoUrl || `https://ui-avatars.com/api/?name=I&background=sky-500&color=white&size=128`}
//                           alt="Item"
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-semibold text-lg mb-1">{item.product.name}</h4>
//                         <p className="text-sm text-slate-600">Borrowed: {item.quantityRequested} | Returned: {item.alreadyReturned}</p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-2 text-slate-700">Quantity to return</label>
//                         <input
//                           type="number"
//                           min="1"
//                           max={item.quantityRequested - item.alreadyReturned}
//                           value={item.quantityReturned}
//                           onChange={(e) => updateReturnItem(index, 'quantityReturned', Number(e.target.value))}
//                           className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2 text-slate-700">Condition</label>
//                         <select
//                           value={item.condition}
//                           onChange={(e) => updateReturnItem(index, 'condition', e.target.value)}
//                           className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
//                         >
//                           <option value="good">Good condition</option>
//                           <option value="minor_damage">Minor damage</option>
//                           <option value="major_damage">Major damage</option>
//                           <option value="unusable">Unusable</option>
//                         </select>
//                       </div>
//                     </div>
//                     <textarea
//                       value={item.notes}
//                       onChange={(e) => updateReturnItem(index, 'notes', e.target.value)}
//                       placeholder="Additional notes (optional)"
//                       className="w-full mt-4 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
//                       rows={3}
//                     />
//                   </div>
//                 ))}
//               </div>

//               <div className="flex gap-4 pt-6 border-t border-slate-200">
//                 <button
//                   onClick={handleReturnSubmit}
//                   className="flex-1 bg-sky-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-sky-600 shadow-md transition"
//                 >
//                   Submit Return
//                 </button>
//                 <button
//                   onClick={() => {
//                     setReturningId(null);
//                     setReturnItems([]);
//                   }}
//                   className="flex-1 bg-slate-100 dark:bg-slate-800 py-3 px-6 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-600"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Image Modal */}
//       <AnimatePresence>
//         {enlargedImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//             onClick={() => setEnlargedImage(null)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="relative max-w-4xl w-full max-h-[90vh]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={enlargedImage}
//                 alt="Enlarged"
//                 className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
//               />
//               <button
//                 onClick={() => setEnlargedImage(null)}
//                 className="absolute -top-12 right-0 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition"
//               >
//                 <FaTimes className="w-5 h-5" />
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
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
