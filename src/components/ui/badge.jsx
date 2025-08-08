import * as React from 'react'; // Import React to use JSX and React features
import { cva } from 'class-variance-authority'; // Import cva (Class Variance Authority) to handle conditional class names
import { cn } from "../../lib/utils"; // Import utility function (likely to combine or conditionally apply class names)

const badgeVariants = cva(
  // Define the base styles for the Badge component
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', 
  {
    variants: {
      // Define different variants for the Badge component
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80', // Default style
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80', // Secondary style
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80', // Destructive style
        outline: 'text-foreground', // Outline style with text color
      },
    },
    defaultVariants: {
      variant: 'default', // Default variant is 'default' if no variant is provided
    },
  }
);

// Badge component that receives props like 'className', 'variant' (to specify style), and others
function Badge({ className, variant, ...props }) {
  // Apply conditional classes based on the 'variant' prop and the 'className' passed to the component
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// Export Badge component and badgeVariants utility to use elsewhere in the app
export { Badge, badgeVariants };
