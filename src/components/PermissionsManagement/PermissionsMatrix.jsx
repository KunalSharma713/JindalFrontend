import React from 'react'
import { Check, X } from 'lucide-react'

const PermissionsMatrix = ({ roles, permissions }) => {
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {})

  const hasPermission = (role, permissionId) => {
    return role.permissions.includes('all') || role.permissions.includes(permissionId)
  }

  const getRoleBadge = (roleName) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    
    switch (roleName) {
      case 'Super Admin':
        return `${baseClasses} bg-purple-100 text-purple-800`
      case 'Admin':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'User':
        return `${baseClasses} bg-gray-100 text-gray-800`
      default:
        return `${baseClasses} bg-green-100 text-green-800`
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-medium text-gray-900">Permissions Matrix</h3>
        <p className="text-xs sm:text-sm text-gray-500">View permissions assigned to each role</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                Permission
              </th>
              {roles.map((role) => (
                <th key={role.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                  <span className={getRoleBadge(role.name)}>
                    {role.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
              <React.Fragment key={category}>
                <tr className="bg-gray-100">
                  <td colSpan={roles.length + 1} className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-900 sticky left-0 bg-gray-100 z-10">
                    {category}
                  </td>
                </tr>
                {categoryPermissions.map((permission, index) => (
                  <tr key={permission.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 sticky left-0 bg-inherit z-10 border-r border-gray-200">
                      <div>
                        <div className="font-medium">{permission.name}</div>
                        <div className="text-xs text-gray-500">{permission.id}</div>
                      </div>
                    </td>
                    {roles.map((role) => (
                      <td key={role.id} className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                        {hasPermission(role, permission.id) ? (
                          <div className="flex justify-center">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                              <X className="w-4 h-4 text-red-600" />
                            </div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PermissionsMatrix
