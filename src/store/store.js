import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import usersSlice from './slices/usersSlice'
import projectsSlice from './slices/projectsSlice'
import analyticsSlice from './slices/analyticsSlice'
import permissionsSlice from './slices/permissionsSlice'
import plantReducer from './slices/plantSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
    projects: projectsSlice,
    analytics: analyticsSlice,
    permissions: permissionsSlice,
    plant: plantReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})
