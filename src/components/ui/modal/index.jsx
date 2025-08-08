import { useEffect } from "react";
import * as Dialog from '@radix-ui/react-dialog';

export const Modal = ({
  isOpen,
  onClose,
  children,
  className = "!max-w-[90%] !min-w-[90%]  !max-g-[90%] !min-g-[90%] !h-[90%] !left-[5%]  !p-0"
}) => {

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;



  return (

    <div className="upload_model">
      <Dialog.Root open={isOpen} onOpenChange={onClose} >
        <Dialog.Content className={`dialog-content ${className} `}  >
          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Root>
    </div>

  );
};
