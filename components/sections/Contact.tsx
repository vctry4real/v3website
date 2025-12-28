import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send, Calendar, Clock } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import { Button } from '../ui/Button';
import { createContactMessage } from '../lib/database';
import toast from 'react-hot-toast';
import { heroService } from '../lib/adminService';
import { emailNotificationService } from '../lib/emailNotificationService';
import { AppointmentBooking } from './AppointmentBooking';

export const Contact: React.FC = () => {
  const { scrollReveal, scrollRevealMobile } = useGSAP();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: 'victory@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
  });

  useEffect(() => {
    // Use mobile-friendly scroll triggers
    const isMobile = window.innerWidth <= 768;
    const scrollFunction = isMobile ? scrollRevealMobile : scrollReveal;

    scrollFunction('.contact-header');
    scrollFunction('.contact-info');
    scrollFunction('.contact-form');
    scrollFunction('.booking-section');
  }, []);

  // Fetch contact info from hero data
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const heroData = await heroService.get();
        setContactInfo({
          email: heroData.email,
          phone: heroData.phone || '09064286189',
          location: heroData.location || 'Lagos, Nigeria',
        });
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

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
      // Save message to database
      await createContactMessage(formData);

      // Send email notification
      await emailNotificationService.sendContactNotification(formData);

      toast.success('Message sent successfully! I\'ll get back to you soon.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfoItems = [
    {
      icon: Mail,
      label: 'Email',
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contactInfo.phone,
      href: contactInfo.phone ? `tel:${contactInfo.phone.replace(/\s+/g, '')}` : '#',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contactInfo.location,
      href: '#',
    },
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="contact-header text-center mb-12 sm:mb-16 opacity-0">
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto px-4 sm:px-0">
            Ready to bring your ideas to life? Get in touch and let's discuss how we can create something amazing together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info & Booking */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            {/* Contact Information */}
            <div className="contact-info opacity-0">
              <h3 className="text-xl sm:text-2xl font-bold text-text mb-4 sm:mb-6">Get in Touch</h3>
              <div className="space-y-3 sm:space-y-4">
                {contactInfoItems.map((info, index) => (
                  <a
                    key={index}
                    href={info.href}
                    className="flex items-center p-3 sm:p-4 bg-bg rounded-lg hover:bg-bg-light transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg mr-3 sm:mr-4 group-hover:bg-primary/90 transition-colors duration-200 flex-shrink-0">
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-text-muted text-xs sm:text-sm">{info.label}</p>
                      <p className="text-text font-medium text-sm sm:text-base truncate">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Appointment Booking */}
            <div className="booking-section opacity-0">
              <h3 className="text-xl sm:text-2xl font-bold text-text mb-4 sm:mb-6">Schedule a Meeting</h3>
              <div className="bg-bg rounded-lg p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-text font-medium text-sm sm:text-base">Free Consultation</h4>
                    <p className="text-text-muted text-xs sm:text-sm">30-minute discovery call</p>
                  </div>
                </div>
                <div className="flex items-center mb-4 sm:mb-6">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-text-muted text-sm sm:text-base">Available Monday - Friday</p>
                    <p className="text-text-muted text-xs sm:text-sm">9:00 AM - 6:00 PM PST</p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setShowBookingModal(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form opacity-0 order-1 lg:order-2">
            <h3 className="text-xl sm:text-2xl font-bold text-text mb-4 sm:mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-bg border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 text-sm sm:text-base"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-bg border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 text-sm sm:text-base"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-muted mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-bg border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 text-sm sm:text-base"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-bg border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-none text-sm sm:text-base"
                  placeholder="Tell me about your project..."
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Appointment Booking Modal */}
      <AppointmentBooking
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </section>
  );
};