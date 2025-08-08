import * as React from "react";

// Define the mobile breakpoint (in pixels).
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // State to store whether the device is mobile or not. Initially set to undefined.
  const [isMobile, setIsMobile] = React.useState(undefined);

  // useEffect hook to perform side-effects, such as adding event listeners for screen size changes.
  React.useEffect(() => {
    // Create a media query listener that checks if the screen width is less than the defined breakpoint.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Callback function to update the state when the screen width changes.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT); // Update the state based on the window width.
    };

    // Add the change event listener to the media query list (mql).
    mql.addEventListener("change", onChange);

    // Set the initial value of isMobile when the component first mounts.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup function: removes the event listener when the component unmounts or when the effect re-runs.
    return () => mql.removeEventListener("change", onChange);
  }, []); // Empty dependency array ensures this effect runs only once, when the component mounts.

  // Return the boolean value of isMobile, ensuring it's a valid boolean by converting undefined to false.
  return !!isMobile;
}
