// API endpoint for sending emails via Zoho SMTP
// This can be deployed to Vercel, Netlify, or similar serverless platforms

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, config } = req.body;

    // Validate required fields
    if (!to || !subject || !html || !config) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to, subject, html, config' 
      });
    }

    // Get Zoho credentials from environment variables
    const zohoEmail = process.env.ZOHO_EMAIL;
    const zohoPassword = process.env.ZOHO_APP_PASSWORD;
    const zohoHost = process.env.ZOHO_HOST || 'smtp.zoho.com';
    const zohoPort = process.env.ZOHO_PORT || 587;

    // Validate Zoho configuration
    if (!zohoEmail || !zohoPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Zoho credentials not configured in environment variables' 
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: zohoHost,
      port: zohoPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: zohoEmail,
        pass: zohoPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Send email with improved headers to reduce spam
    const info = await transporter.sendMail({
      from: `"${config.adminName || 'Victory Johnson'}" <${zohoEmail}>`,
      to: to,
      subject: subject,
      html: html,
      // Add headers to improve deliverability
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'normal',
        'X-Mailer': 'Portfolio Contact System',
        'List-Unsubscribe': `<mailto:${zohoEmail}?subject=unsubscribe>`,
        'Precedence': 'bulk',
        'X-Auto-Response-Suppress': 'OOF, AutoReply'
      },
      // Add text version for better deliverability
      text: html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
      // Add reply-to header
      replyTo: zohoEmail,
      // Add message ID for tracking
      messageId: `<${Date.now()}.${Math.random().toString(36).substr(2, 9)}@${zohoHost}>`
    });

    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
