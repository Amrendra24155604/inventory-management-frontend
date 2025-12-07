import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../../../firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const API_PORT= import.meta.env.VITE_API_PORT;

 const handleRegister = async () => {
  setErrorMessages([]);
  setLoading(true);

  try {
    const response = await fetch(`${API_PORT}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: name, email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Registration successful! Please check your email to verify your account.");
      navigate("/verify-email"); 
    } else {
      const messages = Array.isArray(result.errors) ? result.errors : [result.message];
      setErrorMessages(messages);
    }
  } catch (error) {
    console.error("Registration error:", error);
    setErrorMessages(["Registration failed. Please try again."]);
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = async () => {
    setErrorMessages([]);
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch(`${API_PORT}/api/v1/auth/google-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: user.email,
          username: user.displayName.toLowerCase().replace(/\s+/g, ""),
          googleId: user.uid,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("justRegistered", "true");
        navigate("/login");
      } else if (response.status === 409) {
        setErrorMessages(["Account already exists. Please log in instead."]);
      } else {
        const messages = Array.isArray(data.errors)
          ? data.errors
          : [data.message || "Google registration failed"];
        setErrorMessages(messages);
      }
    } catch (error) {
      console.error("Google registration error:", error);
      setErrorMessages(["Google registration failed. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 transition duration-300">
        <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-white mb-6">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg font-semibold transition ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {errorMessages.length > 0 && (
          <div className="mt-4 space-y-2">
            {errorMessages.map((msg, idx) => (
              <p key={idx} className="text-sm text-red-600 text-center">{msg}</p>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center mt-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full transition text-gray-800 dark:text-white ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FcGoogle size={20} />
            <span className="text-sm font-medium">Sign up with Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Log In
          </a>
        </p>
      </div>
    </main>
  );
}

export default Register;