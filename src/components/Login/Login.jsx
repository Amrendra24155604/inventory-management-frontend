import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
function Login() {
    const API_PORT= import.meta.env.VITE_API_PORT;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);

const handleGoogleLoginOnly = async () => {
  setErrorMessages([]);
  setLoading(true);
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const response = await fetch(`${API_PORT}/api/v1/auth/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: user.email,
        googleId: user.uid,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("justLoggedIn", "true");
      window.location.href = "/";
    } else {
      const messages = Array.isArray(data.errors)
        ? data.errors
        : [data.message || "Google login failed"];
      setErrorMessages(messages);
    }
  } catch (error) {
    console.error("Google login error:", error);
    setErrorMessages(["Google login failed. Please try again."]);
  } finally {
    setLoading(false);
  }
};

  const handleLogin = async () => {
    setErrorMessages([]);
    try {
      const response = await fetch(`${API_PORT}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, username: name }),
      });

      const result = await response.json();

      if (response.status === 200 || response.status === 201) {
        window.location.href = "/";
      } else {
        const messages = Array.isArray(result.errors)
          ? result.errors
          : [result.message || "Login failed"];
        setErrorMessages(messages);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessages(["Login failed. Please check your credentials and try again."]);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl max-w-md w-full transition duration-300">
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-white mb-6">
          Welcome Back
        </h2>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Log In
          </button>

          {/* Inline Error Messages */}
          {errorMessages.length > 0 && (
            <div className="mt-4 space-y-2">
              {errorMessages.map((msg, idx) => (
                <p key={idx} className="text-sm text-red-600 text-center">{msg}</p>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center mt-4">
           <button
  onClick={handleGoogleLoginOnly}
  disabled={loading}
  className={`flex items-center gap-2 px-4 py-2 border rounded-full transition text-gray-800 dark:text-white ${
    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700"
  }`}
>
  <FcGoogle size={20} />
  <span className="text-sm font-medium">Log in with Google</span>
</button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </main>
  );
}

export default Login;