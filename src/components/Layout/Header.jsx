import React from "react";
import { Menu, Bell } from "lucide-react";
import PlantSwitcher from "./PlantSwitcher";

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Plant Switcher */}
          <div className="hidden sm:block">
            <PlantSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
