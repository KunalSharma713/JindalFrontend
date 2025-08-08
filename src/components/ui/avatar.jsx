import React from "react"; // Import React to use JSX and React hooks
import * as AvatarPrimitive from "@radix-ui/react-avatar"; // Import Radix UI Avatar components
import { cn } from "../../lib/utils"; // Import utility function (presumably for classNames)

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  // `Avatar` component wraps around Radix UI AvatarRoot component
  <AvatarPrimitive.Root
    ref={ref} // Pass the ref to the Radix AvatarRoot component
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} // Apply default and custom classes
    {...props} // Spread the rest of the props onto the Radix AvatarRoot component
  />
));

Avatar.displayName = "Avatar"; // Set display name for React DevTools

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  // `AvatarImage` component wraps around Radix UI AvatarImage component
  <AvatarPrimitive.Image
    ref={ref} // Pass the ref to the Radix AvatarImage component
    className={cn("aspect-square h-full w-full", className)} // Apply default and custom classes
    {...props} // Spread the rest of the props onto the Radix AvatarImage component
  />
));

AvatarImage.displayName = "AvatarImage"; // Set display name for React DevTools

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  // `AvatarFallback` component wraps around Radix UI AvatarFallback component
  <AvatarPrimitive.Fallback
    ref={ref} // Pass the ref to the Radix AvatarFallback component
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)} // Apply default and custom classes
    {...props} // Spread the rest of the props onto the Radix AvatarFallback component
  />
));

AvatarFallback.displayName = "AvatarFallback"; // Set display name for React DevTools

// Export all components
export { Avatar, AvatarImage, AvatarFallback };
