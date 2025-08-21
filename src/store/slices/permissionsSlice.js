import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  roles: [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: ['all'],
      userCount: 2,
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Area Manager',
      description: 'Manages area operations and field teams',
      permissions: ['projects.read', 'projects.update', 'users.read', 'analytics.read'],
      userCount: 5,
      createdAt: '2024-01-01'
    },
    {
      id: 3,
      name: 'Field Engineer',
      description: 'Handles field operations and technical tasks',
      permissions: ['projects.read', 'projects.update', 'profile.read', 'profile.update'],
      userCount: 25,
      createdAt: '2024-01-01'
    },
    {
      id: 4,
      name: 'Quality Lead',
      description: 'Leads quality assurance and control processes',
      permissions: ['projects.read', 'projects.update', 'analytics.read', 'users.read'],
      userCount: 8,
      createdAt: '2024-01-01'
    },
    {
      id: 5,
      name: 'Quality Head',
      description: 'Head of quality department with oversight responsibilities',
      permissions: ['projects.read', 'projects.create', 'projects.update', 'analytics.read', 'users.read', 'users.update'],
      userCount: 3,
      createdAt: '2024-01-01'
    }
  ],
  permissions: [
    { id: 'users.read', name: 'View Users', category: 'User Management' },
    { id: 'users.create', name: 'Create Users', category: 'User Management' },
    { id: 'users.update', name: 'Update Users', category: 'User Management' },
    { id: 'users.delete', name: 'Delete Users', category: 'User Management' },
    { id: 'projects.read', name: 'View Projects', category: 'Project Management' },
    { id: 'projects.create', name: 'Create Projects', category: 'Project Management' },
    { id: 'projects.update', name: 'Update Projects', category: 'Project Management' },
    { id: 'projects.delete', name: 'Delete Projects', category: 'Project Management' },
    { id: 'analytics.read', name: 'View Analytics', category: 'Analytics' },
    { id: 'permissions.read', name: 'View Permissions', category: 'Permissions' },
    { id: 'permissions.manage', name: 'Manage Permissions', category: 'Permissions' },
    { id: 'profile.read', name: 'View Profile', category: 'Profile' },
    { id: 'profile.update', name: 'Update Profile', category: 'Profile' }
  ],
  loading: false,
  error: null,
  selectedRole: null
}

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addRole: (state, action) => {
      state.roles.push({
        ...action.payload,
        id: Date.now(),
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      })
    },
    updateRole: (state, action) => {
      const index = state.roles.findIndex(role => role.id === action.payload.id)
      if (index !== -1) {
        state.roles[index] = { ...state.roles[index], ...action.payload }
      }
    },
    deleteRole: (state, action) => {
      state.roles = state.roles.filter(role => role.id !== action.payload)
    },
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null
    },
    addPermission: (state, action) => {
      state.permissions.push({
        ...action.payload,
        id: `${action.payload.category.toLowerCase().replace(' ', '_')}.${action.payload.name.toLowerCase().replace(' ', '_')}`
      })
    }
  }
})

export const {
  setLoading,
  setError,
  addRole,
  updateRole,
  deleteRole,
  setSelectedRole,
  clearSelectedRole,
  addPermission
} = permissionsSlice.actions

export default permissionsSlice.reducer
