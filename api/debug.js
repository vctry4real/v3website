// Debug API endpoint to check environment and dependencies
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    // Check if nodemailer is available
    const nodemailerVersion = nodemailer.version || 'unknown';
    
    // Check environment variables
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_REGION: process.env.VERCEL_REGION,
      // Add any other relevant env vars
    };

    // Test nodemailer basic functionality
    let transporterTest = 'failed';
    try {
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test',
          pass: 'test'
        }
      });
      transporterTest = 'success';
    } catch (error) {
      transporterTest = `error: ${error.message}`;
    }

    return res.status(200).json({
      success: true,
      message: 'Debug information',
      timestamp: new Date().toISOString(),
      nodemailer: {
        available: typeof nodemailer !== 'undefined',
        version: nodemailerVersion,
        createTransport: typeof nodemailer.createTransport === 'function',
        transporterTest: transporterTest
      },
      environment: envVars,
      request: {
        method: req.method,
        headers: Object.keys(req.headers),
        body: req.body ? Object.keys(req.body) : 'no body'
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
