import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function MemberProfile() {
   const API_PORT= import.meta.env.VITE_API_PORT;
  const { rollNumber } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_PORT}/api/v1/auth/profile/${rollNumber}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.user);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Something went wrong while fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [rollNumber]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
        Loading profile...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-600 dark:text-red-400">
        {error}
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
        No profile found
      </p>
    );
  }

  const avatarUrl =
    user.photoUrl ||
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${user.username?.charAt(0) || "U"}&background=4c51bf&color=fff`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 px-6 py-10">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 text-center relative">
        {/* Admin Badge */}
        {user.role === "admin" && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-600 text-white text-sm font-semibold tracking-wide shadow-lg ring-2 ring-purple-400/60 backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110">
            Admin
          </div>
        )}

        {/* Avatar circle with click-to-enlarge */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-500 overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Modal overlay with blurred background */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          >
            <img
              src={avatarUrl}
              alt="Enlarged Avatar"
              className="w-64 h-64 rounded-full shadow-2xl transform transition duration-300 scale-100 hover:scale-110"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image itself
            />
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {user.name}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Roll No: {user.rollNumber}
        </p>
        <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-2 font-medium">
          {user.domain}
        </p>
      </div>
    </main>
  );
}

export default MemberProfile;