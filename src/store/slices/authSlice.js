import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useApi } from '../../hooks/useApi';

// Check if we have a token in localStorage
const token = localStorage.getItem('accessToken');
const userData = localStorage.getItem('user');

const initialState = {
  user: userData ? JSON.parse(userData) : null,
  isAuthenticated: !!token,
  loading: false,
  error: null
};

// Async thunk to check authentication status
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.error = null
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.isAuthenticated = false
      state.user = null
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.error = null
      // Clear localStorage on logout
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
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
