// import { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// export default function VerifyEmail() {
// const { verificationToken } = useParams();  const navigate = useNavigate();

//   useEffect(() => {
//     async function verify() {
//       try {
//         const response = await fetch(
//           `http://localhost:8000/api/v1/auth/verify-email/${verificationToken}`,
//           {
//             method: "GET",
//             credentials: "include", // Include cookies if needed
//           }
//         );

//         if (response.redirected) {
//           window.location.href = response.url; // Redirect to login
//         } else if (response.ok) {
//           navigate("/login"); // Optional: redirect to login on success
//         } else {
//           navigate("/register"); // Invalid token or failed verification
//         }
//       } catch (error) {
//         console.error("Email verification failed:", error);
//         navigate("/register");
//       }
//     }

//     if (verificationToken) {
//       verify();
//     } else {
//       navigate("/register");
//     }
//   }, [verificationToken, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <h1 className="text-2xl font-bold text-indigo-600">Verifying Your Email...</h1>
//         <p className="mt-2 text-gray-700">Please wait while we verify your account.</p>
//       </div>
//     </div>
//   );
// }

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-indigo-600">Verify Your Email</h1>
        <p className="mt-2 text-gray-700">
          We've sent a verification link to your email. Please click it to activate your account.
        </p>
      </div>
    </div>
  );
}