import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Plus, Shield, Users, Settings } from 'lucide-react'
import { setSelectedRole } from '../../store/slices/permissionsSlice'
import RoleTable from '../../components/PermissionsManagement/RoleTable'
import RoleModal from '../../components/PermissionsManagement/RoleModal'
import PermissionsMatrix from '../../components/PermissionsManagement/PermissionsMatrix'

const PermissionsManagement = () => {
  const dispatch = useDispatch()
  const { roles, permissions } = useSelector((state) => state.permissions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('roles')

  const handleAddRole = () => {
    dispatch(setSelectedRole(null))
    setIsModalOpen(true)
  }

  const handleEditRole = (role) => {
    dispatch(setSelectedRole(role))
    setIsModalOpen(true)
  }

  const tabs = [
    { id: 'roles', name: 'Roles', icon: Shield },
    { id: 'permissions', name: 'Permissions Matrix', icon: Settings }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-7 text-gray-900 sm:truncate">
            Permissions Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage roles, permissions, and access control across your platform.
          </p>
        </div>
        {activeTab === 'roles' && (
          <div className="flex sm:mt-0 sm:ml-4">
            <button
              onClick={handleAddRole}
              className="btn-primary flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 mr-1 sm:mr-2" />
              Add Role
            </button>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Roles</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Permissions</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{permissions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Users with Roles</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'roles' && (
        <RoleTable 
          roles={roles}
          onEditRole={handleEditRole}
        />
      )}

      {activeTab === 'permissions' && (
        <PermissionsMatrix 
          roles={roles}
          permissions={permissions}
        />
      )}

      {/* Role modal */}
      <RoleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default PermissionsManagement
