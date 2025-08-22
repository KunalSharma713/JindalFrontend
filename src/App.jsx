import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from './store/slices/authSlice';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import UserManagement from './pages/UserManagement/UserManagement';
import ProjectListing from './pages/ProjectManagement/ProjectListing';
import ProjectDetails from './pages/ProjectManagement/ProjectDetails';
import PermissionsManagement from './pages/PermissionsManagement/PermissionsManagement';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import TestAuth from './pages/Auth/TestAuth';

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

  return (
    <Routes>
      <Route path="/test-auth" element={<TestAuth />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/projects" element={<ProjectListing />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/permissions" element={<PermissionsManagement />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      
      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App
