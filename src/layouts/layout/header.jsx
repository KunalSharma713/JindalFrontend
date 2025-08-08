import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils"; // Utility function to combine class names
import { Separator } from "../../components/ui/separator"; // Separator component
import { SidebarTrigger } from "../../components/ui/sidebar"; // Sidebar trigger button
import { SwitchPlants } from "./SwitchPlants";

export const Header = ({ className, fixed, children, ...props }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between gap-3 bg-background p-4 sm:gap-4",
        fixed && "header-fixed peer/header fixed z-50 w-full rounded-md",
        offset > 10 && fixed ? "shadow" : "shadow-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
        <Separator orientation="vertical" className="h-6" />
      </div>

      {/* Right-aligned content */}
      <div className="ml-auto text-right text-sm sm:text-base">
        <SwitchPlants user={{
          name: "John Doe",
          email: "john@example.com",
          avatar: "",
          first_name: "John",
          last_name: "Doe"
        }} />
      </div>

      {/* Optional children content */}
      {children}
    </header>
  );
};

Header.displayName = "Header";
