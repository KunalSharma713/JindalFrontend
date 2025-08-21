import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/slices/authSlice';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import UserManagement from './pages/UserManagement/UserManagement';
import ProjectListing from './pages/ProjectManagement/ProjectListing';
import ProjectDetails from './pages/ProjectManagement/ProjectDetails';
import PermissionsManagement from './pages/PermissionsManagement/PermissionsManagement';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated when app loads
    const token = localStorage.getItem('accessToken');
    if (token) {
      // If token exists, verify it with the server
      dispatch(checkAuth());
    }
  }, [dispatch]);

  // Show loading state while checking auth
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/projects" element={<ProjectListing />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/permissions" element={<PermissionsManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
