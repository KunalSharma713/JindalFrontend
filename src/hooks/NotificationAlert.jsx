import { toast } from "react-toastify"; // Import the toast function from react-toastify to display notifications
import "react-toastify/dist/ReactToastify.css"; // Import the default styles for toast notifications

// Define common settings for all toast notifications
const toastSetting = {
  position: "top-right", // Set the position of the toast to the top-right of the screen
  autoClose: 3000, // The toast will automatically close after 3000ms (3 seconds)
  hideProgressBar: false, // Show the progress bar for the toast
  closeOnClick: true, // Allow the toast to be closed by clicking on it
  pauseOnHover: true, // Pause the toast auto-close timer when the user hovers over it
  draggable: true, // Allow the toast to be dragged around the screen
  progress: undefined, // Progress bar is undefined (not used here)
  theme: "colored", // Use a colored theme for the toast notifications
};

// NotificationAlert function to show different types of toast notifications based on status
export default function NotificationAlert(status, message) {
  // Check the status and display the corresponding toast notification
  if (status === "error") {
    return toast.error(message, { ...toastSetting, className: "toast-error" }); // Display an error toast
  } else if (status === "success") {
    return toast.success(message, { ...toastSetting, className: "toast-success" }); // Display a success toast
  } else if (status === "warning") {
    return toast.warning(message, { ...toastSetting, className: "toast-warning" }); // Display a warning toast
  } else if (status === "info") {
    return toast.info(message, { ...toastSetting, className: "toast-info" }); // Display an info toast
  } else {
    // Default toast if the status doesn't match any predefined status
    return toast(message, toastSetting);
  }
}
