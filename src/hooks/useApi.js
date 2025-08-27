import { useState, useCallback } from "react";

//Prod
const BASE_URL = "https://bhoomiapps.thevivapower.com/api/";

// const BASE_URL = "http://localhost:5000/api/";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Makes an API request using fetch.
   * @param {string} endpoint - The API endpoint (e.g., "/login").
   * @param {string} method - The HTTP method (GET, POST, etc.).
   * @param {object} body - The request payload (for POST/PUT).
   * @param {boolean} authRequired - If true, includes the auth token.
   * @returns {Promise<any>} - Returns the API response.
   */
  const apiRequest = useCallback(
    async (endpoint, method = "GET", body = null, authRequired = true) => {
      setLoading(true);
      setError(null);

      try {
        let headers = {
          "Content-Type": "application/json",
        };

        if (authRequired) {
          const token = localStorage.getItem("accessToken");
          if (token) {
            headers["authorization"] = `Bearer ${token}`;
          }
        }

        // Handle query parameters for GET requests
        let url = `${BASE_URL}${endpoint}`;
        const config = {
          method,
          headers,
        };

        if (method === "GET" && body) {
          const params = new URLSearchParams(body);
          url += `?${params.toString()}`;
        } else if (body) {
          config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Request failed");
        }

        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return { apiRequest, loading, error };
};
