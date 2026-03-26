import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Activity, Plus, Edit, Trash2 } from 'lucide-react'

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'create':
        return <Plus className="w-4 h-4 text-green-600" />
      case 'update':
        return <Edit className="w-4 h-4 text-blue-600" />
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Activity</h3>
        <p className="text-xs sm:text-sm text-gray-500">Latest actions performed in the system</p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {activities?.slice(0, 10).map((activity) => (
          <div key={activity.id} className="flex items-start space-x-2 sm:space-x-3">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span> {activity.action}
                {activity.target && (
                  <span className="font-medium text-blue-600"> {activity.target}</span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {activity.timestamp && !isNaN(new Date(activity.timestamp))
                  ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
                  : 'Unknown time'
                }
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 sm:mt-6">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all activity
        </button>
      </div>
    </div>
  )
}

export default RecentActivity
