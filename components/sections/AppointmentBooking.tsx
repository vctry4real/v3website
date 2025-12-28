
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { createAppointment } from '../lib/database';
import { appointmentEmailService } from '../lib/appointmentEmailService';
import toast from 'react-hot-toast';

interface AppointmentBookingProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  label: string;
}

interface BookingForm {
  name: string;
  email: string;
  date: string;
  time: string;
  reason: string;
  message: string;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'date' | 'time' | 'details' | 'confirmation'>('date');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState<BookingForm>({
    name: '',
    email: '',
    date: '',
    time: '',
    reason: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate available dates (next 30 days, excluding weekends)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Exclude weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }

    return dates;
  };

  // Generate time slots (9 AM to 6 PM, 30-minute intervals)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time,
          available: true,
          label: `${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
        });
      }
    }

    return slots;
  };

  const availableDates = generateAvailableDates();
  const timeSlots = generateTimeSlots();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date }));
    setCurrentStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setFormData(prev => ({ ...prev, time }));
    setCurrentStep('details');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const appointment = await createAppointment({
        name: formData.name,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        message: formData.message,
        status: 'pending',
      });

      try {
        await appointmentEmailService.sendNewAppointmentNotification(appointment);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }

      setCurrentStep('confirmation');
      toast.success('Appointment booked successfully!');
    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('date');
    setSelectedDate('');
    setSelectedTime('');
    setFormData({
      name: '',
      email: '',
      date: '',
      time: '',
      reason: '',
      message: '',
    });
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-bg-light border border-border/50 rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl shadow-primary/5">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30 bg-bg-dark/50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl border border-primary/20">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text">Schedule Appointment</h3>
              <p className="text-text-muted text-sm">Book a consultation call</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-text-muted hover:text-white bg-bg-dark/50 hover:bg-bg-dark p-2 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-bg-dark/30 border-b border-border/30 p-4">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            {['date', 'time', 'details', 'confirmation'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${currentStep === step
                  ? 'bg-primary text-bg-dark ring-2 ring-primary ring-offset-2 ring-offset-bg-dark'
                  : index < ['date', 'time', 'details', 'confirmation'].indexOf(currentStep)
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : 'bg-bg-dark text-text-muted border border-border'
                  }`}>
                  {index < ['date', 'time', 'details', 'confirmation'].indexOf(currentStep) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 rounded-full transition-colors duration-300 ${index < ['date', 'time', 'details', 'confirmation'].indexOf(currentStep)
                    ? 'bg-primary/50'
                    : 'bg-border'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Date Selection */}
          {currentStep === 'date' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-text mb-2">Select a Date</h4>
                <p className="text-text-muted text-sm">Choose a convenient date for your consultation</p>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {availableDates.slice(0, 21).map((date) => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className="p-3 text-center rounded-xl border border-border/50 bg-bg-dark/50 hover:bg-bg-dark hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group"
                  >
                    <div className="text-text font-bold text-lg group-hover:text-primary transition-colors">
                      {new Date(date).getDate()}
                    </div>
                    <div className="text-text-muted text-xs uppercase tracking-wider group-hover:text-primary/80">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Time Selection */}
          {currentStep === 'time' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-text mb-2">Select a Time</h4>
                <p className="text-text-muted text-sm">
                  Available times for <span className="text-primary font-medium">{formatDate(selectedDate)}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 text-center rounded-xl border transition-all duration-200 text-sm font-medium ${slot.available
                      ? 'border-border/50 bg-bg-dark/50 hover:border-primary/50 hover:bg-bg-dark hover:text-primary hover:shadow-lg hover:shadow-primary/5 text-text'
                      : 'border-border/10 bg-bg-dark/20 text-text-muted/50 cursor-not-allowed'
                      }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>

              <div className="flex space-x-3 pt-4 border-t border-border/30">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('date')}
                  className="flex-1 bg-transparent border-border/50 hover:bg-bg-dark hover:text-white"
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Details Form */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <p className="text-primary text-sm font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Appointment on {formatDate(selectedDate)} at {selectedTime}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-bg-dark border border-border/50 rounded-xl text-text placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-bg-dark border border-border/50 rounded-xl text-text placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-text-muted mb-2">
                    Consultation Type
                  </label>
                  <div className="relative">
                    <select
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-bg-dark border border-border/50 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                    >
                      <option value="">Select consultation type</option>
                      <option value="Website design & development">Website design & development</option>
                      <option value="Web App development">Web App development</option>
                      <option value="Custom AI Architecture">Custom AI Architecture</option>
                      <option value="Technical Consultation">Technical Consultation</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-2">
                    Additional Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-bg-dark border border-border/50 rounded-xl text-text placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell me about your project or what you'd like to discuss..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-border/30">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep('time')}
                    className="flex-1 bg-transparent border-border/50 hover:bg-bg-dark hover:text-white"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-bg-dark font-bold"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 'confirmation' && (
            <div className="text-center space-y-8 py-8">
              <div className="flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mx-auto ring-4 ring-primary/10">
                <Check className="w-10 h-10 text-primary" />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-text mb-2">Appointment Confirmed!</h4>
                <p className="text-text-muted">
                  Your consultation has been scheduled successfully.
                </p>
              </div>

              <div className="bg-bg-dark/50 border border-border/50 rounded-xl p-6 space-y-4 max-w-sm mx-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Date:</span>
                  <span className="text-text font-medium">{formatDate(formData.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Time:</span>
                  <span className="text-text font-medium">{formData.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Type:</span>
                  <span className="text-text font-medium">{formData.reason}</span>
                </div>
              </div>

              <Button onClick={handleClose} className="w-full bg-bg-dark border border-border/50 hover:bg-bg-dark/80 text-text">
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
