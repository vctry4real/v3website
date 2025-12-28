import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Calendar, Clock, Tag, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { SearchFilter, useSearchFilter } from '../ui/SearchFilter';
import { BlogForm } from './BlogForm';
import { blogService, type BlogData } from '../lib/adminService';
import toast from 'react-hot-toast';

interface BlogListProps {
  onSave?: () => void;
}

export const BlogList: React.FC<BlogListProps> = ({ onSave }) => {
  const [blogPosts, setBlogPosts] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<BlogData | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Search and filter functionality
  const {
    searchValue,
    setSearchValue,
    activeFilters,
    setActiveFilters,
    filteredData: filteredBlogPosts,
    filterOptions,
  } = useSearchFilter(blogPosts, ['title', 'summary', 'content'], 'featured');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const data = await blogService.getAll();
      setBlogPosts(data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blogPost: BlogData) => {
    setEditingItem(blogPost);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.delete(id);
        toast.success('Blog post deleted successfully!');
        fetchBlogPosts();
        onSave?.();
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchBlogPosts();
    onSave?.();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading blog posts...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <BlogForm
        editingItem={editingItem || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
        onBackToList={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6 overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Blog Posts</h3>
          <p className="text-gray-400">Manage your blog posts and share your insights</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Blog Post
        </Button>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        placeholder="Search blog posts by title, summary, or content..."
      />

      {/* Results Summary */}
      {blogPosts.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredBlogPosts.length} of {blogPosts.length} blog posts
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

      {/* Blog Posts List */}
      {blogPosts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No blog posts yet</h3>
          <p className="text-gray-400 mb-6">Add your first blog post to share your insights</p>
          <Button onClick={() => setShowForm(true)}>
            Add Your First Blog Post
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBlogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4 mb-3">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-semibold text-white">{post.title}</h4>
                        {post.featured && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{post.summary}</p>
                    </div>
                  </div>
                  
                  {/* Meta Information */}
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    {post.createdAt && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.createdAt)}
                      </div>
                    )}
                    {post.readTime && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id!)}
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