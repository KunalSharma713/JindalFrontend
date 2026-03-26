import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, FolderOpen, Shield, Settings } from 'lucide-react'

const QuickActions = () => {
  const navigate = useNavigate()

  const actions = [
    {
      name: 'Add New User',
      description: 'Create a new user account',
      icon: Users,
      onClick: () => navigate('/users')
    },
    {
      name: 'Create Project',
      description: 'Start a new project',
      icon: FolderOpen,
      onClick: () => navigate('/projects')
    },
    {
      name: 'Manage Permissions',
      description: 'Configure user roles',
      icon: Shield,
      onClick: () => navigate('/permissions')
    },
    {
      name: 'System Settings',
      description: 'Configure system settings',
      icon: Settings,
      onClick: () => navigate('/profile')
    }
  ]

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-medium text-gray-900">Quick Actions</h3>
        <p className="text-xs sm:text-sm text-gray-500">Common tasks and shortcuts</p>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        {actions.map((action) => {
          const Icon = action.icon
          
          return (
            <button
              key={action.name}
              onClick={action.onClick}
              className="w-full flex items-center p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{action.name}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
