import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { addUser, updateUser, clearSelectedUser } from '../../store/slices/usersSlice'
import { useApi } from '../../hooks/useApi'

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().when('$isEditing', (isEditing, schema) => {
    return isEditing ? schema.notRequired() : schema.required('Password is required').min(8, 'Password must be at least 8 characters');
  }),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  mobile_no: yup.string().required('Mobile number is required').matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
})

const UserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { selectedUser } = useSelector((state) => state.users)
  const { apiRequest, loading } = useApi()
  const isEditing = !!selectedUser

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    context: { isEditing },
    defaultValues: {
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      mobile_no: '',
    }
  })

  useEffect(() => {
    if (selectedUser) {
      reset({ ...selectedUser, password: '' });
    } else {
      reset({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        mobile_no: '',
      })
    }
  }, [selectedUser, reset])

  const onSubmit = async (data) => {
    try {
      // Get the selected plant ID from localStorage
      const selectedPlantId = localStorage.getItem('selectedPlantId');
      if (!selectedPlantId) {
        throw new Error('No plant selected');
      }

      const payload = { 
        ...data, 
        roleid: "68a3028131afd421fe6313ca",
        warehouse: selectedPlantId, 
      };
      
      if (isEditing && !payload.password) {
        delete payload.password;
      }

      if (isEditing) {
        // For editing, use the _id from selectedUser
        const response = await apiRequest(`user/${selectedUser._id}`, "PUT", true);
        const transformedUser = {
          ...response,
          name: `${response.first_name} ${response.last_name}`,
          avatar: response.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80'
        };
        dispatch(updateUser({ ...selectedUser, ...transformedUser }));
        toast.success('User updated successfully!');
      } else {
        const response = await apiRequest("user/", "POST", payload, true);
        const transformedUser = {
          ...response,
          name: `${response.first_name} ${response.last_name}`,
          status: 'active',
          avatar: response.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80'
        };
        dispatch(addUser(transformedUser));
        toast.success('User added successfully!');
      }

      handleClose()
    } catch (error) {
      console.error('Error saving user:', error)
      toast.error(error.message || 'Failed to save user');
    }
  }

  const handleClose = () => {
    dispatch(clearSelectedUser())
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit User' : 'Add New User'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input type="text" {...register('username')} className={`input-field ${errors.username ? 'border-red-300' : ''}`} placeholder="Enter username" />
                  {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" {...register('email')} className={`input-field ${errors.email ? 'border-red-300' : ''}`} placeholder="Enter email address" />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" {...register('first_name')} className={`input-field ${errors.first_name ? 'border-red-300' : ''}`} placeholder="Enter first name" />
                  {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" {...register('last_name')} className={`input-field ${errors.last_name ? 'border-red-300' : ''}`} placeholder="Enter last name" />
                  {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input type="text" {...register('mobile_no')} className={`input-field ${errors.mobile_no ? 'border-red-300' : ''}`} placeholder="Enter mobile number" />
                  {errors.mobile_no && <p className="mt-1 text-sm text-red-600">{errors.mobile_no.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" {...register('password')} className={`input-field ${errors.password ? 'border-red-300' : ''}`} placeholder={isEditing ? 'New password (optional)' : 'Enter password'} />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={handleClose} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : (isEditing ? 'Update User' : 'Add User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserModal
