import { createSlice } from '@reduxjs/toolkit'

// Check for existing auth state on initial load
const token = localStorage.getItem('accessToken');
const userData = localStorage.getItem('user');
let parsedUser = null;

try {
  if (userData) {
    parsedUser = JSON.parse(userData);
  }
} catch (error) {
  console.error('Error parsing user data from localStorage:', error);
  // Clear invalid data
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
}

const initialState = {
  user: parsedUser,
  isAuthenticated: !!token,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.error = null;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.isAuthenticated = false
      state.user = null
      state.error = action.payload
    },
    logout: (state) => {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('selectedPlantId');
        localStorage.removeItem('selectedPlantName');
      }
      
      // Reset state
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  clearError
} = authSlice.actions

export default authSlice.reducer
