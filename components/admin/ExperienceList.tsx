import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Calendar, MapPin, Building } from 'lucide-react';
import { Button } from '../ui/Button';
import { ExperienceForm } from './ExperienceForm';
import { experienceService, type ExperienceData } from '../lib/adminService';
import toast from 'react-hot-toast';

interface ExperienceListProps {
  onSave?: () => void;
}

export const ExperienceList: React.FC<ExperienceListProps> = ({ onSave }) => {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ExperienceData | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await experienceService.getAll();
      setExperiences(data);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience: ExperienceData) => {
    setEditingItem(experience);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await experienceService.delete(id);
        toast.success('Experience deleted successfully!');
        fetchExperiences();
        onSave?.();
      } catch (error) {
        toast.error('Failed to delete experience');
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchExperiences();
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
        <p className="text-gray-400">Loading experiences...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <ExperienceForm
        editingItem={editingItem || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6 overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-text mb-2">Work Experience</h3>
          <p className="text-text-muted">Manage your professional experience entries</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Experiences List */}
      {experiences.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">No experiences yet</h3>
          <p className="text-text-muted mb-6">Add your first work experience to get started</p>
          <Button onClick={() => setShowForm(true)}>
            Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="bg-bg-light/5 border border-border/50 rounded-xl p-6 hover:bg-bg-light/10 transition-all duration-200 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {experience.logo && (
                      <img
                        src={experience.logo}
                        alt={experience.company}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-text">{experience.position}</h4>
                      <p className="text-primary font-medium">{experience.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-text-muted mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {experience.duration}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {experience.location}
                    </div>
                  </div>

                  <p className="text-text-secondary mb-3">{experience.description}</p>

                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {experience.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-surface-muted text-text-muted text-xs rounded border border-border-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(experience)}
                    className="border-border hover:bg-surface-muted text-text-muted hover:text-text"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(experience.id!)}
                    className="text-error hover:text-error/80 border-error/30 hover:bg-error/10 hover:border-error"
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