// Appointment Email Notification Service
// This service sends email notifications for appointment bookings, confirmations, and cancellations

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
}

interface AppointmentEmailConfig {
  adminEmail: string;
  adminName: string;
  siteName: string;
}

// Default configuration
const defaultConfig: AppointmentEmailConfig = {
  adminEmail: 'victoryjohnson@vctry4real.dev',
  adminName: 'Victory Johnson',
  siteName: 'Victory Johnson Portfolio'
};

export class AppointmentEmailService {
  private config: AppointmentEmailConfig;

  constructor(config?: Partial<AppointmentEmailConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Send notification email when a new appointment is booked
   */
  async sendNewAppointmentNotification(appointment: Appointment): Promise<void> {
    try {
      console.log('📅 Sending new appointment notification...');
      
      await this.sendEmail({
        to: this.config.adminEmail,
        subject: `New Appointment Booking - ${appointment.name}`,
        html: this.generateNewAppointmentEmail(appointment)
      });

      console.log('📅 New appointment notification sent successfully!');
      
    } catch (error) {
      console.error('Failed to send new appointment notification:', error);
      // Don't throw error to avoid breaking the appointment booking
    }
  }

  /**
   * Send confirmation email to user when appointment is confirmed
   */
  async sendAppointmentConfirmation(appointment: Appointment): Promise<void> {
    try {
      console.log('📅 Sending appointment confirmation...');
      console.log('📅 To:', appointment.email);
      console.log('📅 Subject:', `Appointment Confirmed - ${appointment.reason}`);
      
      // Send confirmation email to user
      await this.sendEmail({
        to: appointment.email,
        subject: `Appointment Confirmed - ${appointment.reason}`,
        html: this.generateConfirmationEmail(appointment)
      });

      console.log('📅 Appointment confirmation sent successfully!');
      console.log('📅 Email was sent to:', appointment.email);
      
      // Also send a copy to admin for verification
      try {
        await this.sendEmail({
          to: this.config.adminEmail,
          subject: `[COPY] Appointment Confirmation Sent - ${appointment.name}`,
          html: this.generateConfirmationCopyEmail(appointment)
        });
        console.log('📅 Confirmation copy sent to admin');
      } catch (copyError) {
        console.error('Failed to send confirmation copy to admin:', copyError);
        // Don't fail the main confirmation if copy fails
      }
      
    } catch (error) {
      console.error('Failed to send appointment confirmation:', error);
      throw error; // Re-throw for admin panel to handle
    }
  }

  /**
   * Send cancellation email to user when appointment is cancelled
   */
  async sendAppointmentCancellation(appointment: Appointment): Promise<void> {
    try {
      console.log('📅 Sending appointment cancellation...');
      
      await this.sendEmail({
        to: appointment.email,
        subject: `Appointment Cancelled - ${appointment.reason}`,
        html: this.generateCancellationEmail(appointment)
      });

      console.log('📅 Appointment cancellation sent successfully!');
      
    } catch (error) {
      console.error('Failed to send appointment cancellation:', error);
      throw error; // Re-throw for admin panel to handle
    }
  }

  /**
   * Generate HTML email content for new appointment notification
   */
  private generateNewAppointmentEmail(appointment: Appointment): string {
    const timestamp = new Date().toLocaleString();
    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <title>New Appointment Booking - ${this.config.siteName}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center;
          }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .content { 
            padding: 30px 20px; 
            background-color: #ffffff;
          }
          .contact-info { 
            background: #d1fae5; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #10b981;
          }
          .contact-info h3 { margin: 0 0 15px 0; color: #1f2937; }
          .contact-info p { margin: 8px 0; }
          .appointment-details { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #10b981;
          }
          .appointment-details h3 { margin: 0 0 15px 0; color: #1f2937; }
          .appointment-details p { margin: 8px 0; }
          .footer { 
            text-align: center; 
            padding: 20px; 
            background-color: #f8fafc;
            border-top: 1px solid #e5e7eb;
            color: #6b7280; 
            font-size: 14px; 
          }
          .button { 
            display: inline-block; 
            background: #10b981; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 10px 5px; 
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .button:hover { background: #059669; }
          .quick-reply-info { 
            background: #f3f4f6; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 20px 0; 
            text-align: center;
          }
          .quick-reply-info p { margin: 5px 0; font-size: 14px; }
          @media only screen and (max-width: 600px) {
            .container { margin: 0; }
            .header, .content, .footer { padding: 20px 15px; }
            .button { display: block; margin: 10px 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 New Appointment Booking</h1>
            <p>You have received a new appointment request</p>
          </div>
          
          <div class="content">
            <div class="contact-info">
              <h3>Client Information</h3>
              <p><strong>Name:</strong> ${appointment.name}</p>
              <p><strong>Email:</strong> ${appointment.email}</p>
              <p><strong>Consultation Type:</strong> ${appointment.reason}</p>
              <p><strong>Booked:</strong> ${timestamp}</p>
            </div>
            
            <div class="appointment-details">
              <h3>Appointment Details</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending Confirmation</span></p>
              ${appointment.message ? `<p><strong>Additional Details:</strong></p><p>${appointment.message.replace(/\n/g, '<br>')}</p>` : ''}
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://mail.zoho.com/zm/#compose" target="_blank" class="button">Open Zoho Mail</a>
              <a href="mailto:${appointment.email}?subject=${encodeURIComponent(`Re: Appointment Confirmation - ${appointment.reason}`)}&body=${encodeURIComponent(`Hi ${appointment.name},\n\nThank you for booking an appointment with me!\n\nI'm confirming your ${appointment.reason} consultation on ${formattedDate} at ${appointment.time}.\n\nI'll send you a calendar invite shortly with the meeting details.\n\nLooking forward to our conversation!\n\nBest regards,\n${this.config.adminName}`)}" class="button">Quick Reply</a>
              <a href="${window.location.origin}/admin" class="button">View in Admin Panel</a>
            </div>
            
            <div class="quick-reply-info">
              <p><strong>Quick Reply Info:</strong></p>
              <p>To: ${appointment.email}</p>
              <p>Subject: Re: Appointment Confirmation - ${appointment.reason}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This notification was sent from <strong>${this.config.siteName}</strong></p>
            <p>You can manage appointments in your admin panel</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate HTML email content for appointment confirmation
   */
  private generateConfirmationEmail(appointment: Appointment): string {
    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <title>Appointment Confirmed - ${this.config.siteName}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center;
          }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .content { 
            padding: 30px 20px; 
            background-color: #ffffff;
          }
          .appointment-details { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #10b981;
          }
          .appointment-details h3 { margin: 0 0 15px 0; color: #1f2937; }
          .appointment-details p { margin: 8px 0; }
          .footer { 
            text-align: center; 
            padding: 20px; 
            background-color: #f8fafc;
            border-top: 1px solid #e5e7eb;
            color: #6b7280; 
            font-size: 14px; 
          }
          .footer a { color: #10b981; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          .unsubscribe { 
            text-align: center; 
            padding: 15px; 
            background-color: #f3f4f6;
            border-top: 1px solid #e5e7eb;
            color: #6b7280; 
            font-size: 12px; 
          }
          .unsubscribe a { color: #6b7280; text-decoration: none; }
          @media only screen and (max-width: 600px) {
            .container { margin: 0; }
            .header, .content, .footer { padding: 20px 15px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Appointment Confirmed</h1>
            <p>Your consultation has been confirmed</p>
          </div>
          
          <div class="content">
            <p>Hi ${appointment.name},</p>
            
            <p>Great news! Your appointment has been confirmed. Here are the details:</p>
            
            <div class="appointment-details">
              <h3>Appointment Details</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Consultation Type:</strong> ${appointment.reason}</p>
              <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Confirmed</span></p>
            </div>
            
            <p>I'll send you a calendar invite shortly with the meeting link and any additional information you might need.</p>
            
            <p>If you need to reschedule or cancel, please let me know at least 24 hours in advance.</p>
            
            <p>Looking forward to our conversation!</p>
            
            <p>Best regards,<br><strong>${this.config.adminName}</strong></p>
          </div>
          
          <div class="footer">
            <p>This email was sent from <strong>${this.config.siteName}</strong></p>
            <p>If you have any questions, please reply to this email or contact us directly.</p>
          </div>
          
          <div class="unsubscribe">
            <p>You received this email because you booked an appointment with ${this.config.siteName}. 
            <a href="mailto:${this.config.adminEmail}?subject=unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate HTML email content for confirmation copy sent to admin
   */
  private generateConfirmationCopyEmail(appointment: Appointment): string {
    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Confirmation Copy</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Confirmation Email Copy</h1>
            <p>This is a copy of the confirmation email sent to the client</p>
          </div>
          
          <div class="content">
            <p><strong>Client:</strong> ${appointment.name} (${appointment.email})</p>
            <p><strong>Sent:</strong> ${new Date().toLocaleString()}</p>
            
            <div class="appointment-details">
              <h3>Appointment Details</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Consultation Type:</strong> ${appointment.reason}</p>
              <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Confirmed</span></p>
            </div>
            
            <p>This confirmation email was automatically sent to the client when you confirmed their appointment.</p>
          </div>
          
          <div class="footer">
            <p>This is an automated copy from ${this.config.siteName}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate HTML email content for appointment cancellation
   */
  private generateCancellationEmail(appointment: Appointment): string {
    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ef4444; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Appointment Cancelled</h1>
            <p>Your appointment has been cancelled</p>
          </div>
          
          <div class="content">
            <p>Hi ${appointment.name},</p>
            
            <p>Unfortunately, I need to cancel our scheduled appointment. Here are the details of the cancelled appointment:</p>
            
            <div class="appointment-details">
              <h3>Cancelled Appointment</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Consultation Type:</strong> ${appointment.reason}</p>
              <p><strong>Status:</strong> <span style="color: #ef4444; font-weight: bold;">Cancelled</span></p>
            </div>
            
            <p>I apologize for any inconvenience this may cause. Please feel free to book a new appointment at your convenience.</p>
            
            <p>If you have any questions or would like to reschedule, please don't hesitate to reach out.</p>
            
            <p>Best regards,<br>${this.config.adminName}</p>
          </div>
          
          <div class="footer">
            <p>This email was sent from ${this.config.siteName}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send email using the existing API endpoint
   */
  private async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
    try {
      console.log('📧 Sending email via API...');
      console.log('📧 To:', to);
      console.log('📧 Subject:', subject);
      
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

      console.log('📧 API Response Status:', response.status);
      console.log('📧 API Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('📧 API Error Response:', errorText);
        throw new Error(`Failed to send email: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📧 API Response Result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }

      console.log('📧 Email sent successfully via API');

    } catch (error) {
      console.error('📧 Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AppointmentEmailConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): AppointmentEmailConfig {
    return { ...this.config };
  }
}

// Create a singleton instance
export const appointmentEmailService = new AppointmentEmailService();
