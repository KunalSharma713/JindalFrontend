import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projects: [
    {
      id: "p1",
      name: "BharatNet Rollout – District A",
      description: "Fiber optic network rollout project for District A",
      status: "active",
      priority: "high",
      progress: 65,
      startDate: "2024-01-15",
      endDate: "2024-12-30",
      assignedAreaManager: "John Smith",
      budget: 5000000,
      spent: 3250000,
      spans: [
        {
          id: "s1",
          name: "Span-45A",
          description: "Fiber optic span covering 45km route",
          startDate: "2024-02-01",
          endDate: "2024-08-30",
          progress: 75,
          nodes: [
            {
              id: "n1",
              name: "Node-45",
              gp: "GP-101",
              description: "Primary distribution node",
              startDate: "2024-02-15",
              endDate: "2024-07-15",
              progress: 80,
              activities: [
                { 
                  id: "a1", 
                  activity: "Trenching", 
                  status: "Completed", 
                  assignedTo: "FE1", 
                  timestamp: "2025-07-01",
                  description: "Underground cable trenching work"
                },
                { 
                  id: "a2", 
                  activity: "Duct Alignment", 
                  status: "In Progress", 
                  assignedTo: "FE2", 
                  timestamp: "2025-07-02",
                  description: "Fiber duct alignment and installation"
                },
                { 
                  id: "a3", 
                  activity: "Cable Pulling", 
                  status: "Pending", 
                  assignedTo: "FE3", 
                  timestamp: "2025-07-10",
                  description: "Fiber cable pulling through ducts"
                }
              ]
            },
            {
              id: "n2",
              name: "Node-46",
              gp: "GP-102",
              description: "Secondary distribution node",
              startDate: "2024-03-01",
              endDate: "2024-08-30",
              progress: 60,
              activities: [
                { 
                  id: "a4", 
                  activity: "Site Survey", 
                  status: "Completed", 
                  assignedTo: "FE4", 
                  timestamp: "2025-06-15",
                  description: "Site survey and planning"
                },
                { 
                  id: "a5", 
                  activity: "Foundation Work", 
                  status: "In Progress", 
                  assignedTo: "FE5", 
                  timestamp: "2025-07-05",
                  description: "Foundation and civil work"
                }
              ]
            }
          ]
        },
        {
          id: "s2",
          name: "Span-46B",
          description: "Fiber optic span covering 32km route",
          startDate: "2024-03-15",
          endDate: "2024-10-15",
          progress: 45,
          nodes: [
            {
              id: "n3",
              name: "Node-47",
              gp: "GP-103",
              description: "Tertiary distribution node",
              startDate: "2024-04-01",
              endDate: "2024-09-30",
              progress: 40,
              activities: [
                { 
                  id: "a6", 
                  activity: "Route Planning", 
                  status: "Completed", 
                  assignedTo: "FE6", 
                  timestamp: "2025-06-20",
                  description: "Route planning and optimization"
                },
                { 
                  id: "a7", 
                  activity: "Pole Installation", 
                  status: "In Progress", 
                  assignedTo: "FE7", 
                  timestamp: "2025-07-08",
                  description: "Utility pole installation"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "p2",
      name: "Smart City Infrastructure – Zone B",
      description: "Smart city infrastructure development project",
      status: "active",
      priority: "medium",
      progress: 35,
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      assignedAreaManager: "Sarah Johnson",
      budget: 3000000,
      spent: 1050000,
      spans: [
        {
          id: "s3",
          name: "Span-ICT-01",
          description: "ICT infrastructure span",
          startDate: "2024-04-01",
          endDate: "2024-12-31",
          progress: 40,
          nodes: [
            {
              id: "n4",
              name: "Node-ICT-01",
              gp: "GP-201",
              description: "ICT control center",
              startDate: "2024-04-15",
              endDate: "2024-11-30",
              progress: 35,
              activities: [
                { 
                  id: "a8", 
                  activity: "Equipment Installation", 
                  status: "In Progress", 
                  assignedTo: "FE8", 
                  timestamp: "2025-07-03",
                  description: "ICT equipment installation"
                },
                { 
                  id: "a9", 
                  activity: "Network Configuration", 
                  status: "Pending", 
                  assignedTo: "FE9", 
                  timestamp: "2025-07-15",
                  description: "Network configuration and testing"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "p3",
      name: "Rural Connectivity – Block C",
      description: "Rural broadband connectivity project",
      status: "completed",
      priority: "high",
      progress: 100,
      startDate: "2023-09-01",
      endDate: "2024-06-30",
      assignedAreaManager: "Michael Chen",
      budget: 2000000,
      spent: 1950000,
      spans: [
        {
          id: "s4",
          name: "Span-Rural-01",
          description: "Rural connectivity span",
          startDate: "2023-10-01",
          endDate: "2024-05-31",
          progress: 100,
          nodes: [
            {
              id: "n5",
              name: "Node-Rural-01",
              gp: "GP-301",
              description: "Rural distribution node",
              startDate: "2023-10-15",
              endDate: "2024-05-15",
              progress: 100,
              activities: [
                { 
                  id: "a10", 
                  activity: "Tower Installation", 
                  status: "Completed", 
                  assignedTo: "FE10", 
                  timestamp: "2024-03-15",
                  description: "Communication tower installation"
                },
                { 
                  id: "a11", 
                  activity: "Equipment Commissioning", 
                  status: "Completed", 
                  assignedTo: "FE11", 
                  timestamp: "2024-04-20",
                  description: "Equipment commissioning and testing"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  loading: false,
  error: null,
  selectedProject: null
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addProject: (state, action) => {
      state.projects.push({
        ...action.payload,
        id: `p${Date.now()}`,
        startDate: new Date().toISOString().split('T')[0]
      })
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(project => project.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload }
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(project => project.id !== action.payload)
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null
    },
    addSpan: (state, action) => {
      const { projectId, span } = action.payload
      const project = state.projects.find(p => p.id === projectId)
      if (project) {
        project.spans.push({
          ...span,
          id: `s${Date.now()}`,
          nodes: []
        })
      }
    },
    addNode: (state, action) => {
      const { projectId, spanId, node } = action.payload
      const project = state.projects.find(p => p.id === projectId)
      if (project) {
        const span = project.spans.find(s => s.id === spanId)
        if (span) {
          span.nodes.push({
            ...node,
            id: `n${Date.now()}`,
            activities: []
          })
        }
      }
    },
    addActivity: (state, action) => {
      const { projectId, spanId, nodeId, activity } = action.payload
      const project = state.projects.find(p => p.id === projectId)
      if (project) {
        const span = project.spans.find(s => s.id === spanId)
        if (span) {
          const node = span.nodes.find(n => n.id === nodeId)
          if (node) {
            node.activities.push({
              ...activity,
              id: `a${Date.now()}`,
              timestamp: new Date().toISOString().split('T')[0]
            })
          }
        }
      }
    }
  }
})

export const {
  setLoading,
  setError,
  addProject,
  updateProject,
  deleteProject,
  setSelectedProject,
  clearSelectedProject,
  addSpan,
  addNode,
  addActivity
} = projectsSlice.actions

export default projectsSlice.reducer
