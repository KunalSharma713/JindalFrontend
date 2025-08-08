import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <DialogContent>{children}</DialogContent>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function DialogContent({ children }) {
  return (
    <DialogPrimitive.Content
      className={cn(
        "fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
        "bg-white rounded-lg shadow-lg p-6"
      )}
    >
      {children}
    </DialogPrimitive.Content>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4 flex justify-between items-center">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function DialogFooter({ children }) {
  return <div className="mt-4 flex justify-end space-x-2">{children}</div>;
}

export function DialogClose() {
  return (
    <DialogPrimitive.Close className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700">
      <X className="w-5 h-5" />
    </DialogPrimitive.Close>
  );
}
