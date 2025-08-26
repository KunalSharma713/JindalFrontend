import React from "react";
import {
  Users,
  FolderOpen,
  DollarSign,
  Shield,
  Palette,
  Locate,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const StatsCards = ({ metrics }) => {
  const stats = [
    {
      name: "Total Users",
      value: metrics?.totalUsers?.toLocaleString() || "1,247",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "bg-blue-600",
    },
    {
      name: "Active Plants",
      value: metrics?.activePlants?.toLocaleString() || "892",
      change: "+8%",
      changeType: "increase",
      icon: Users,
      color: "bg-green-600",
    },
    {
      name: "Total Locations",
      value: metrics?.totalLocations || "24",
      change: "+3",
      changeType: "increase",
      icon: Locate,
      color: "bg-purple-600",
    },
    {
      name: "Total Pallets",
      value: metrics?.totalPallets || "24",
      change: "+3",
      changeType: "increase",
      icon: Palette,
      color: "bg-purple-600",
    },
    // {
    //   name: 'Monthly Revenue',
    //   value: `$${metrics?.monthlyRevenue?.toLocaleString() || '15,000'}`,
    //   change: '+15%',
    //   changeType: 'increase',
    //   icon: DollarSign,
    //   color: 'bg-yellow-500'
    // }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon =
          stat.changeType === "increase" ? TrendingUp : TrendingDown;

        return (
          <div key={stat.name} className="card p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
                {/* <div className="mt-3 flex items-center">
                  <TrendIcon
                    className={`w-2 h-4 ${
                      stat.changeType === "increase"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  />
                  <span
                    className={`ml-1 text-sm font-medium ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1 text-[10px] text-gray-500">
                    from last month
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
