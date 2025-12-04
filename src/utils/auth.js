// utils/auth.js
export const checkAuthStatus = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/auth/current-user", {
      method: "POST",
      credentials: "include", // sends cookies
    });

    if (!res.ok) throw new Error("Not authenticated");

    const data = await res.json();
    return data?.data?.user || null;
  } catch {
    return null;
  }
};