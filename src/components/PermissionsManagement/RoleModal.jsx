import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { X } from 'lucide-react'
import { addRole, updateRole, clearSelectedRole } from '../../store/slices/permissionsSlice'

const schema = yup.object({
  name: yup.string().required('Role name is required'),
  description: yup.string().required('Description is required'),
})

const RoleModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { selectedRole, permissions } = useSelector((state) => state.permissions)
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const isEditing = !!selectedRole

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  useEffect(() => {
    if (selectedRole) {
      reset(selectedRole)
      setSelectedPermissions(selectedRole.permissions || [])
    } else {
      reset({
        name: '',
        description: ''
      })
      setSelectedPermissions([])
    }
  }, [selectedRole, reset])

  const onSubmit = async (data) => {
    try {
      const roleData = {
        ...data,
        permissions: selectedPermissions
      }

      if (isEditing) {
        dispatch(updateRole({ ...selectedRole, ...roleData }))
      } else {
        dispatch(addRole(roleData))
      }
      handleClose()
    } catch (error) {
      console.error('Error saving role:', error)
    }
  }

  const handleClose = () => {
    dispatch(clearSelectedRole())
    reset()
    setSelectedPermissions([])
    onClose()
  }

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId)
      } else {
        return [...prev, permissionId]
      }
    })
  }

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {})

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit Role' : 'Add New Role'}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                  placeholder="Enter role name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className={`input-field ${errors.description ? 'border-red-300' : ''}`}
                  placeholder="Enter role description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Permissions
                </label>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">{category}</h4>
                      <div className="space-y-2">
                        {categoryPermissions.map((permission) => (
                          <label key={permission.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {permission.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Saving...' : (isEditing ? 'Update Role' : 'Add Role')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleModal
