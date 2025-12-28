import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, Check, X, AlertCircle, Filter, Search, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { getAppointments, updateAppointment, deleteAppointment } from '../lib/database';
import { appointmentEmailService } from '../lib/appointmentEmailService';
import toast from 'react-hot-toast';

interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  reason: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter, searchTerm]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchAppointments();
      toast.success('Appointments refreshed');
    } catch (error) {
      console.error('Failed to refresh appointments:', error);
      toast.error('Failed to refresh appointments');
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment =>
        appointment.name.toLowerCase().includes(term) ||
        appointment.email.toLowerCase().includes(term) ||
        appointment.reason.toLowerCase().includes(term) ||
        appointment.message?.toLowerCase().includes(term)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const updatedAppointment = await updateAppointment(id, { status });
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? { ...appointment, status } : appointment
        )
      );
      
      // Send email notifications based on status change
      try {
        if (status === 'confirmed') {
          await appointmentEmailService.sendAppointmentConfirmation(updatedAppointment);
          toast.success('Appointment confirmed and confirmation email sent');
        } else if (status === 'cancelled') {
          await appointmentEmailService.sendAppointmentCancellation(updatedAppointment);
          toast.success('Appointment cancelled and cancellation email sent');
        } else {
          toast.success(`Appointment ${status}`);
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        toast.success(`Appointment ${status} successfully, but email notification failed`);
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(null);
      }
      toast.success('Appointment deleted');
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      toast.error('Failed to delete appointment');
    }
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

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600 text-yellow-100';
      case 'confirmed':
        return 'bg-green-600 text-green-100';
      case 'cancelled':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'confirmed':
        return <Check className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Appointments</h3>
          <p className="text-gray-400">Manage consultation bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg">
            <div className="p-4 border-b border-gray-700">
              <h4 className="text-white font-medium">
                Appointments ({filteredAppointments.length})
              </h4>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredAppointments.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  No appointments found
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => setSelectedAppointment(appointment)}
                    className={`p-4 border-b border-gray-700 cursor-pointer transition-colors duration-200 ${
                      selectedAppointment?.id === appointment.id
                        ? 'bg-blue-600/20 border-blue-500'
                        : 'hover:bg-gray-750'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(appointment.date)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white font-medium">{appointment.name}</p>
                      <p className="text-gray-400 text-sm">{appointment.email}</p>
                      <p className="text-gray-400 text-sm">{appointment.reason}</p>
                      <p className="text-blue-400 text-sm">{formatTime(appointment.time)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="lg:col-span-2">
          {selectedAppointment ? (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white">Appointment Details</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusIcon(selectedAppointment.status)}
                    <span className="ml-1">{selectedAppointment.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                    <p className="text-white">{selectedAppointment.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <p className="text-white">{selectedAppointment.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                    <p className="text-white">{formatDate(selectedAppointment.date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                    <p className="text-white">{formatTime(selectedAppointment.time)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Consultation Type</label>
                    <p className="text-white">{selectedAppointment.reason}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Created</label>
                    <p className="text-white">{formatDate(selectedAppointment.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Last Updated</label>
                    <p className="text-white">{formatDate(selectedAppointment.updated_at)}</p>
                  </div>
                </div>
              </div>

              {selectedAppointment.message && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Additional Details</label>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-white whitespace-pre-wrap">{selectedAppointment.message}</p>
                  </div>
                </div>
              )}

              {/* Quick Reply Info */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-300 font-medium mb-1">Quick Reply Info:</p>
                <p className="text-xs text-gray-300">To: {selectedAppointment.email}</p>
                <p className="text-xs text-gray-300">Subject: Re: Appointment - {selectedAppointment.reason}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'confirmed')}
                      className="flex items-center"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled')}
                      className="flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://mail.zoho.com/zm/#compose', '_blank')}
                    className="flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Open Zoho Mail
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`mailto:${selectedAppointment.email}?subject=${encodeURIComponent(`Re: Appointment - ${selectedAppointment.reason}`)}&body=${encodeURIComponent(`Hi ${selectedAppointment.name},\n\nThank you for your appointment request.\n\nAppointment Details:\n- Date: ${formatDate(selectedAppointment.date)}\n- Time: ${formatTime(selectedAppointment.time)}\n- Type: ${selectedAppointment.reason}\n\nBest regards,\nVictory Johnson`)}`, '_blank')}
                    className="flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Quick Reply
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedAppointment.id)}
                  className="flex items-center text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center h-64">
              <div className="text-center text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select an appointment to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
