import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Activity, 
  MapPin, 
  Settings, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  PlayCircle
} from 'lucide-react'

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects } = useSelector((state) => state.projects)
  const [selectedSpan, setSelectedSpan] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <div className="card p-12 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Project not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The project you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/projects')}
          className="btn-primary mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </button>
      </div>
    )
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in progress':
        return <PlayCircle className="h-4 w-4 text-blue-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'status-active',
      completed: 'status-active',
      'in progress': 'status-active',
      pending: 'status-pending',
      'on-hold': 'status-pending',
      cancelled: 'status-inactive'
    }
    return statusStyles[status.toLowerCase()] || 'status-pending'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateProjectProgress = () => {
    const totalSpans = project.spans.length
    if (totalSpans === 0) return 0
    
    const spanProgress = project.spans.reduce((total, span) => {
      const nodeProgress = span.nodes.reduce((nodeTotal, node) => {
        const activityProgress = node.activities.reduce((activityTotal, activity) => {
          return activityTotal + (activity.status.toLowerCase() === 'completed' ? 1 : 0)
        }, 0)
        return nodeTotal + (activityProgress / node.activities.length) * 100
      }, 0)
      return total + (nodeProgress / span.nodes.length)
    }, 0)
    
    return Math.round(spanProgress / totalSpans)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overall Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{calculateProjectProgress()}%</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Spans</p>
              <p className="text-2xl font-semibold text-gray-900">{project.spans.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Nodes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {project.spans.reduce((total, span) => total + span.nodes.length, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Budget Spent</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(project.spent)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Area Manager</p>
              <p className="text-sm text-gray-500">{project.assignedAreaManager}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Start Date</p>
              <p className="text-sm text-gray-500">{formatDate(project.startDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">End Date</p>
              <p className="text-sm text-gray-500">{formatDate(project.endDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Total Budget</p>
              <p className="text-sm text-gray-500">{formatCurrency(project.budget)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spans and Nodes */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Project Structure</h2>
        
        {project.spans.map((span) => (
          <div key={span.id} className="card p-6">
            {/* Span Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{span.name}</h3>
                  <p className="text-sm text-gray-500">{span.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${span.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{span.progress}%</span>
                </div>
                <button
                  onClick={() => setSelectedSpan(selectedSpan === span.id ? null : span.id)}
                  className="btn-secondary"
                >
                  {selectedSpan === span.id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>

            {/* Span Details */}
            {selectedSpan === span.id && (
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(span.startDate)} - {formatDate(span.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {span.nodes.length} Nodes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {span.nodes.reduce((total, node) => total + node.activities.length, 0)} Activities
                    </span>
                  </div>
                </div>

                {/* Nodes */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Nodes</h4>
                  {span.nodes.map((node) => (
                    <div key={node.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Settings className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900">{node.name}</h5>
                            <p className="text-xs text-gray-500">{node.gp} • {node.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${node.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{node.progress}%</span>
                          </div>
                          <button
                            onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            {selectedNode === node.id ? 'Hide Activities' : 'Show Activities'}
                          </button>
                        </div>
                      </div>

                      {/* Activities */}
                      {selectedNode === node.id && (
                        <div className="border-t border-gray-200 pt-3 space-y-2">
                          <h6 className="text-sm font-medium text-gray-900">Activities</h6>
                          {node.activities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                {getStatusIcon(activity.status)}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                                  <p className="text-xs text-gray-500">{activity.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(activity.status)}`}>
                                  {activity.status}
                                </span>
                                <span className="text-xs text-gray-500">Assigned: {activity.assignedTo}</span>
                                <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectDetails
