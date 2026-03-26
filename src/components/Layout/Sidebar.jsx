import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Shield,
  User,
  X,
  Factory,
  LogOut,
  Palette,
  Locate,
  ChevronDown,
} from "lucide-react";
import stlLogo from "../../assets/jindal-steel-logo.png";
import { logout } from "../../store/slices/authSlice";
import { clearSelectedPlant } from "../../store/slices/plantSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearSelectedPlant());
    navigate("/login", { replace: true });
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "User Management", href: "/users", icon: Users },
    { name: "Plant Management", href: "/plants", icon: Factory },
    { name: "Location Management", href: "/locations", icon: Locate },
    { name: "Pallet Management", href: "/pallets", icon: Palette },
    // { name: "Projects", href: "/projects", icon: FolderOpen },
    // { name: "Permissions", href: "/permissions", icon: Shield },
    // { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 xl:w-72">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center">
                <img src={stlLogo} alt="STL Logo" className="h-7 w-auto sm:h-8" />
                <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-semibold text-gray-900">
                  Jindal Steel
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-6 sm:mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.href ||
                  (item.href === "/dashboard" && location.pathname === "/");

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                  >
                    <Icon className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* User profile dropdown */}
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center">
                  {/* <img
                    className="h-8 w-8 rounded-full"
                    src={
                      user?.avatar ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    }
                    alt={
                      user?.username
                        .toLowerCase()
                        .split(" ")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ") || "User"
                    }
                  /> */}
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.username
                        .toLowerCase()
                        .split(" ")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ") || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isProfileOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {isProfileOpen && (
                <div className="mt-2 space-y-1">
                  <NavLink
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Your Profile
                  </NavLink>
                  {/* <NavLink
                    to="/settings"
                    onClick={onClose}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </NavLink> */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between flex-shrink-0 px-3 py-3 sm:px-4 sm:py-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src={stlLogo} alt="STL Logo" className="h-6 w-auto sm:h-8" />
              <span className="ml-2 sm:ml-3 text-base sm:text-xl font-semibold text-gray-900">
                Jindal Steel
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-3 sm:py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href === "/dashboard" && location.pathname === "/");

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                >
                  <Icon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User profile dropdown - Mobile */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full"
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt={
                  user?.username
                    .toLowerCase()
                    .split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ") || "User"
                }
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.username
                    .toLowerCase()
                    .split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ") || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email || ""}</p>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <NavLink
                to="/profile"
                onClick={onClose}
                className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Your Profile
              </NavLink>
              {/* <NavLink
                to="/settings"
                onClick={onClose}
                className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Settings
              </NavLink> */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
