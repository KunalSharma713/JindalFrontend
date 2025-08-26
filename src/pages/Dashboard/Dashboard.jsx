import React, { useEffect, useState } from "react";
import StatsCards from "../../components/Dashboard/StatsCards";
import UserGrowthChart from "../../components/Dashboard/UserGrowthChart";
import ProjectStatusChart from "../../components/Dashboard/ProjectStatusChart";
import RevenueChart from "../../components/Dashboard/RevenueChart";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import QuickActions from "../../components/Dashboard/QuickActions";
import { useApi } from "../../hooks/useApi";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({});
  const { apiRequest } = useApi();

  useEffect(() => {
    const fetchMetrics = async () => {
      const warehouseId = localStorage.getItem("selectedPlantId");
      if (!warehouseId) return;

      const endpoints = [
        { key: "totalUsers", url: `user/?warehouse=${warehouseId}` },
        { key: "totalLocations", url: `location/?warehouse=${warehouseId}` },
        { key: "activePlants", url: `warehouse/?warehouse=${warehouseId}` },
        { key: "totalPallets", url: `pallet/all?warehouse=${warehouseId}` },
      ];

      for (const { key, url } of endpoints) {
        const res = await apiRequest(url, "GET");
        if (res && res.data) {
          setMetrics((prev) => ({
            ...prev,
            [key]: res.pagination?.total ?? 0,
          }));
        }
      }
    };

    fetchMetrics();
  }, [apiRequest]);

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
      </div>

      <StatsCards metrics={metrics} />

      {/* Charts grid */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart data={chartData.userGrowth} />
        <ProjectStatusChart data={chartData.projectStatus} />
      </div> */}

      {/* Revenue chart - full width */}
      {/* <div className="grid grid-cols-1 gap-6">
        <RevenueChart data={chartData.revenueData} />
      </div> */}

      {/* Bottom section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={activityLogs} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
