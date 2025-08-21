import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ArrowLeft, Calendar, Users, DollarSign, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react'
import { clearSelectedProject } from '../../store/slices/projectsSlice'

const ProjectDetailView = ({ project, onBack }) => {
  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.users)

  const getAssignedUsers = (assignedUserIds) => {
    return users.filter(user => assignedUserIds.includes(user.id))
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <Play className="w-4 h-4 text-blue-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'in-progress':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const assignedUsers = getAssignedUsers(project.assignedUsers)
  const budgetUsed = (project.spent / project.budget) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={getStatusBadge(project.status)}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Team Size</p>
              <p className="text-lg font-semibold text-gray-900">{assignedUsers.length} members</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p className="text-lg font-semibold text-gray-900">
                ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="text-lg font-semibold text-gray-900">{project.progress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members</h3>
        <div className="flex flex-wrap gap-4">
          {assignedUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <img
                className="h-8 w-8 rounded-full"
                src={user.avatar}
                alt={user.name}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Spans */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Spans</h3>
        <div className="space-y-6">
          {project.spans?.map((span) => (
            <div key={span.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-md font-medium text-gray-900">{span.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(span.startDate).toLocaleDateString()} - {new Date(span.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${span.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{span.progress}%</span>
                </div>
              </div>

              {/* Activity Nodes */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">Activity Nodes</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {span.activities?.map((activity) => (
                    <div key={activity.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-primary-500">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(activity.status)}
                          <span className="text-sm font-medium text-gray-900">{activity.name}</span>
                        </div>
                        <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                          {activity.gp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={getStatusBadge(activity.status)}>
                          {activity.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Visualization */}
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Timeline</h5>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  <div className="space-y-4">
                    {span.activities?.map((activity, index) => (
                      <div key={activity.id} className="relative flex items-center">
                        <div className={`absolute left-2 w-4 h-4 rounded-full border-2 border-white ${
                          activity.status === 'completed' ? 'bg-green-500' :
                          activity.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}></div>
                        <div className="ml-10 flex-1 bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                              <p className="text-xs text-gray-500">{activity.gp}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                              <span className={getStatusBadge(activity.status)}>
                                {activity.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailView
