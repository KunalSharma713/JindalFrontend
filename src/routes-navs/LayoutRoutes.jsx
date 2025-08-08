import Companies from "../model/companies/Companies";
import User from "../model/user/User";
import { AddUserDialog } from "../components/ui/userForm"
import { AddCompany } from "../model/companies/AddCompany"
import { Navigate } from "react-router";
import TruckTypeList from "../model/trucks/Trucks";
import { AddTruck } from "../model/trucks/AddTruck";
import Shipments from "../model/shipment/Shipments"
import Dashboard from "../model/dashboard/Dashboard";
import Plants from "../model/plants/Plants";
import { AddPlant } from "../model/plants/AddPlant";
export const LayoutRoutes = [

  {
    path: "/dashboard",
    element: <Dashboard />,
    roles: "*",
  },
  {
    path: "/companies",
    element: <Companies />,
    roles: "*",
  },
  {
    path: "/plants",
    element: <Plants />,
    roles: "*",
  },
  {
    path: "/createplant",
    element: <AddPlant />,
    roles: "*",
  },
  {
    path: "/editplant/:id",
    element: <AddPlant />,
    roles: "*",
  },
  {
    path: "/users",
    element: <User />,
    roles: "*",
  },

  {
    path: "/createuser",
    element: <AddUserDialog />,
    roles: "*",
  },
  {
    path: "/edituser/:id",
    element: <AddUserDialog />,
    roles: "*",
  },
  {
    path: "/createcompany",
    element: <AddCompany />,
    roles: "*",
  },
  {
    path: "/editcompany/:id",
    element: <AddCompany />,
    roles: "*",
  },
  {
    path: "/trucks",
    element: <TruckTypeList />,
    roles: "*",
  },
  {
    path: "/createtruck",
    element: <AddTruck />,
    roles: "*",
  },
  {
    path: "/edittruck/:id",
    element: <AddTruck />,
    roles: "*",
  },
  {
    path: "/shipment",
    element: <Shipments />,
    roles: "*",
  },
  {
    path: "/*",
    element: <Navigate to="/users" replace />,
    roles: "*",
  },
];


