// utils/auth.js

const API_PORT = import.meta.env.VITE_API_PORT || "http://localhost:8000";

/**
 * Gets cached user from localStorage immediately (0ms latency for instant UI rendering)
 */
export const getCachedUser = () => {
  try {
    const userStr = localStorage.getItem("cachedUser");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

/**
 * Save user to local cache
 */
export const setCachedUser = (user) => {
  if (user) {
    localStorage.setItem("cachedUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("cachedUser");
  }
};

/**
 * Clear all local auth credentials & cache
 */
export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("cachedUser");
  localStorage.removeItem("loginExpiry");
  localStorage.removeItem("justLoggedIn");
  localStorage.removeItem("justRegistered");
};

/**
 * Refresh access token using stored refresh token or cookies
 */
export const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    // Try POST with body first
    const resPost = await fetch(`${API_PORT}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ refreshToken }),
    });

    if (resPost.ok) {
      const data = await resPost.json();
      const payload = data?.data || data;
      if (payload?.accessToken) {
        localStorage.setItem("accessToken", payload.accessToken);
        if (payload.refreshToken) {
          localStorage.setItem("refreshToken", payload.refreshToken);
        }
        return true;
      }
    }

    // Fallback to GET with cookie
    const resGet = await fetch(`${API_PORT}/api/v1/auth/refresh-token`, {
      method: "GET",
      credentials: "include",
    });

    if (resGet.ok) {
      const data = await resGet.json();
      const payload = data?.data || data;
      if (payload?.accessToken) {
        localStorage.setItem("accessToken", payload.accessToken);
        if (payload.refreshToken) {
          localStorage.setItem("refreshToken", payload.refreshToken);
        }
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * Fetch authenticated resource with auto token refresh on 401
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem("accessToken");
  const headers = {
    ...options.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: "include",
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    // Attempt silent token refresh
    const refreshed = await refreshAuthToken();
    if (refreshed) {
      const newToken = localStorage.getItem("accessToken");
      if (newToken) {
        fetchOptions.headers["Authorization"] = `Bearer ${newToken}`;
      }
      response = await fetch(url, fetchOptions);
    }
  }

  return response;
};

/**
 * Fetch current user with local caching & automatic token refresh on expiry
 */
export const fetchCurrentUser = async () => {
  try {
    const res = await authenticatedFetch(`${API_PORT}/api/v1/auth/current-user`, {
      method: "POST",
    });

    if (!res.ok) {
      clearAuthData();
      return null;
    }

    const data = await res.json();
    const user = data?.data || null;
    if (user) {
      setCachedUser(user);
    } else {
      clearAuthData();
    }
    return user;
  } catch (err) {
    console.error("fetchCurrentUser error:", err);
    // Fallback to cached user if offline or network glitch
    return getCachedUser();
  }
};

export const checkAuthStatus = async () => {
  return await fetchCurrentUser();
};