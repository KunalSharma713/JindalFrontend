import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  metrics: {
    totalUsers: 1247,
    activeUsers: 892,
    totalProjects: 24,
    activeProjects: 18,
    completedProjects: 6,
    totalRevenue: 125000,
    monthlyRevenue: 15000,
    permissionsUsage: 85
  },
  chartData: {
    userGrowth: [
      { month: 'Jan', users: 650, activeUsers: 520 },
      { month: 'Feb', users: 780, activeUsers: 630 },
      { month: 'Mar', users: 890, activeUsers: 720 },
      { month: 'Apr', users: 950, activeUsers: 780 },
      { month: 'May', users: 1050, activeUsers: 820 },
      { month: 'Jun', users: 1150, activeUsers: 860 },
      { month: 'Jul', users: 1247, activeUsers: 892 }
    ],
    projectStatus: [
      { name: 'Active', value: 15, color: '#3b82f6' },
      { name: 'Completed', value: 5, color: '#10b981' },
      { name: 'On Hold', value: 2, color: '#f59e0b' },
      { name: 'Cancelled', value: 2, color: '#ef4444' }
    ],
    revenueData: [
      { month: 'Jan', revenue: 18000, expenses: 12000 },
      { month: 'Feb', revenue: 22000, expenses: 14000 },
      { month: 'Mar', revenue: 19000, expenses: 13000 },
      { month: 'Apr', revenue: 25000, expenses: 16000 },
      { month: 'May', revenue: 28000, expenses: 18000 },
      { month: 'Jun', revenue: 32000, expenses: 20000 },
      { month: 'Jul', revenue: 35000, expenses: 22000 }
    ],
    roleDistribution: [
      { role: 'Super Admin', count: 2, percentage: 4.0 },
      { role: 'Area Manager', count: 5, percentage: 10.0 },
      { role: 'Field Engineer', count: 25, percentage: 50.0 },
      { role: 'Quality Lead', count: 8, percentage: 16.0 },
      { role: 'Quality Head', count: 3, percentage: 6.0 },
      { role: 'Others', count: 7, percentage: 14.0 }
    ]
  },
  activityLogs: [
    {
      id: 1,
      user: 'John Doe',
      action: 'Created new project',
      target: 'E-commerce Platform',
      timestamp: '2024-08-01T10:30:00Z',
      type: 'create'
    },
    {
      id: 2,
      user: 'Sarah Wilson',
      action: 'Updated user permissions',
      target: 'Mike Johnson',
      timestamp: '2024-08-01T09:15:00Z',
      type: 'update'
    },
    {
      id: 3,
      user: 'John Doe',
      action: 'Deleted project',
      target: 'Legacy System',
      timestamp: '2024-08-01T08:45:00Z',
      type: 'delete'
    }
  ],
  loading: false,
  error: null
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    updateMetrics: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload }
    },
    addActivityLog: (state, action) => {
      state.activityLogs.unshift({
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString()
      })
      // Keep only last 50 logs
      if (state.activityLogs.length > 50) {
        state.activityLogs = state.activityLogs.slice(0, 50)
      }
    },
    updateChartData: (state, action) => {
      state.chartData = { ...state.chartData, ...action.payload }
    }
  }
})

export const {
  setLoading,
  setError,
  updateMetrics,
  addActivityLog,
  updateChartData
} = analyticsSlice.actions

export default analyticsSlice.reducer
