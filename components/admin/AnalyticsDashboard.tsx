import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  FileText,
  Briefcase,
  GraduationCap,
  Star,
  Activity
} from 'lucide-react';
import { projectService, type ProjectData } from '../lib/adminService';
import { blogService, type BlogData } from '../lib/adminService';
import { experienceService, type ExperienceData } from '../lib/adminService';
import { educationService, type EducationData } from '../lib/adminService';

interface AnalyticsData {
  totalProjects: number;
  featuredProjects: number;
  totalBlogPosts: number;
  publishedPosts: number;
  totalExperience: number;
  totalEducation: number;
  recentActivity: ActivityItem[];
  categoryBreakdown: CategoryData[];
  monthlyStats: MonthlyStats[];
}

interface ActivityItem {
  id: string;
  type: 'project' | 'blog' | 'experience' | 'education';
  title: string;
  action: 'created' | 'updated' | 'deleted' | 'published';
  timestamp: Date;
}

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

interface MonthlyStats {
  month: string;
  projects: number;
  blogPosts: number;
  views: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [projects, blogPosts, experiences, education] = await Promise.all([
        projectService.getAll(),
        blogService.getAll(),
        experienceService.getAll(),
        educationService.getAll(),
      ]);

      // Calculate analytics
      const totalProjects = projects.length;
      const featuredProjects = projects.filter(p => p.featured).length;
      const totalBlogPosts = blogPosts.length;
      const publishedPosts = blogPosts.filter(p => p.published).length;
      const totalExperience = experiences.length;
      const totalEducation = education.length;

      // Category breakdown
      const categoryMap = new Map<string, number>();
      projects.forEach(project => {
        const category = project.category || 'Other';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / totalProjects) * 100),
      }));

      // Recent activity (mock data for now)
      const recentActivity: ActivityItem[] = [
        {
          id: '1',
          type: 'project',
          title: 'Latest Project',
          action: 'created',
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'blog',
          title: 'New Blog Post',
          action: 'published',
          timestamp: new Date(Date.now() - 86400000),
        },
      ];

      // Monthly stats (mock data for now)
      const monthlyStats: MonthlyStats[] = [
        { month: 'Jan', projects: 2, blogPosts: 1, views: 150 },
        { month: 'Feb', projects: 3, blogPosts: 2, views: 200 },
        { month: 'Mar', projects: 1, blogPosts: 3, views: 180 },
        { month: 'Apr', projects: 4, blogPosts: 2, views: 250 },
      ];

      setAnalyticsData({
        totalProjects,
        featuredProjects,
        totalBlogPosts,
        publishedPosts,
        totalExperience,
        totalEducation,
        recentActivity,
        categoryBreakdown,
        monthlyStats,
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-text-muted">Loading analytics...</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No analytics data available</p>
      </div>
    );
  }

  const {
    totalProjects,
    featuredProjects,
    totalBlogPosts,
    publishedPosts,
    totalExperience,
    totalEducation,
    recentActivity,
    categoryBreakdown,
    monthlyStats,
  } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-text mb-2">Analytics Dashboard</h3>
          <p className="text-text-muted">Track your portfolio performance and insights</p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-light/5 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Total Projects</p>
              <p className="text-2xl font-bold text-text">{totalProjects}</p>
            </div>
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-text-secondary">
              {featuredProjects} featured ({Math.round((featuredProjects / totalProjects) * 100)}%)
            </p>
          </div>
        </div>

        <div className="bg-bg-light/5 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Blog Posts</p>
              <p className="text-2xl font-bold text-text">{totalBlogPosts}</p>
            </div>
            <FileText className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-text-secondary">
              {publishedPosts} published ({Math.round((publishedPosts / totalBlogPosts) * 100)}%)
            </p>
          </div>
        </div>

        <div className="bg-bg-light/5 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Experience</p>
              <p className="text-2xl font-bold text-text">{totalExperience}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-text-secondary">Professional entries</p>
          </div>
        </div>

        <div className="bg-bg-light/5 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Education</p>
              <p className="text-2xl font-bold text-text">{totalEducation}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-text-secondary">Academic entries</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-light/5 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-text mb-4">Project Categories</h4>
          <div className="space-y-3">
            {categoryBreakdown.map((category) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-text-secondary">{category.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-surface-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-text-muted w-8 text-right">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-light/5 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-text mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium text-text">{activity.title}</span> was {activity.action}
                  </p>
                  <p className="text-xs text-text-muted">
                    {activity.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Stats Chart */}
      <div className="bg-bg-light/5 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
        <h4 className="text-lg font-semibold text-text mb-4">Monthly Activity</h4>
        <div className="grid grid-cols-4 gap-4">
          {monthlyStats.map((stat) => (
            <div key={stat.month} className="text-center">
              <p className="text-sm font-medium text-text-secondary">{stat.month}</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-text-muted">Projects: {stat.projects}</p>
                <p className="text-xs text-text-muted">Posts: {stat.blogPosts}</p>
                <p className="text-xs text-text-muted">Views: {stat.views}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 