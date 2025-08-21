import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { X } from 'lucide-react'
import { addProject, updateProject, clearSelectedProject } from '../../store/slices/projectsSlice'

const schema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string().required('Description is required'),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required'),
  budget: yup.number().positive('Budget must be positive').required('Budget is required'),
  endDate: yup.string().required('End date is required'),
})

const ProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { selectedProject } = useSelector((state) => state.projects)
  const { users } = useSelector((state) => state.users)
  const isEditing = !!selectedProject

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      priority: 'medium',
      progress: 0,
      budget: 0,
      spent: 0,
      endDate: '',
      assignedUsers: []
    }
  })

  useEffect(() => {
    if (selectedProject) {
      reset(selectedProject)
    } else {
      reset({
        name: '',
        description: '',
        status: 'active',
        priority: 'medium',
        progress: 0,
        budget: 0,
        spent: 0,
        endDate: '',
        assignedUsers: []
      })
    }
  }, [selectedProject, reset])

  const onSubmit = async (data) => {
    try {
      const projectData = {
        ...data,
        budget: Number(data.budget),
        spent: Number(data.spent || 0),
        progress: Number(data.progress || 0),
        assignedUsers: Array.isArray(data.assignedUsers) ? data.assignedUsers : []
      }

      if (isEditing) {
        dispatch(updateProject({ ...selectedProject, ...projectData }))
      } else {
        dispatch(addProject(projectData))
      }
      handleClose()
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleClose = () => {
    dispatch(clearSelectedProject())
    reset()
    onClose()
  }

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
                {isEditing ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                    placeholder="Enter project name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className={`input-field ${errors.endDate ? 'border-red-300' : ''}`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className={`input-field ${errors.description ? 'border-red-300' : ''}`}
                  placeholder="Enter project description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className={`input-field ${errors.status ? 'border-red-300' : ''}`}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    {...register('priority')}
                    className={`input-field ${errors.priority ? 'border-red-300' : ''}`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    {...register('progress')}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('budget')}
                    className={`input-field ${errors.budget ? 'border-red-300' : ''}`}
                    placeholder="Enter budget"
                  />
                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Spent ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('spent')}
                    className="input-field"
                    placeholder="Enter amount spent"
                  />
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
                  {isSubmitting ? 'Saving...' : (isEditing ? 'Update Project' : 'Add Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
