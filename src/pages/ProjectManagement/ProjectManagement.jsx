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
    <div className="space-y-6">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Project Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage projects, track progress, and assign team members.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={handleAddProject}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {/* Project stats */}
      <ProjectStats projects={projects} />

      {/* Search and filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
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
