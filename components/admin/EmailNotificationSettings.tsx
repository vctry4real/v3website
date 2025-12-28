import React, { useState, useEffect } from 'react';
import { Mail, Save, Bell, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { emailNotificationService } from '../lib/emailNotificationService';
import toast from 'react-hot-toast';

export const EmailNotificationSettings: React.FC = () => {
  const [config, setConfig] = useState({
    adminEmail: '',
    adminName: '',
    siteName: '',
    zohoEmail: '',
    zohoPassword: '',
    zohoHost: 'smtp.zoho.com',
    zohoPort: 587,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load current configuration
    const currentConfig = emailNotificationService.getConfig();
    setConfig(currentConfig);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      emailNotificationService.updateConfig(config);
      toast.success('Email notification settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await emailNotificationService.sendContactNotification({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Notification',
        message: 'This is a test notification to verify your email settings are working correctly.',
      });
      toast.success('Test notification sent! Check your email inbox.');
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast.error('Failed to send test notification');
    }
  };

  const handleTestConnection = async () => {
    try {
      const result = await emailNotificationService.testConnection();
      if (result.success) {
        toast.success('Zoho connection test successful!');
      } else {
        toast.error(`Connection test failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('Connection test failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Email Notifications</h3>
          <p className="text-gray-400">Configure email notifications for new contact messages</p>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-300 mb-2">
              Your Email Address
            </label>
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              value={config.adminEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
            <p className="text-sm text-gray-400 mt-1">
              You'll receive notifications at this email when someone sends a message
            </p>
          </div>

          <div>
            <label htmlFor="adminName" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="adminName"
              name="adminName"
              value={config.adminName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Name"
            />
            <p className="text-sm text-gray-400 mt-1">
              This will appear in the notification emails
            </p>
          </div>

          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-300 mb-2">
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={config.siteName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Portfolio Name"
            />
            <p className="text-sm text-gray-400 mt-1">
              This will appear in the notification emails
            </p>
          </div>

          {/* Environment Variables Notice */}
          <div className="border-t border-gray-600 pt-6 mt-6">
            <h4 className="text-lg font-medium text-white mb-4">Zoho Mail Configuration</h4>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Settings className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-blue-300 mb-2">Environment Variables Required</h5>
                  <p className="text-sm text-gray-300 mb-3">
                    Zoho Mail credentials are now configured via environment variables in Vercel for security.
                  </p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p><strong>Required Variables:</strong></p>
                    <p>• ZOHO_EMAIL=victoryjohnson@vctry4real.dev</p>
                    <p>• ZOHO_APP_PASSWORD=your_app_password</p>
                    <p>• ZOHO_HOST=smtp.zoho.com</p>
                    <p>• ZOHO_PORT=587</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mt-6">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>

          <Button
            onClick={handleTestConnection}
            variant="outline"
            className="flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Test Connection
          </Button>

          <Button
            onClick={handleTestNotification}
            variant="outline"
            className="flex items-center"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Test Email
          </Button>
        </div>
      </div>

      {/* Zoho Setup Instructions */}
      <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Settings className="w-5 h-5 text-green-400 mt-0.5" />
          <div>
            <h4 className="text-green-300 font-medium mb-2">Zoho Mail Setup</h4>
            <p className="text-gray-300 text-sm mb-3">
              Configure your Zoho Mail account to send email notifications when contact messages are received.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p><strong>Setup Steps:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Create a Zoho Mail account at <a href="https://www.zoho.com/mail/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">zoho.com/mail</a></li>
                <li>Enable SMTP access in your Zoho Mail settings</li>
                <li>Generate an App Password (not your regular password)</li>
                <li>Enter your Zoho credentials above</li>
                <li>Test the connection</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Current Status</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Notification Email:</span>
            <span className="text-white">{config.adminEmail || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Admin Name:</span>
            <span className="text-white">{config.adminName || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Site Name:</span>
            <span className="text-white">{config.siteName || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Zoho Email:</span>
            <span className="text-white">{config.zohoEmail || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Zoho Password:</span>
            <span className="text-white">{config.zohoPassword ? '••••••••' : 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">SMTP Host:</span>
            <span className="text-white">{config.zohoHost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">SMTP Port:</span>
            <span className="text-white">{config.zohoPort}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
