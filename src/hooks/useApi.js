import { useState, useCallback } from "react";

//Prod
const BASE_URL = "https://store-plate-backend.vercel.app/api/";

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

        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : null,
        });

        let data;
        const contentType = response.headers.get('content-type');
        
        // Only try to parse as JSON if the response is JSON
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          throw new Error(`Unexpected response format: ${text}`);
        }

        if (!response.ok) {
          throw new Error(data.message || `Request failed with status ${response.status}`);
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
