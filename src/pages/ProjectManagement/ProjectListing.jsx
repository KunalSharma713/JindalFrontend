import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Eye, Calendar, User, Activity, ChevronDown, ChevronRight, MapPin, Settings } from 'lucide-react'
import { setSelectedProject } from '../../store/slices/projectsSlice'

const ProjectListing = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projects } = useSelector((state) => state.projects)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedItems, setExpandedItems] = useState(new Set())

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.assignedAreaManager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewProject = (project) => {
    dispatch(setSelectedProject(project))
    navigate(`/projects/${project.id}`)
  }

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'status-active',
      completed: 'status-active',
      'on-hold': 'status-pending',
      cancelled: 'status-inactive'
    }
    return statusStyles[status] || 'status-pending'
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

  const renderActivities = (activities) => {
    return activities.map((activity) => (
      <div key={activity.id} className="ml-8 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-4 w-4 text-blue-600" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">{activity.activity}</h4>
              <p className="text-xs text-gray-500">{activity.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(activity.status.toLowerCase())}`}>
              {activity.status}
            </span>
            <span className="text-xs text-gray-500">Assigned: {activity.assignedTo}</span>
            <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
          </div>
        </div>
      </div>
    ))
  }

  const renderNodes = (nodes, projectId, spanId) => {
    return nodes.map((node) => (
      <div key={node.id} className="ml-6 border-l-2 border-gray-200 pl-4">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mb-2">
          <div className="flex items-center space-x-3">
            <Settings className="h-5 w-5 text-purple-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{node.name}</h3>
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
              onClick={() => toggleExpanded(node.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {expandedItems.has(node.id) ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        {expandedItems.has(node.id) && (
          <div className="space-y-2">
            {renderActivities(node.activities)}
          </div>
        )}
      </div>
    ))
  }

  const renderSpans = (spans, projectId) => {
    return spans.map((span) => (
      <div key={span.id} className="ml-4 border-l-2 border-gray-200 pl-4">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mb-3">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{span.name}</h3>
              <p className="text-xs text-gray-500">{span.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${span.progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">{span.progress}%</span>
            </div>
            <button
              onClick={() => toggleExpanded(span.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {expandedItems.has(span.id) ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        {expandedItems.has(span.id) && (
          <div className="space-y-3">
            {renderNodes(span.nodes, projectId, span.id)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 sm:truncate">
            Project Listing
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and track all projects with their spans, nodes, and activities
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects or area managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Spans</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {projects.reduce((total, project) => total + project.spans.length, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Nodes</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {projects.reduce((total, project) => 
                  total + project.spans.reduce((spanTotal, span) => 
                    spanTotal + span.nodes.length, 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.reduce((total, project) => 
                  total + project.spans.reduce((spanTotal, span) => 
                    spanTotal + span.nodes.reduce((nodeTotal, node) => 
                      nodeTotal + node.activities.length, 0), 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Tree View */}
      <div className="space-y-3 sm:space-y-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="card p-4 sm:p-6">
            {/* Project Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{project.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-500">{project.description}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">{project.progress}%</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                  {project.status}
                </span>
                <button
                  onClick={() => toggleExpanded(project.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {expandedItems.has(project.id) ? (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-600 truncate">Manager: {project.assignedAreaManager}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-600">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 truncate">
                  Budget: {formatCurrency(project.budget)}
                </span>
              </div>
            </div>

            {/* Expandable Content */}
            {expandedItems.has(project.id) && (
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3 sm:space-y-4">
                  {renderSpans(project.spans, project.id)}
                </div>
                <div className="mt-4 flex flex-row justify-end">
                  <button
                    onClick={() => handleViewProject(project)}
                    className="btn-primary text-xs sm:text-sm inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2"
                  >
                    <Eye size={14} className="mr-2"/>
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="card p-12 text-center">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectListing
