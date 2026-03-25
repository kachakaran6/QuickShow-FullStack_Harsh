/**
 * API Configuration - Centralized API base URL management
 * Supports multiple environments with fallback to localhost for development
 */

const getAPIConfig = () => {
  let baseURL = import.meta.env.VITE_BASE_URL;

  // Fallback for development
  if (!baseURL) {
    baseURL =
      import.meta.env.MODE === "production"
        ? "https://quickshow-fullstack-harsh.onrender.com"
        : "http://localhost:3000";
  }

  return {
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export default getAPIConfig;
