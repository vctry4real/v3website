import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, ExternalLink, Github, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { SearchFilter, useSearchFilter } from '../ui/SearchFilter';
import { ProjectForm } from './ProjectForm';
import { projectService, type ProjectData } from '../lib/adminService';
import toast from 'react-hot-toast';

interface ProjectListProps {
  onSave?: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onSave }) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ProjectData | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Search and filter functionality
  const {
    searchValue,
    setSearchValue,
    activeFilters,
    setActiveFilters,
    filteredData: filteredProjects,
    filterOptions,
  } = useSearchFilter(projects, ['title', 'description', 'content'], 'category');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: ProjectData) => {
    setEditingItem(project);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.delete(id);
        toast.success('Project deleted successfully!');
        fetchProjects();
        onSave?.();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchProjects();
    onSave?.();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading projects...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <ProjectForm
        editingItem={editingItem || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6 overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Projects</h3>
          <p className="text-gray-400">Manage your portfolio projects and showcase your work</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        placeholder="Search projects by title, description, or content..."
      />

      {/* Results Summary */}
      {projects.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredProjects.length} of {projects.length} projects
            {(searchValue || activeFilters.length > 0) && ' (filtered)'}
          </span>
          {(searchValue || activeFilters.length > 0) && (
            <button
              onClick={() => {
                setSearchValue('');
                setActiveFilters([]);
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6">Add your first project to showcase your work</p>
          <Button onClick={() => setShowForm(true)}>
            Add Your First Project
          </Button>
        </div>
      ) : (
                 <div className="space-y-4">
           {filteredProjects.map((project) => (
             <div
               key={project.id}
               className="bg-gray-800 rounded-lg p-4 sm:p-6 hover:bg-gray-750 transition-colors duration-200"
             >
               <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                 <div className="flex-1 min-w-0">
                   <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-3">
                     {project.image && (
                       <img
                         src={project.image}
                         alt={project.title}
                         className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                       />
                     )}
                     <div className="flex-1 min-w-0">
                       <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                         <h4 className="text-lg font-semibold text-white truncate">{project.title}</h4>
                         {project.featured && (
                           <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex-shrink-0">
                             Featured
                           </span>
                         )}
                       </div>
                       <p className="text-gray-400 text-sm mb-2">{project.category}</p>
                       <p className="text-gray-300 text-sm">{project.description}</p>
                     </div>
                   </div>
                   
                   {/* Tech Stack */}
                   {project.tech && project.tech.length > 0 && (
                     <div className="flex flex-wrap gap-2 mb-3">
                       {project.tech.map((tech, index) => (
                         <span
                           key={index}
                           className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                         >
                           {tech}
                         </span>
                       ))}
                     </div>
                   )}
                   
                   {/* Links */}
                   <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                     {project.github && (
                       <a
                         href={project.github}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center text-gray-400 hover:text-white transition-colors"
                       >
                         <Github className="w-4 h-4 mr-1" />
                         GitHub
                       </a>
                     )}
                     {project.live && (
                       <a
                         href={project.live}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center text-gray-400 hover:text-white transition-colors"
                       >
                         <ExternalLink className="w-4 h-4 mr-1" />
                         Live Demo
                       </a>
                     )}
                   </div>
                 </div>
                 
                 <div className="flex items-center space-x-2 lg:ml-4">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => handleEdit(project)}
                   >
                     <Edit className="w-4 h-4" />
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => handleDelete(project.id!)}
                     className="text-red-400 hover:text-red-300"
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                 </div>
               </div>
             </div>
           ))}
         </div>
      )}
    </div>
  );
}; 