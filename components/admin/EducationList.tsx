import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Calendar, MapPin, Award, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';
import { EducationForm } from './EducationForm';
import { educationService, type EducationData } from '../lib/adminService';
import toast from 'react-hot-toast';

interface EducationListProps {
  onSave?: () => void;
}

export const EducationList: React.FC<EducationListProps> = ({ onSave }) => {
  const [education, setEducation] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<EducationData | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const data = await educationService.getAll();
      setEducation(data);
    } catch (error) {
      console.error('Failed to fetch education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (educationItem: EducationData) => {
    setEditingItem(educationItem);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await educationService.delete(id);
        toast.success('Education entry deleted successfully!');
        fetchEducation();
        onSave?.();
      } catch (error) {
        toast.error('Failed to delete education entry');
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchEducation();
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
        <p className="text-gray-400">Loading education...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <EducationForm
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
          <h3 className="text-2xl font-bold text-text mb-2">Education</h3>
          <p className="text-text-muted">Manage your academic background and certifications</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {/* Education List */}
      {education.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">No education entries yet</h3>
          <p className="text-text-muted mb-6">Add your first education entry to get started</p>
          <Button onClick={() => setShowForm(true)}>
            Add Your First Education Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="bg-bg-light/5 border border-border/50 rounded-xl p-6 hover:bg-bg-light/10 transition-all duration-200 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {edu.logo && (
                      <img
                        src={edu.logo}
                        alt={edu.university}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-text">{edu.degree}</h4>
                      <p className="text-primary font-medium">{edu.university}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-text-muted mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {edu.duration}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {edu.location}
                    </div>
                    {edu.gpa && (
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        {edu.gpa}
                      </div>
                    )}
                  </div>

                  <p className="text-text-secondary mb-3">{edu.description}</p>

                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-text-muted mb-2">Achievements:</p>
                      <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                        {edu.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(edu)}
                    className="border-border hover:bg-surface-muted text-text-muted hover:text-text"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(edu.id!)}
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