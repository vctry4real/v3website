"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Check, MessageSquare, ArrowRight, Clock, Star, MapPin, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AppointmentBooking } from '../../components/sections/AppointmentBooking';
import { useGSAP } from '../../components/hooks/useGSAP';
import { createContactMessage } from '../../components/lib/database';
import { emailNotificationService } from '../../components/lib/emailNotificationService';
import { heroService } from '../../components/lib/adminService';
import toast from 'react-hot-toast';

export default function AppointmentsPage() {
    const { fadeInUp, staggerFadeIn } = useGSAP();
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Contact form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        email: 'victory@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
    });

    useEffect(() => {
        // Simple entrance animations
        fadeInUp('.animate-header');
        staggerFadeIn('.animate-item');

        const fetchContactInfo = async () => {
            try {
                const heroData = await heroService.get();
                setContactInfo({
                    email: heroData.email,
                    phone: heroData.phone || '+1 (555) 123-4567',
                    location: heroData.location || 'San Francisco, CA',
                });
            } catch (error) {
                console.error('Failed to fetch contact info:', error);
            }
        };

        fetchContactInfo();
    }, []);

    // Contact form handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createContactMessage(formData);
            await emailNotificationService.sendContactNotification(formData);
            toast.success('Message sent successfully! I\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark relative overflow-hidden pt-32 pb-20">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    style={{ backgroundImage: `url(/assets/noisy-bg.jpg)` }}
                    className="w-full h-full absolute inset-0 bg-repeat opacity-[0.03] mix-blend-overlay"
                ></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="animate-header opacity-0 text-center mb-16 sm:mb-24">
                    <h1 className="text-5xl md:text-7xl font-black text-text mb-6">
                        Let's Work Together
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                        Have a project in mind or need technical advice? Choose how you'd like to connect.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* Left Column: Booking & Info */}
                    <div className="space-y-8 animate-item opacity-0">
                        {/* Booking Card */}
                        <div className="bg-bg-light border border-border/30 rounded-2xl p-8 shadow-2xl shadow-primary/5 hover:border-primary/30 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                                <Calendar className="w-7 h-7 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold text-text mb-4">Book a Consultation</h2>
                            <p className="text-text-muted mb-8 leading-relaxed">
                                Schedule a free 30-minute call to discuss your project, get technical feedback, or explore collaboration opportunities.
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-text-muted text-sm">
                                    <Check className="w-4 h-4 text-primary mr-3" />
                                    No commitment required
                                </li>
                                <li className="flex items-center text-text-muted text-sm">
                                    <Check className="w-4 h-4 text-primary mr-3" />
                                    Project & code reviews
                                </li>
                                <li className="flex items-center text-text-muted text-sm">
                                    <Check className="w-4 h-4 text-primary mr-3" />
                                    Technical architecture advice
                                </li>
                            </ul>

                            <Button
                                onClick={() => setShowBookingModal(true)}
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-bg-dark font-bold text-lg"
                            >
                                Schedule Now <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>

                        {/* Direct Contact Info */}
                        <div className="bg-bg-dark/50 border border-border/30 rounded-2xl p-8 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-text mb-6">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center group">
                                    <div className="w-10 h-10 bg-bg-light rounded-lg flex items-center justify-center mr-4 border border-border/30 group-hover:border-primary/50 transition-colors">
                                        <Mail className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted uppercase tracking-wider">Email</p>
                                        <a href={`mailto:${contactInfo.email}`} className="text-text font-medium hover:text-primary transition-colors">
                                            {contactInfo.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center group">
                                    <div className="w-10 h-10 bg-bg-light rounded-lg flex items-center justify-center mr-4 border border-border/30 group-hover:border-primary/50 transition-colors">
                                        <Phone className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted uppercase tracking-wider">Phone</p>
                                        <a href={`tel:${contactInfo.phone}`} className="text-text font-medium hover:text-primary transition-colors">
                                            {contactInfo.phone}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center group">
                                    <div className="w-10 h-10 bg-bg-light rounded-lg flex items-center justify-center mr-4 border border-border/30 group-hover:border-primary/50 transition-colors">
                                        <MapPin className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted uppercase tracking-wider">Location</p>
                                        <span className="text-text font-medium">
                                            {contactInfo.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Message Form */}
                    <div className="animate-item opacity-0 bg-bg-light/50 backdrop-blur-md border border-border/30 rounded-2xl p-8 lg:p-10 shadow-2xl">
                        <div className="mb-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 border border-primary/20">
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-text mb-2">Send a Message</h2>
                            <p className="text-text-muted">
                                Prefer to write? Fill out the form below and I'll get back to you within 24 hours.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-bg-dark border border-border/50 rounded-xl text-text placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/30"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-bg-dark border border-border/50 rounded-xl text-text placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/30"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-text-muted mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-bg-dark border border-border/50 rounded-xl text-text placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/30"
                                    placeholder="What's this about?"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 bg-bg-dark border border-border/50 rounded-xl text-text placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/30 resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-bg-light border border-border/50 text-text font-bold hover:bg-bg-dark hover:text-primary transition-all text-lg"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                </div>

                <AppointmentBooking
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                />
            </div>
        </div>
    );
}
