import axios from "axios";
import { useEffect, useState } from "react";
import LocalStorageHelper from "../services/LocalStorageHelper";
import {
  progressBarStart,
  progressBarStop,
} from "../services/NavProgressHelper";
import { LogOutAction } from "../store/slices/LoginSlice";
import { useDispatch } from "react-redux";

// Custom hook to handle API fetch operations with several configurations.
const useFetchAPI = (
  {
    fullURL = null, // Full URL for the API request. Defaults to null.
    url = "", // Endpoint URL to make the API request.
    method = "GET", // HTTP method (GET, POST, PUT, DELETE, etc.)
    sendImmediately = false, // Flag to send the request immediately on mount.
    authRequired = false, // Flag to check if authentication is required.
    params = null, // Query parameters to be sent with the request.
    body = null, // Request body to be sent (for POST, PUT requests).
    headers = null, // Custom headers to be passed with the request.
    isAsync = false, // Flag for asynchronous handling of the request.
    isRefreshCall = false, // Flag for handling refresh token calls.
    haltRequest = false, // Flag to halt the request before sending.
  },
  dataTransform = null, // Optional function to transform response data.
  errorTransform = null // Optional function to transform error data.
) => {
  const dispatch = useDispatch();

  // State variables to manage fetching state, response data, and errors.
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    // If sendImmediately is true, call the immediateCall function.
    if (sendImmediately) {
      immediateCall();
    }
  }, []);

  // Function to immediately execute the API request.
  const immediateCall = async () => {
    await execute();
  };

  // Async error handler to process errors and update state.
  const catchErrorHandlerAsync = async (error) => {
    console.log(error?.response);
    if (!error?.response && error?.request) {
      let responseMessage = genrateErrorMessage(error);
      error.response = { data: { message: responseMessage } };
    }
    if (
      (error?.response?.status !== 401 && error?.response?.status !== "401") ||
      isRefreshCall
    ) {
      if (errorTransform) {
        let resultData = await errorTransform(error);
        setError(resultData);
      } else {
        setError(error);
      }
    } else {
      LocalStorageHelper.removeItem("token");
      window.location.reload(false);
    }
    setFetching(false);
    setData(null);
  };

  // Error handler for synchronous errors, handling logout and other errors.
  const catchErrorHandler = (error) => {
    // console.log(error?.response?.data?.TokenExpired);
    // if (!error?.response?.data?.TokenExpired) {
    //   dispatch(LogOutAction());
    // }
    if (!error?.response && error?.request) {
      let responseMessage = genrateErrorMessage(error);
      error.response = { data: { message: responseMessage } };
    }
    if (
      (error?.response?.status !== 401 && error?.response?.status !== "401") ||
      isRefreshCall
    ) {
      if (errorTransform) {
        let resultData = errorTransform(error);
        setError(resultData);
      } else {
        setError(error);
      }
    } else {
      LocalStorageHelper.removeItem("token");
      window.location.reload(false);
    }
    setFetching(false);
    setData(null);
  };

  // Async success handler to handle successful API responses.
  const thenSuccessHandlerAsync = async (response) => {
    if (dataTransform) {
      let resultData = await dataTransform(response?.data);
      setData(resultData);
    } else {
      setData(response?.data);
    }
    setFetching(false);
    setError(null);
  };

  // Success handler for synchronous success handling.
  const thenSuccessHandler = (response) => {
    if (dataTransform) {
      let resultData = dataTransform(response?.data);
      setData(resultData);
    } else {
      setData(response?.data);
    }
    setFetching(false);
    setError(null);
  };

  // Main function to execute the API request based on the method.
  const execute = async (newProps) => {
    setFetching(true);
    progressBarStart();
    // This may return null
    let fullurl = fullURL ?? import.meta.env.VITE_API_URL + url;
    let tokenHeader = {};

    if (authRequired) {
      const token = LocalStorageHelper.getItem("accessToken");
      tokenHeader.authorization = `Bearer ${token}`;
    }
    let newheaders = headers
      ? { ...headers, ...tokenHeader }
      : {
          "Content-Type": "application/json; charset=utf-8",
          ...tokenHeader,
        };

    if (method.toUpperCase() == "POST") {
      headers["Content-Type"] = "multipart/form-data";
    }

    let newparams = {};
    if (newProps?.params !== undefined && newProps?.params !== null) {
      newparams = { ...newProps?.params };
    } else if (params) {
      newparams = { ...params };
    }
    let newbody = null;
    if (newProps?.body !== undefined && newProps?.body !== null) {
      newbody = newProps?.body;
    } else {
      newbody = body;
    }

    if (haltRequest) {
      if (isAsync) {
        await thenSuccessHandlerAsync(null);
      } else {
        thenSuccessHandler(null);
      }
      progressBarStop();
      return;
    }

    switch (method) {
      case "GET":
        axios
          .get(fullurl, { params: { ...newparams }, headers: newheaders })
          .then(isAsync ? thenSuccessHandlerAsync : thenSuccessHandler)
          .catch(isAsync ? catchErrorHandlerAsync : catchErrorHandler)
          .finally(progressBarStop);
        break;
      case "POST":
        axios
          .post(fullurl, newbody, {
            headers: {
              ...newheaders,
            },
          })
          .then(isAsync ? thenSuccessHandlerAsync : thenSuccessHandler)
          .catch(isAsync ? catchErrorHandlerAsync : catchErrorHandler)
          .finally(progressBarStop);
        break;
      case "PUT":
        axios
          .put(fullurl, newbody, {
            headers: {
              ...newheaders,
            },
          })
          .then(isAsync ? thenSuccessHandlerAsync : thenSuccessHandler)
          .catch(isAsync ? catchErrorHandlerAsync : catchErrorHandler)
          .finally(progressBarStop);
        break;
      case "DELETE":
        axios
          .delete(fullurl, {
            headers: {
              ...newheaders,
            },
          })
          .then(isAsync ? thenSuccessHandlerAsync : thenSuccessHandler)
          .catch(isAsync ? catchErrorHandlerAsync : catchErrorHandler)
          .finally(progressBarStop);
        break;
      default:
        break;
    }
  };

  return [{ data, fetching, error }, execute];
};

