import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from './store/slices/authSlice';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import UserManagement from './pages/UserManagement/UserManagement';
import PlantManagement from './pages/PlantManagement/PlantManagement';
import ProjectListing from './pages/ProjectManagement/ProjectListing';
import ProjectDetails from './pages/ProjectManagement/ProjectDetails';
import PermissionsManagement from './pages/PermissionsManagement/PermissionsManagement';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import ResetPassword from './pages/Auth/ResetPassword';
import TestAuth from './pages/Auth/TestAuth';
import PlantSelection from './pages/PlantSelection/PlantSelection';
import LocationManagement from './pages/LocationManagement/LocationManagement';
import PalletManagement from './pages/PalletManagement/PalletManagement';

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check for existing auth state
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (token && user && !isAuthenticated) {
      // If we have tokens but Redux state isn't updated yet
      dispatch(loginSuccess({ 
        token, 
        user: JSON.parse(user) 
      }));
    }
    
    setIsCheckingAuth(false);
  }, [dispatch, isAuthenticated]);

  if (isCheckingAuth) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Check for existing session on app load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && user) {
      dispatch(loginSuccess({ token, user }));
    }
  }, [dispatch]);

  // Check if user has selected a plant
  const hasSelectedPlant = localStorage.getItem('selectedPlantId');
  const location = useLocation();

  // Redirect to login if not authenticated, or to plant selection if no plant selected
  const getProtectedRouteElement = (element) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    
    if (!hasSelectedPlant) {
      return <Navigate to="/select-plant" state={{ from: location.pathname }} replace />;
    }
    
    return element;
  };

  return (
    <Routes>
      <Route path="/test-auth" element={<TestAuth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route 
        path="/login" 
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to={
              hasSelectedPlant 
                ? location.state?.from?.pathname || "/dashboard" 
                : "/select-plant"
            } replace />
          )
        } 
      />
      
      {/* Plant Selection Route - Only accessible when authenticated but no plant selected */}
      <Route 
        path="/select-plant" 
        element={
          isAuthenticated ? (
            hasSelectedPlant ? (
              <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />
            ) : (
              <PlantSelection />
            )
          ) : (
            <Navigate to="/login" state={{ from: '/select-plant' }} replace />
          )
        } 
      />
      
      {/* Protected Routes - Only accessible with a selected plant */}
      <Route element={<ProtectedRoute />}>
        <Route index element={getProtectedRouteElement(
            <Navigate to="/dashboard" replace />
          )} 
        />
        <Route 
          path="/dashboard" 
          element={getProtectedRouteElement(<Dashboard />)} 
        />
        <Route 
          path="/users" 
          element={getProtectedRouteElement(<UserManagement />)} 
        />
        <Route 
          path="/plants" 
          element={getProtectedRouteElement(<PlantManagement />)} 
        />
        <Route 
          path="/locations" 
          element={getProtectedRouteElement(<LocationManagement />)} 
        />
        <Route 
          path="/pallets" 
          element={getProtectedRouteElement(<PalletManagement />)} 
        />
        <Route 
          path="/projects" 
          element={getProtectedRouteElement(<ProjectListing />)} 
        />
        <Route 
          path="/projects/:id" 
          element={getProtectedRouteElement(<ProjectDetails />)} 
        />
        <Route 
          path="/permissions" 
          element={getProtectedRouteElement(<PermissionsManagement />)} 
        />
        <Route 
          path="/profile" 
          element={getProtectedRouteElement(<Profile />)} 
        />
      </Route>
      
      {/* Catch all other routes */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            hasSelectedPlant ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/select-plant" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
}

export default App
