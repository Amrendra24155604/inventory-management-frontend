import { useState, useEffect } from "react";

function CompleteProfile() {
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
    "Video Editing / Photography"
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
          setIsEditing(!data.data.rollNumber || !data.data.domain || !data.data.name);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    setErrorMessages([]);
    setLoading(true);

    try {
      // First upload photo if selected
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

      // Then submit profile info
      const response = await fetch(`${API_PORT}/api/v1/auth/complete-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, rollNumber, domain, photoUrl }),
      });

      const data = await response.json();
      if (response.ok && data.data) {
        setProfileData(data.data);
        setIsEditing(false);
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
    : `https://ui-avatars.com/api/?name=${avatarLetter}&background=4c51bf&color=fff&size=128&bold=true`;

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6 py-10">
      <div className="relative w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 transition-all duration-300">
          {isEditing ? (
            <>
              {/* Editing form */}
              <h2 className="text-4xl font-bold text-center text-indigo-600 dark:text-white mb-8">
                Complete Your Profile
              </h2>
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />

                <input
                  type="text"
                  placeholder="Roll Number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />

                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
                >
                  <option value="">Select your domain</option>
                  {domainOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {/* Photo upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setPhoto(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover mx-auto mt-4"
                  />
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Submit"}
                </button>

                {errorMessages.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {errorMessages.map((msg, idx) => (
                      <p key={idx} className="text-sm text-red-600 text-center">{msg}</p>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Display profile */}
              <h2 className="text-4xl font-bold text-center text-indigo-600 dark:text-white mb-10">
                Your Profile
              </h2>

              <div className="flex flex-col items-center space-y-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg transform hover:scale-105 transition duration-300">
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {profileData?.name || "Unknown User"}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    {profileData?.email || "No email available"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6">
                  <div className="bg-indigo-50 dark:bg-gray-800 p-6 rounded-xl shadow">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Roll Number</h4>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {profileData?.rollNumber || "Not set"}
                    </p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-gray-800 p-6 rounded-xl shadow">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Domain</h4>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {profileData?.domain || "Not set"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleEdit}
                  className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition"
                >
                  Edit Profile
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