import React from "react";
import { cn } from "../../lib/utils"; // Utility function to conditionally combine class names

// Main component that represents the main content area
export const Main = ({ fixed, ...props }) => {
  return (
    <main
      className={cn(
        // Utility class to add a margin-top when the header is fixed
        "peer-[.header-fixed]/header:mt-16", 

        // Padding for the main content
        "px-4 py-6", 

        // Conditionally apply styles if `fixed` prop is true
        fixed && "fixed-main flex flex-grow flex-col overflow-hidden"
      )}
      {...props} // Spread any additional props passed to the component
    />
  );
};

// Set the display name for easier debugging in React DevTools
Main.displayName = "Main";
