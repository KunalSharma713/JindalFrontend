import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Shield,
  User,
  X,
  Factory,
} from "lucide-react";
import stlLogo from "../../assets/jindal-steel-logo.png";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "User Management", href: "/users", icon: Users },
    { name: "Plant Management", href: "/plants", icon: Factory },
    // { name: "Projects", href: "/projects", icon: FolderOpen },
    // { name: "Permissions", href: "/permissions", icon: Shield },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center">
                <img src={stlLogo} alt="STL Logo" className="h-8 w-auto" />
                <span className="ml-3 text-xl font-semibold text-gray-900">
                  Jindal Steel
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 px-2 space-y-1">
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
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* User info */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  }
                  alt={user?.name || "John Doe"}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name || "John Doe"}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {user?.role || "Super Admin"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src={stlLogo} alt="STL Logo" className="h-8 w-auto" />
              <span className="ml-3 text-xl font-semibold text-gray-900">
                Super Admin
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
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
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <img
                className="inline-block h-9 w-9 rounded-full"
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt={user?.name || "John Doe"}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name || "John Doe"}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  {user?.role || "Super Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
