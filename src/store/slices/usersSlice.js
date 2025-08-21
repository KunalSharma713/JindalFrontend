import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@admin.com',
      role: 'Super Admin',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80',
      createdAt: '2024-01-15',
      lastLogin: '2024-08-01'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      role: 'Area Manager',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80',
      createdAt: '2024-02-10',
      lastLogin: '2024-07-30'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Field Engineer',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80',
      createdAt: '2024-03-05',
      lastLogin: '2024-07-28'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'Quality Lead',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80',
      createdAt: '2024-04-12',
      lastLogin: '2024-07-28'
    },
    {
      id: 5,
      name: 'Robert Chen',
      email: 'robert.chen@company.com',
      role: 'Quality Head',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80',
      createdAt: '2024-05-01',
      lastLogin: '2024-07-31'
    }
  ],
  loading: false,
  error: null,
  selectedUser: null
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addUser: (state, action) => {
      state.users.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      })
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload }
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload)
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null
    }
  }
})

export const {
  setLoading,
  setError,
  addUser,
  updateUser,
  deleteUser,
  setSelectedUser,
  clearSelectedUser
} = usersSlice.actions

export default usersSlice.reducer
