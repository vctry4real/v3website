import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { SkillsForm } from './SkillsForm';
import { skillsService, type SkillData } from '../lib/adminService';
import toast from 'react-hot-toast';

export const SkillsList: React.FC = () => {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillData | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await skillsService.getAll();
      setSkills(data);
    } catch (error) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: SkillData) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillsService.delete(id);
        await loadSkills();
        toast.success('Skill deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete skill');
      }
    }
  };

  const handleSave = async () => {
    setShowForm(false);
    setEditingSkill(null);
    await loadSkills();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: 'bg-blue-100 text-blue-800',
      backend: 'bg-green-100 text-green-800',
      database: 'bg-purple-100 text-purple-800',
      tools: 'bg-orange-100 text-orange-800',
      design: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
          </h3>
          <Button variant="outline" onClick={handleCancel}>
            Back to List
          </Button>
        </div>
        <SkillsForm
          editingItem={editingSkill || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">Skills Management</h3>
        <Button onClick={() => setShowForm(true)} className="flex items-center w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No skills added yet. Add your first skill to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 min-w-max">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h4 className="text-white font-medium truncate">{skill.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                        {skill.category}
                      </span>
                      <span className="text-gray-400 text-sm">Order: {skill.order_index}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Skill Level:</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-white font-medium w-12 text-right">
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 sm:ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(skill)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => skill.id && handleDelete(skill.id)}
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