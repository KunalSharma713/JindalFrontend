import { Navigate } from "react-router";
import LoginUser from "../page/LoginUser";
import { PlantSelector } from "../page/PlantSelector";
import { AddNewPlant } from "../page/AddNewPlant";
export const approutes = [
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginUser /> },
  { path: "/select-plant", element: <PlantSelector /> },
  { path: "/addNewPlant", element: <AddNewPlant /> },
  { path: "/*", element: <LoginUser /> }
];

