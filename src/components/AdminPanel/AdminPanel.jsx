// components/AdminBorrowPanel.jsx
import { useEffect, useState } from "react";

export default function AdminBorrowPanel() {
   const API_PORT= import.meta.env.VITE_API_PORT;
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`${API_PORT}/api/borrow/all`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRequests(data.data));
  }, []);

  const handleApprove = async (id) => {
    await fetch(`${API_PORT}/api/borrow/${id}/approve`, {
      method: "PATCH",
      credentials: "include",
    });
  };

  const handleReturnApprove = async (id) => {
    await fetch(`${API_PORT}/api/borrow/${id}/return/approve`, {
      method: "PATCH",
      credentials: "include",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Borrow Requests</h2>
      {requests.map((req) => (
        <div key={req._id} className="border p-4 rounded mb-4">
          <p>User: {req.user.username}</p>
          <p>Status: {req.status}</p>
          <ul>
            {req.items.map((item) => (
              <li key={item.product._id}>
                {item.product.name} - {item.quantityRequested}
              </li>
            ))}
          </ul>
          {req.status === "pending" && (
            <button
              onClick={() => handleApprove(req._id)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              Approve Borrow
            </button>
          )}
          {req.returnStatus === "pending" && (
            <button
              onClick={() => handleReturnApprove(req._id)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Approve Return
            </button>
          )}
        </div>
      ))}
    </div>
  );
}