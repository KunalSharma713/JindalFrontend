import NotFoundPage from "../pages/NotFound";
import LoginPage from "../pages/Login";
import { Navigate } from "react-router-dom";
import ComingSoon from "../pages/ComingSoon";

export const AppRoutes = [
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/*", element: <ComingSoon /> },
];