const genrateErrorMessage = (error) => {
  let responseMessage = null;
  if (error.code === "ECONNABORTED") {
    responseMessage = "Timeout Error: The request took too long.";
  } else if (error.code === "ENOTFOUND") {
    responseMessage = "DNS Error: The domain could not be found.";
  } else if (error.code === "ECONNREFUSED") {
    responseMessage = "Connection Refused: The server is down or unreachable.";
  } else if (error.code === "ECONNRESET") {
    responseMessage =
      "Connection Reset: Server unexpectedly closed the connection.";
  } else if (error.code === "ETIMEDOUT") {
    responseMessage = "Request Timed Out: The request failed due to timeout.";
  } else if (error.code === "EAI_AGAIN") {
    responseMessage = "Temporary DNS Error: Please try again later.";
  } else if (error.code === "EHOSTUNREACH") {
    responseMessage = "Host Unreachable: Network issues detected.";
  } else if (error.code === "EADDRINUSE") {
    responseMessage = "Address Already in Use: Check server settings.";
  } else if (error.code === "EPIPE") {
    responseMessage = "Broken Pipe: The connection was unexpectedly closed.";
  } else if (error.code === "ENETUNREACH") {
    responseMessage =
      "Network Unreachable: Please check your internet connection.";
  } else if (error.code === "EPROTO") {
    responseMessage = "Protocol Error: SSL/TLS misconfiguration detected.";
  } else if (error.code === "ECANCELED") {
    responseMessage = "Request Canceled: The operation was manually aborted.";
  } else if (error.code === "ERR_NETWORK") {
    responseMessage =
      "Network Error: Check your internet connection or firewall settings.";
  } else if (error.code === "ERR_SSL_PROTOCOL_ERROR") {
    responseMessage = "SSL Error: The SSL protocol handshake failed.";
  } else if (error.code === "ERR_TLS_CERT_ALTNAME_INVALID") {
    responseMessage =
      "SSL Error: The certificate name does not match the domain.";
  } else if (error.code === "ERR_TLS_CERT_EXPIRED") {
    responseMessage = "SSL Error: The SSL certificate has expired.";
  } else if (error.code === "ERR_CERT_AUTHORITY_INVALID") {
    responseMessage = "SSL Error: The certificate authority is not trusted.";
  } else if (error.code === "ERR_CORS") {
    responseMessage =
      "CORS Error: Request blocked by browser due to cross-origin policy.";
  } else if (error.code === "ERR_INTERNET_DISCONNECTED") {
    responseMessage =
      "Internet Disconnected: Please check your internet connection.";
  } else if (error.message.includes("Network Error")) {
    responseMessage = "Network Error: Please check your internet connection.";
  } else if (error.message.includes("CORS")) {
    responseMessage =
      "CORS Error: Request blocked by browser due to cross-origin policy.";
  }
  console.log(responseMessage);
  return responseMessage;
};
export default useFetchAPI;
