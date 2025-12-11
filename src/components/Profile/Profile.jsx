import { useState, useEffect } from "react";

function CompleteProfile() {
  const API_PORT = import.meta.env.VITE_API_PORT;

  const [name, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [domain, setDomain] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const domainOptions = [
    "Web Development",
    "App Development",
    "Android/Spring Boot",
    "Internet of Things(IOT)",
    "Competitive Programming",
    "Machine Learning",
    "Administration",
    "Content Writing",
    "Graphic Design / UIUX",
    "Marketing & Management",
    "Video Editing / Photography",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_PORT}/api/v1/auth/current-user`, {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.data) {
          setProfileData(data.data);
          setIsEditing(
            !data.data.rollNumber || !data.data.domain || !data.data.name
          );
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [API_PORT]);

  const handleSubmit = async () => {
    setErrorMessages([]);
    setLoading(true);

    try {
      let photoUrl = profileData?.photoUrl || null;

      if (photo) {
        const formData = new FormData();
        formData.append("photos", photo);

        const uploadRes = await fetch(`${API_PORT}/api/v1/upload`, {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.photos?.length > 0) {
          photoUrl = uploadData.photos[0];
        }
      }

      const response = await fetch(
        `${API_PORT}/api/v1/auth/complete-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, rollNumber, domain, photoUrl }),
        }
      );

      const data = await response.json();
      if (response.ok && data.data) {
        setProfileData(data.data);
        setIsEditing(false);
        setPreview(null);
      } else {
        const messages = Array.isArray(data.errors)
          ? data.errors
          : [data.message || "Profile update failed"];
        setErrorMessages(messages);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setErrorMessages(["Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFullName(profileData?.name || "");
    setRollNumber(profileData?.rollNumber || "");
    setDomain(profileData?.domain || "");
  };

  const avatarLetter = profileData?.username?.charAt(0)?.toUpperCase() || "U";
  const avatarUrl = profileData?.photoUrl
    ? profileData.photoUrl
    : `https://ui-avatars.com/api/?name=${avatarLetter}&background=0ea5e9&color=fff&size=128&bold=true`;

  return (
    <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-3xl">
        {/* soft blobs */}
        <div className="pointer-events-none absolute -top-16 -left-20 h-40 w-40 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/30" />
        <div className="pointer-events-none absolute -bottom-16 -right-24 h-44 w-44 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/30" />

        <div className="relative bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg px-4 py-6 sm:px-6 sm:py-8">
          {isEditing ? (
            <>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-slate-900 dark:text-slate-50 mb-6">
                Complete your{" "}
                <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                  profile
                </span>
              </h2>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Roll number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2205xxxxx"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Domain
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  >
                    <option value="">Select your domain</option>
                    {domainOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Profile photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setPhoto(file);
                      setPreview(URL.createObjectURL(file));
                    }}
                    className="w-full text-xs sm:text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-sky-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-sky-400 cursor-pointer text-slate-600 dark:text-slate-300"
                  />
                  {(preview || avatarUrl) && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={preview || avatarUrl}
                        alt="Preview"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-sky-400 shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Saving..." : "Save profile"}
                </button>

                {errorMessages.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {errorMessages.map((msg, idx) => (
                      <p
                        key={idx}
                        className="text-xs sm:text-sm text-rose-600 text-center"
                      >
                        {msg}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {profileData?.role === "admin" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 text-xs sm:text-sm font-semibold text-white shadow-lg ring-1 ring-purple-400/60 backdrop-blur-md">
                  Admin
                </div>
              )}

              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-slate-900 dark:text-slate-50 mb-7 mt-2">
                Your{" "}
                <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                  profile
                </span>
              </h2>

              <div className="flex flex-col items-center space-y-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-sky-400 shadow-md hover:scale-105 transition">
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50">
                    {profileData?.name || "Unknown user"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {profileData?.email || "No email available"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full mt-4">
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                    <h4 className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Roll number
                    </h4>
                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50">
                      {profileData?.rollNumber || "Not set"}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                    <h4 className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Domain
                    </h4>
                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50">
                      {profileData?.domain || "Not set"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleEdit}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sky-400 transition"
                >
                  Edit profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default CompleteProfile;
