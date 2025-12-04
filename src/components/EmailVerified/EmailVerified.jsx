import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EmailVerified() {
   const API_PORT= import.meta.env.VITE_API_PORT;
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function verify() {
      try {
        const response = await fetch(
          `${API_PORT}/api/v1/auth/verify-email/${verificationToken}`,
          { method: "GET", credentials: "include" }
        );

        if (response.redirected) {
          window.location.href = response.url; // Redirect from backend
        } else if (response.ok) {
          navigate("/login"); // Fallback redirect
        } else {
          navigate("/register"); // Invalid token
        }
      } catch (error) {
        console.error("Email verification failed:", error);
        navigate("/register");
      }
    }

    if (verificationToken) verify();
    else navigate("/register");
  }, [verificationToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-indigo-600">Verifying...</h1>
        <p className="mt-2 text-gray-700">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}