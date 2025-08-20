import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useAppStore } from '@/store/app';
import {
  BarChart3,
  Users,
  Shield,
  Building2,
  MapPin,
  Package,
  QrCode,
  ClipboardList,
  Settings,
  LogOut,
} from 'lucide-react';
import jindalLogoPath from '@assets/jindal-steel-logo_1755585511544.png';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: BarChart3,
    section: 'main',
  },
  {
    name: 'User Management',
    href: '/users',
    icon: Users,
    section: 'Management',
  },
  {
    name: 'Role Management',
    href: '/roles',
    icon: Shield,
    section: 'Management',
  },
  {
    name: 'Plants & Warehouses',
    href: '/plants',
    icon: Building2,
    section: 'Management',
  },
  {
    name: 'Location Management',
    href: '/locations',
    icon: MapPin,
    section: 'Management',
  },
  {
    name: 'Pallet Management',
    href: '/pallets',
    icon: Package,
    section: 'Operations',
  },
  {
    name: 'Barcode Printing',
    href: '/barcodes',
    icon: QrCode,
    section: 'Operations',
  },
  {
    name: 'Audit Log',
    href: '/audit',
    icon: ClipboardList,
    section: 'Operations',
  },
  {
    name: 'Profile Settings',
    href: '/profile',
    icon: Settings,
    section: 'Settings',
  },
];

const sections = ['Management', 'Operations', 'Settings'];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { sidebarOpen } = useAppStore();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const groupedNavigation = navigation.reduce((acc, item) => {
    if (item.section === 'main') {
      return acc;
    }
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navigation>);

  return (
    <div className={cn(
      "w-64 bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out",
      !sidebarOpen && "w-0 overflow-hidden lg:w-64"
    )}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 jindal-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">JS</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Jindal Steel</h1>
            <p className="text-xs text-gray-500">Plant Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Dashboard */}
        <Link href="/">
          <a className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
            location === '/' 
              ? "nav-item-active" 
              : "nav-item"
          )}>
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
        </Link>

        {/* Grouped Navigation */}
        {sections.map((section) => (
          <div key={section} className="nav-group">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-2 mt-4">
              {section}
            </p>
            {groupedNavigation[section]?.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    location === item.href 
                      ? "nav-item-active" 
                      : "nav-item"
                  )}>
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Info Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user ? getInitials(user.firstName, user.lastName) : 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.roleId ? 'Role' : 'No Role'}
            </p>
          </div>
          <button 
            onClick={logout}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
