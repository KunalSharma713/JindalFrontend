import React from 'react'
import { FolderOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const ProjectStats = ({ projects }) => {
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const onHoldProjects = projects.filter(p => p.status === 'on-hold').length
  
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const stats = [
    {
      name: 'Total Projects',
      value: totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Projects',
      value: activeProjects,
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      name: 'Completed',
      value: completedProjects,
      icon: CheckCircle,
      color: 'bg-purple-500'
    },
    {
      name: 'Budget Used',
      value: `${budgetUtilization.toFixed(1)}%`,
      icon: AlertCircle,
      color: budgetUtilization > 80 ? 'bg-red-500' : 'bg-yellow-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        
        return (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProjectStats
