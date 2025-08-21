import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import UserManagement from './pages/UserManagement/UserManagement'
import ProjectListing from './pages/ProjectManagement/ProjectListing'
import ProjectDetails from './pages/ProjectManagement/ProjectDetails'
import PermissionsManagement from './pages/PermissionsManagement/PermissionsManagement'
import Profile from './pages/Profile/Profile'
import Login from './pages/Auth/Login'

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/projects" element={<ProjectListing />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/permissions" element={<PermissionsManagement />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
