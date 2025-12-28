import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, Reply, Trash2, Clock, User, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { contactMessagesService } from '../lib/adminService';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export const ContactMessagesList: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await contactMessagesService.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'unread' | 'read' | 'replied') => {
    try {
      await contactMessagesService.updateStatus(id, status);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, status } : msg
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await contactMessagesService.delete(id);
      setMessages(prev => prev.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500';
      case 'read': return 'bg-blue-500';
      case 'replied': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <Eye className="w-4 h-4" />;
      case 'read': return <EyeOff className="w-4 h-4" />;
      case 'replied': return <Reply className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Contact Messages</h3>
          <p className="text-gray-400">
            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''} 
            {filter !== 'all' && ` (${filter})`}
          </p>
        </div>
        <Button onClick={fetchMessages} variant="outline">
          <Mail className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 bg-gray-800 rounded-lg p-1">
        {(['all', 'unread', 'read', 'replied'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {getStatusIcon(status)}
            <span className="ml-2 capitalize">{status}</span>
            {status !== 'all' && (
              <span className="ml-2 bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                {messages.filter(m => m.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No messages found</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 border-b border-gray-700 cursor-pointer transition-colors duration-200 ${
                      selectedMessage?.id === message.id
                        ? 'bg-blue-600/20 border-blue-500'
                        : 'hover:bg-gray-750'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(message.status)}`}></div>
                        <span className="text-white font-medium truncate">{message.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{formatDate(message.created_at)}</span>
                    </div>
                    <p className="text-gray-300 text-sm font-medium mb-1 truncate">{message.subject}</p>
                    <p className="text-gray-400 text-xs truncate">{message.email}</p>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-gray-800 rounded-lg p-6">
              {/* Message Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{selectedMessage.subject}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {selectedMessage.name}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {selectedMessage.email}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatDate(selectedMessage.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Quick Reply Info */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-300 font-medium mb-1">Quick Reply Info:</p>
                <p className="text-xs text-gray-300">To: {selectedMessage.email}</p>
                <p className="text-xs text-gray-300">Subject: Re: {selectedMessage.subject}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                {selectedMessage.status === 'unread' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'read')}
                    variant="outline"
                    size="sm"
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                {selectedMessage.status !== 'replied' && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'replied')}
                    variant="outline"
                    size="sm"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Mark as Replied
                  </Button>
                )}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => window.open('https://mail.zoho.com/zm/#compose', '_blank')}
                    size="sm"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Open Zoho Mail
                  </Button>
                  <Button
                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}&body=${encodeURIComponent(`Hi ${selectedMessage.name},\n\nThank you for your message. I'll get back to you soon.\n\nBest regards,\nVictory Johnson`)}`, '_blank')}
                    size="sm"
                    variant="outline"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Quick Reply
                  </Button>
                </div>
                <Button
                  onClick={() => handleDelete(selectedMessage.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:border-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Select a Message</h4>
              <p className="text-gray-400">Choose a message from the list to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
