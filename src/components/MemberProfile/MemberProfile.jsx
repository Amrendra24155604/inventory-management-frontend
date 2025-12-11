import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function MemberProfile() {
  const API_PORT = import.meta.env.VITE_API_PORT;
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
  }, [API_PORT, rollNumber]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-slate-500 dark:text-slate-400">
        Loading profile...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-rose-600 dark:text-rose-400">
        {error}
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-slate-500 dark:text-slate-400">
        No profile found
      </p>
    );
  }

  const avatarUrl =
    user.photoUrl ||
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${
      user.username?.charAt(0) || "U"
    }&background=0ea5e9&color=fff`;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-xl mx-auto px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative">
          {/* soft blobs, smaller so they don't force zoom */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-28 w-28 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/30" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/30" />

          <div className="relative bg-white/95 dark:bg-slate-900/95 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg px-5 py-7 sm:px-7 sm:py-8 text-center">
            {user.role === "admin" && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 text-xs sm:text-sm font-semibold text-white shadow-lg ring-1 ring-purple-400/60 backdrop-blur-md">
                Admin
              </div>
            )}

            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 border-2 border-sky-400 overflow-hidden cursor-pointer transition transform hover:scale-105 shadow-md"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setIsModalOpen(false)}
              >
                <img
                  src={avatarUrl}
                  alt="Enlarged Avatar"
                  className="w-56 h-56 sm:w-64 sm:h-64 rounded-full shadow-2xl border-4 border-sky-400 object-cover transition transform hover:scale-105"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
              {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">
              {user.email}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Roll no: <span className="font-medium">{user.rollNumber}</span>
            </p>
            <p className="text-xs sm:text-sm text-sky-700 dark:text-sky-300 mt-2 font-medium">
              {user.domain}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MemberProfile;
