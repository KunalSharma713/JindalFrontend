import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Plus, Search, Filter } from 'lucide-react'
import { setSelectedProject } from '../../store/slices/projectsSlice'
import ProjectTable from '../../components/ProjectManagement/ProjectTable'
import ProjectModal from '../../components/ProjectManagement/ProjectModal'
import ProjectFilters from '../../components/ProjectManagement/ProjectFilters'
import ProjectStats from '../../components/ProjectManagement/ProjectStats'
import ProjectDetailView from '../../components/ProjectManagement/ProjectDetailView'

const ProjectManagement = () => {
  const dispatch = useDispatch()
  const { projects, loading, selectedProject } = useSelector((state) => state.projects)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'detail'

  const handleAddProject = () => {
    dispatch(setSelectedProject(null))
    setIsModalOpen(true)
  }

  const handleEditProject = (project) => {
    dispatch(setSelectedProject(project))
    setIsModalOpen(true)
  }

  const handleViewProject = (project) => {
    dispatch(setSelectedProject(project))
    setViewMode('detail')
  }

  const handleBackToList = () => {
    dispatch(setSelectedProject(null))
    setViewMode('list')
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filters.status === 'all' || project.status === filters.status
    const matchesPriority = filters.priority === 'all' || project.priority === filters.priority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Show detail view if a project is selected and viewMode is 'detail'
  if (viewMode === 'detail' && selectedProject) {
    return <ProjectDetailView project={selectedProject} onBack={handleBackToList} />
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-7 text-gray-900 sm:truncate">
            Project Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage projects, track progress, and assign team members.
          </p>
        </div>
        <div className="flex sm:mt-0 sm:ml-4">
          <button
            onClick={handleAddProject}
            className="btn-primary flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {/* Project stats */}
      <ProjectStats projects={projects} />

      {/* Search and filters */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9 sm:pl-10 text-sm"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
          >
            <Filter className="w-4 h-4 mr-1 sm:mr-2" />
            Filters
          </button>
        </div>
        
        {showFilters && (
          <ProjectFilters 
            filters={filters} 
            setFilters={setFilters} 
          />
        )}
      </div>

      {/* Projects table */}
      <ProjectTable 
        projects={filteredProjects}
        onEditProject={handleEditProject}
        onViewProject={handleViewProject}
        loading={loading}
      />

      {/* Project modal */}
      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default ProjectManagement
