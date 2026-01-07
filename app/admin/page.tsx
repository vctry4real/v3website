"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/hooks/useAuth';
import {
    Settings,
    Plus,
    FileText,
    Save,
    Eye,
    EyeOff,
    User,
    Briefcase,
    GraduationCap,
    Home,
    FileImage,
    FileText as FileTextIcon,
    Edit,
    Trash2,
    Plus as PlusIcon,
    BarChart3,
    Database,
    Mail,
    Bell,
    Calendar,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
    heroSchema,
    aboutSchema,
    experienceSchema,
    educationSchema,
    projectSchema,
    blogSchema,
    profileImageSchema,
    resumeSchema,
    type HeroFormData,
    type AboutFormData,
    type ExperienceFormData,
    type EducationFormData,
    type ProjectFormData,
    type BlogFormData,
    type ProfileImageFormData,
    type ResumeFormData,
    type AdminTab
} from '../../types/admin';
import { HeroForm } from '../../components/admin/HeroForm';
import { AboutForm } from '../../components/admin/AboutForm';
import { ExperienceList } from '../../components/admin/ExperienceList';
import { EducationList } from '../../components/admin/EducationList';
import { ProjectList } from '../../components/admin/ProjectList';
import { BlogList } from '../../components/admin/BlogList';
import { ProfileImageForm } from '../../components/admin/ProfileImageForm';
import { ResumeForm } from '../../components/admin/ResumeForm';
import { SkillsList } from '../../components/admin/SkillsList';
import { ContactMessagesList } from '../../components/admin/ContactMessagesList';
import { EmailNotificationSettings } from '../../components/admin/EmailNotificationSettings';
import { AppointmentList } from '../../components/admin/AppointmentList';
import { LoginForm } from '../../components/admin/LoginForm';
import { AnalyticsDashboard } from '../../components/admin/AnalyticsDashboard';
import { DataExportImport } from '../../components/admin/DataExportImport';
import {
    heroService,
    aboutService,
    experienceService,
    educationService,
    projectService,
    blogService,
    profileImageService,
    resumeService,
    appointmentService,
    contactMessagesService,
    type ExperienceData,
    type EducationData,
    type ProjectData,
    type BlogData
} from '../../components/lib/adminService';
import Link from 'next/link';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('hero');
    const [showPreview, setShowPreview] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [editingItem, setEditingItem] = useState<any>(null);
    const [currentHeroData, setCurrentHeroData] = useState<HeroFormData | null>(null);
    const [currentAboutData, setCurrentAboutData] = useState<AboutFormData | null>(null);
    const [currentExperiences, setCurrentExperiences] = useState<ExperienceData[]>([]);
    const [currentEducation, setCurrentEducation] = useState<EducationData[]>([]);
    const [currentProjects, setCurrentProjects] = useState<ProjectData[]>([]);
    const [currentBlogPosts, setCurrentBlogPosts] = useState<BlogData[]>([]);
    const [currentContactMessages, setCurrentContactMessages] = useState<any[]>([]);
    const [currentAppointments, setCurrentAppointments] = useState<any[]>([]);
    const [currentProfileImage, setCurrentProfileImage] = useState<ProfileImageFormData | null>(null);
    const [currentResume, setCurrentResume] = useState<ResumeFormData | null>(null);

    // Form instances for each section
    const heroForm = useForm<HeroFormData>({
        resolver: zodResolver(heroSchema),
        defaultValues: currentHeroData || {
            name: 'Victory Johnson',
            title: 'Full-Stack Software Engineer',
            description: 'Crafting exceptional digital experiences with 4+ years of expertise in full-stack development, no-code solutions, and modern web technologies.',
            email: 'victory@example.com',
            github: 'https://github.com/victoryjohnson',
            linkedin: 'https://linkedin.com/in/victoryjohnson',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
        },
    });

    const aboutForm = useForm<AboutFormData>({
        resolver: zodResolver(aboutSchema),
        defaultValues: currentAboutData || {
            summary: 'I\'m a passionate full-stack software engineer with over 4 years of experience building scalable web applications and innovative digital solutions.',
            experience: '4+',
            projects: '50+',
            clients: '25+',
            technologies: '20+',
        },
    });

    const experienceForm = useForm<ExperienceFormData>({
        resolver: zodResolver(experienceSchema),
        defaultValues: {
            company: '',
            position: '',
            duration: '',
            location: '',
            description: '',
            responsibilities: [''],
            technologies: [''],
            logo: '',
        },
    });

    const educationForm = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            degree: '',
            university: '',
            duration: '',
            location: '',
            gpa: '',
            description: '',
            achievements: [''],
            logo: '',
        },
    });

    const projectForm = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            description: '',
            content: '',
            category: 'fullstack' as 'fullstack' | 'backend' | 'frontend',
            tech: [''],
            github: '',
            live: '',
            featured: false,
            image: '',
            screenshots: [],
            role: '',
            contributions: [''],
            analytics: {
                linesOfCode: 0,
                uptime: '99.9%',
                users: 0,
                performance: '95/100',
            },
        },
    });

    const blogForm = useForm<BlogFormData>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: '',
            slug: '',
            summary: '',
            content: '',
            tags: [''],
            coverImage: '',
            featured: false,
            published: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    });

    const profileImageForm = useForm<ProfileImageFormData>({
        resolver: zodResolver(profileImageSchema),
        defaultValues: {
            image: '',
            alt: 'Victory Johnson',
        },
    });

    const resumeForm = useForm<ResumeFormData>({
        resolver: zodResolver(resumeSchema),
        defaultValues: {
            file_url: '',
            file_name: 'Victory Johnson - Software Engineer Resume.pdf',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    });

    // Fetch current data when component mounts
    useEffect(() => {
        const fetchCurrentData = async () => {
            try {
                // Fetch hero data
                const heroData = await heroService.get();
                setCurrentHeroData(heroData);

                // Fetch about data
                const aboutData = await aboutService.get();
                setCurrentAboutData(aboutData);

                // Fetch experiences data
                const experiencesData = await experienceService.getAll();
                setCurrentExperiences(experiencesData);

                // Fetch education data
                const educationData = await educationService.getAll();
                setCurrentEducation(educationData);

                // Fetch projects data
                const projectsData = await projectService.getAll();
                setCurrentProjects(projectsData);

                // Fetch blog posts data
                const blogPostsData = await blogService.getAll();
                setCurrentBlogPosts(blogPostsData);

                // Fetch contact messages data
                try {
                    const contactMessagesData = await contactMessagesService.getAll();
                    setCurrentContactMessages(contactMessagesData);
                } catch (error) {
                    console.error('Failed to fetch contact messages data:', error);
                }

                // Fetch appointments data
                try {
                    const appointmentsData = await appointmentService.getAll();
                    setCurrentAppointments(appointmentsData);
                } catch (error) {
                    console.error('Failed to fetch appointments data:', error);
                }

                // Fetch profile image data
                try {
                    const profileImageData = await profileImageService.get();
                    setCurrentProfileImage(profileImageData);
                } catch (error) {
                    console.error('Failed to fetch profile image data:', error);
                }

                // Fetch resume data
                try {
                    const resumeData = await resumeService.get();
                    setCurrentResume(resumeData);
                } catch (error) {
                    console.error('Failed to fetch resume data:', error);
                }
            } catch (error) {
                console.error('Failed to fetch current data:', error);
            }
        };

        if (user) {
            fetchCurrentData();
        }
    }, [user]);

    const handleFormSubmit = (data: any, formType: string) => {
        console.log(`${formType} data:`, data);
        toast.success(`${formType} saved successfully!`);

        // Reset the appropriate form
        switch (formType) {
            case 'hero':
                heroForm.reset();
                break;
            case 'about':
                aboutForm.reset();
                break;
            case 'experience':
                experienceForm.reset();
                break;
            case 'education':
                educationForm.reset();
                break;
            case 'project':
                projectForm.reset();
                break;
            case 'blog':
                blogForm.reset();
                break;
            case 'profile-image':
                profileImageForm.reset();
                break;
            case 'resume':
                resumeForm.reset();
                break;
        }
    };

    const tabs = [
        { id: 'hero', label: 'Hero', icon: Home, category: 'Content' },
        { id: 'about', label: 'About', icon: User, category: 'Content' },
        { id: 'experience', label: 'Experience', icon: Briefcase, category: 'Content' },
        { id: 'education', label: 'Education', icon: GraduationCap, category: 'Content' },
        { id: 'projects', label: 'Projects', icon: Plus, category: 'Content' },
        { id: 'skills', label: 'Skills', icon: BarChart3, category: 'Content' },
        { id: 'blog', label: 'Blog', icon: FileText, category: 'Content' },
        { id: 'profile-image', label: 'Profile Image', icon: FileImage, category: 'Content' },
        { id: 'resume', label: 'Resume', icon: FileTextIcon, category: 'Content' },
        { id: 'appointments', label: 'Appointments', icon: Calendar, category: 'Management' },
        { id: 'contact-messages', label: 'Messages', icon: Mail, category: 'Management' },
        { id: 'email-notifications', label: 'Notifications', icon: Bell, category: 'Management' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, category: 'Tools' },
        { id: 'export-import', label: 'Export/Import', icon: Database, category: 'Tools' },
    ];

    // Group tabs by category
    const groupedTabs = tabs.reduce((acc, tab) => {
        if (!acc[tab.category]) {
            acc[tab.category] = [];
        }
        acc[tab.category].push(tab);
        return acc;
    }, {} as Record<string, typeof tabs>);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <LoginForm onLoginSuccess={() => window.location.reload()} />;
    }

    const renderForm = () => {
        switch (activeTab) {
            case 'hero':
                return <HeroForm initialData={currentHeroData || undefined} onSave={() => {
                    // Refresh the current data after save
                    heroService.get().then(setCurrentHeroData);
                }} />;
            case 'about':
                return <AboutForm initialData={currentAboutData || undefined} onSave={() => {
                    // Refresh the current data after save
                    aboutService.get().then(setCurrentAboutData);
                }} />;
            case 'experience':
                return (
                    <ExperienceList
                        onSave={() => {
                            // Refresh the current data after save
                            experienceService.getAll().then(setCurrentExperiences);
                        }}
                    />
                );
            case 'education':
                return (
                    <EducationList
                        onSave={() => {
                            // Refresh the current data after save
                            educationService.getAll().then(setCurrentEducation);
                        }}
                    />
                );
            case 'projects':
                return (
                    <ProjectList
                        onSave={() => {
                            // Refresh the current data after save
                            projectService.getAll().then(setCurrentProjects);
                        }}
                    />
                );
            case 'skills':
                return <SkillsList />;
            case 'blog':
                return (
                    <BlogList
                        onSave={() => {
                            // Refresh the current data after save
                            blogService.getAll().then(setCurrentBlogPosts);
                        }}
                    />
                );
            case 'appointments':
                return <AppointmentList />;
            case 'contact-messages':
                return <ContactMessagesList />;
            case 'email-notifications':
                return <EmailNotificationSettings />;
            case 'profile-image':
                return (
                    <ProfileImageForm
                        initialData={currentProfileImage || undefined}
                        onSave={() => {
                            // Refresh the current data after save
                            profileImageService.get().then(setCurrentProfileImage);
                        }}
                    />
                );
            case 'resume':
                return (
                    <ResumeForm
                        initialData={currentResume || undefined}
                        onSave={() => {
                            // Refresh the current data after save
                            resumeService.get().then(setCurrentResume);
                        }}
                    />
                );
            case 'analytics':
                return <AnalyticsDashboard />;
            case 'export-import':
                return <DataExportImport />;
            default:
                return (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Form for {activeTab} section will be implemented here.</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-bg-light/50 backdrop-blur-xl border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border">
                    <div className="flex items-center min-w-0 flex-1">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Settings className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="ml-3 text-lg sm:text-xl font-bold text-text truncate">Admin Panel</h1>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 rounded-md text-text-muted hover:text-text hover:bg-white/5 flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Back to Portfolio Button */}
                <div className="px-4 sm:px-6 py-3 border-b border-border">
                    <Link
                        href="/"
                        className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Back to Portfolio</span>
                        <span className="sm:hidden">Portfolio</span>
                    </Link>
                </div>

                {/* User Info */}
                <div className="px-4 sm:px-6 py-4 border-b border-border">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                            <p className="text-sm font-medium text-text truncate">{user?.email || 'Admin'}</p>
                            <p className="text-xs text-text-muted">Administrator</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 sm:px-4 py-6 space-y-6 overflow-y-auto min-h-0">
                    {Object.entries(groupedTabs).map(([category, categoryTabs]) => (
                        <div key={category}>
                            <h3 className="px-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                                {category}
                            </h3>
                            <div className="space-y-1">
                                {(categoryTabs as any[]).map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id as AdminTab);
                                            setSidebarOpen(false);
                                        }}
                                        className={`
                      w-full flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${activeTab === tab.id
                                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.2)]'
                                                : 'text-text-muted hover:text-text hover:bg-white/5'
                                            }
                    `}
                                    >
                                        <tab.icon className={`w-4 h-4 mr-2 sm:mr-3 flex-shrink-0 ${activeTab === tab.id ? 'text-primary' : 'text-text-muted'}`} />
                                        <span className="truncate">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="px-2 sm:px-4 py-4 border-t border-border">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-text-muted hover:text-text border-border hover:border-text-muted"
                        onClick={() => {
                            // Handle logout
                            window.location.href = '/';
                        }}
                    >
                        <LogOut className="w-4 h-4 mr-2 sm:mr-3" />
                        <span className="truncate">Logout</span>
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
                {/* Top Header */}
                <header className="bg-bg-dark/80 backdrop-blur-md border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0 flex-1">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-text-muted hover:text-text hover:bg-white/5 mr-3 sm:mr-4 flex-shrink-0"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-lg sm:text-xl font-semibold text-text truncate">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h2>
                                <p className="text-xs sm:text-sm text-text-muted truncate">
                                    Manage your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} content
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden md:flex items-center space-x-2 lg:space-x-6 text-xs lg:text-sm">
                            <div className="flex items-center space-x-1 lg:space-x-2">
                                <span className="text-text-muted hidden lg:inline">Projects:</span>
                                <span className="text-text-muted lg:hidden">P:</span>
                                <span className="text-primary font-medium">{currentProjects.length}</span>
                            </div>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                                <span className="text-text-muted hidden lg:inline">Messages:</span>
                                <span className="text-text-muted lg:hidden">M:</span>
                                <span className="text-primary font-medium">{currentContactMessages.length}</span>
                            </div>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                                <span className="text-text-muted hidden lg:inline">Appointments:</span>
                                <span className="text-text-muted lg:hidden">A:</span>
                                <span className="text-primary font-medium">{currentAppointments.length}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-auto">
                    <div className="min-w-max max-w-6xl mx-auto">
                        <div className="bg-bg-light/10 border border-border/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8">
                            {renderForm()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
