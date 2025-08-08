import * as React from 'react'; // Import React to use JSX and React features
import { Slot } from '@radix-ui/react-slot'; // Import Slot component from Radix UI for composing elements
import { cva } from 'class-variance-authority'; // Import cva (Class Variance Authority) for handling conditional class names
import { cn } from "../../lib/utils"; // Import utility function to concatenate class names

// Define buttonVariants using cva to handle different variants and sizes for the button
const buttonVariants = cva(
  // Base styles for the button
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Default variant - primary style
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        // Destructive variant - typically used for dangerous actions (like delete)
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        // Outline variant - no solid background, only border
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        // Secondary variant - a secondary color scheme
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        // Ghost variant - a transparent button with hover effect
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        // Link variant - styled like a hyperlink
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        // Default size with padding and height
        default: 'h-9 px-4 py-2',
        // Small size with more compact dimensions
        sm: 'h-8 rounded-md px-3 text-xs',
        // Large size with bigger padding
        lg: 'h-10 rounded-md px-8',
        // Icon size for icon buttons
        icon: 'h-9 w-9',
      },
    },
    // Default values for variant and size if no props are provided
    defaultVariants: {
      variant: 'default', // Default variant is 'default'
      size: 'default', // Default size is 'default'
    },
  }
);

// The Button component
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  // `asChild` allows you to render a different component (like an anchor tag or div) instead of a button element
  const Comp = asChild ? Slot : 'button'; // Choose between Slot or button tag based on `asChild`
  
  return (
    // Render the chosen component (either `button` or a child component passed through `asChild`)
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  );
});

// Set the display name for the Button component for debugging purposes
Button.displayName = 'Button';

// Export the Button component and buttonVariants (for access to the variant and size utilities)
export { Button, buttonVariants };
