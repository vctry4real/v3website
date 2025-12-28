// Email Notification Service
// This service sends email notifications when contact messages are received

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface EmailNotificationConfig {
  adminEmail: string;
  adminName: string;
  siteName: string;
  zohoEmail: string;
  zohoPassword: string;
  zohoHost: string;
  zohoPort: number;
}

// Default configuration - you can update these values
const defaultConfig: EmailNotificationConfig = {
  adminEmail: 'victoryjohnson@vctry4real.dev', // Your Zoho email address
  adminName: 'Victory Johnson',
  siteName: 'Victory Johnson Portfolio',
  zohoEmail: '', // Your Zoho email address
  zohoPassword: '', // Your Zoho app password
  zohoHost: 'smtp.zoho.com',
  zohoPort: 587
};

export class EmailNotificationService {
  private config: EmailNotificationConfig;

  constructor(config?: Partial<EmailNotificationConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Send notification email when a new contact message is received
   */
  async sendContactNotification(message: ContactMessage): Promise<void> {
    try {
      console.log('📧 Attempting to send email notification...');
      console.log('📧 To:', this.config.adminEmail);
      console.log('📧 Subject:', `New Contact Message from ${message.name}`);
      
      // Always try to send email - the API will handle Zoho credentials from environment variables
      await this.sendEmail({
        to: this.config.adminEmail,
        subject: `New Contact Message from ${message.name}`,
        html: this.generateNotificationEmail(message)
      });

      console.log('📧 Email notification sent successfully via Zoho Mail!');
      
    } catch (error) {
      console.error('Failed to send contact notification:', error);
      // Don't throw error to avoid breaking the contact form
      // The API will handle the error and provide appropriate feedback
    }
  }

  /**
   * Generate HTML email content for the notification
   */
  private generateNotificationEmail(message: ContactMessage): string {
    const timestamp = new Date().toLocaleString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Message</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .message-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #2563eb; }
          .contact-info { background: #e0e7ff; padding: 15px; border-radius: 6px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Message</h1>
            <p>You have received a new message from your portfolio website</p>
          </div>
          
          <div class="content">
            <div class="contact-info">
              <h3>Contact Information</h3>
              <p><strong>Name:</strong> ${message.name}</p>
                             <p><strong>Email:</strong> ${message.email}</p>
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Received:</strong> ${timestamp}</p>
            </div>
            
            <div class="message-box">
              <h3>Message</h3>
              <p>${message.message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://mail.zoho.com/zm/#compose" target="_blank" class="button">Open Zoho Mail</a>
              <a href="mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}&body=${encodeURIComponent(`Hi ${message.name},\n\nThank you for your message. I'll get back to you soon.\n\nBest regards,\nVictory Johnson`)}" class="button">Quick Reply</a>
              <a href="${window.location.origin}/admin" class="button">View in Admin Panel</a>
            </div>
            <div style="text-align: center; margin: 10px 0; font-size: 14px; color: #6b7280;">
              <p><strong>Quick Reply Info:</strong></p>
              <p>To: ${message.email}</p>
              <p>Subject: Re: ${message.subject}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This notification was sent from ${this.config.siteName}</p>
            <p>You can manage contact messages in your admin panel</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send email using Zoho SMTP
   */
  private async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
    try {
      // For client-side applications, we need to use a serverless function or API endpoint
      // This is because browsers don't allow direct SMTP connections for security reasons
      
      // Use serverless function (works with Vercel deployment)
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          html,
          config: {
            adminName: this.config.adminName,
            siteName: this.config.siteName
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }

    } catch (error) {
      console.error('Email sending failed:', error);
      
      // Fallback to console logging if email service fails
      console.log('📧 EMAIL SENDING FAILED - FALLBACK TO CONSOLE');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('HTML Content Length:', html.length);
      console.log('Error:', error);
      
      throw error;
    }
  }

  /**
   * Test Zoho connection
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test by sending a test email - the API will handle Zoho credentials from environment variables
      await this.sendEmail({
        to: this.config.adminEmail,
        subject: 'Test Email - Zoho Configuration',
        html: `
          <h2>Test Email</h2>
          <p>This is a test email to verify your Zoho Mail configuration is working correctly.</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>Admin Email: ${this.config.adminEmail}</li>
            <li>Site Name: ${this.config.siteName}</li>
          </ul>
          <p>If you received this email, your Zoho Mail integration is working!</p>
        `
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<EmailNotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): EmailNotificationConfig {
    return { ...this.config };
  }

  /**
   * Get Zoho setup instructions
   */
  getZohoSetupInstructions(): string {
    return `
# Zoho Mail Setup Instructions

## 1. Create a Zoho Mail Account
- Go to https://www.zoho.com/mail/
- Sign up for a free or paid account
- Verify your email address

## 2. Enable SMTP Access
- Log into your Zoho Mail account
- Go to Settings > Mail Accounts
- Enable SMTP access for your account

## 3. Generate App Password
- Go to Settings > Security
- Enable 2-Factor Authentication (if not already enabled)
- Generate an App Password for SMTP
- Save this password securely

## 4. Configure in Admin Panel
- Go to your admin panel > Notifications tab
- Enter your Zoho email address
- Enter the app password (not your regular password)
- Test the connection

## 5. SMTP Settings
- Host: smtp.zoho.com
- Port: 587 (TLS) or 465 (SSL)
- Username: Your Zoho email address
- Password: Your app password

## 6. Test Configuration
- Use the "Test Connection" button in the admin panel
- Send a test email to verify everything works
    `;
  }
}

// Create a singleton instance
export const emailNotificationService = new EmailNotificationService();
