import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../../../firebase.js";
import { signInWithPopup } from "firebase/auth";

function Login() {
  const API_PORT = import.meta.env.VITE_API_PORT;

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
    setLoading(true);
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
      setErrorMessages([
        "Login failed. Please check your credentials and try again.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      {/* subtle background to match LandingPage */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/25" />
        <div className="pointer-events-none absolute bottom-[-72px] right-[-40px] h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/25" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl bg-white/90 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/5 px-6 py-7 sm:px-8 sm:py-8 backdrop-blur-md">
          {/* badge */}
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-sky-50 text-sky-700 text-[11px] font-semibold tracking-[0.18em] uppercase dark:bg-sky-900/40 dark:text-sky-300">
              IOT LABS • SIGN IN
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-center text-slate-900 dark:text-slate-50">
            Welcome back
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-center text-slate-500 dark:text-slate-400">
            Log in to manage inventory, requests, and your borrowed components.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Username
              </label>
              <input
                type="text"
                placeholder="Your display name"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white/80 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500 dark:bg-slate-900/70 dark:text-slate-50 dark:border-slate-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white/80 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500 dark:bg-slate-900/70 dark:text-slate-50 dark:border-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white/80 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500 dark:bg-slate-900/70 dark:text-slate-50 dark:border-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* error messages */}
            {errorMessages.length > 0 && (
              <div className="space-y-1 pt-1">
                {errorMessages.map((msg, idx) => (
                  <p
                    key={idx}
                    className="text-xs text-rose-600 dark:text-rose-400 text-center"
                  >
                    {msg}
                  </p>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className={`mt-1 w-full inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/30 transition ${
                loading
                  ? "bg-sky-400 cursor-wait opacity-80"
                  : "bg-sky-500 hover:bg-sky-400"
              }`}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/90 dark:bg-slate-900/95 px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLoginOnly}
              disabled={loading}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition dark:bg-slate-900/70 dark:border-slate-700 dark:text-slate-50 ${
                loading
                  ? "opacity-60 cursor-wait"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <FcGoogle size={18} />
              <span>Sign in with Google</span>
            </button>
          </form>

          <p className="mt-5 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
            >
              Register for access
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
