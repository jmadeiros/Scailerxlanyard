import nodemailer from 'nodemailer';
import { BookingFormData } from '@/components/HAL900-BookingForm';

// Create a transporter using environment variables or default test account
let transporter: nodemailer.Transporter;

// Initialize the transporter
async function initializeTransporter() {
  // For production, use environment variables
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('Initializing email transporter with production credentials');
    
    // Create transporter with Gmail settings
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s+/g, ''), // Remove any spaces from the App Password
      },
    });
    
    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('Email server connection verified successfully');
      return; // Return early if Gmail connection is successful
    } catch (error) {
      console.error('Email server connection failed:', error);
      console.log('Falling back to test email account');
      // Fall through to create test account
    }
  }

  // For development/testing or if Gmail fails, use Ethereal Email
  await createTestAccount();
}

// Create a test account for development
async function createTestAccount() {
  console.log('Creating test email account...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    console.log('Test email account created:', {
      user: testAccount.user,
      pass: testAccount.pass,
      previewURL: 'https://ethereal.email'
    });
  } catch (error) {
    console.error('Failed to create test email account:', error);
  }
}

// Send booking confirmation email to client
export async function sendClientConfirmationEmail(
  formData: BookingFormData,
  selectedDate: Date,
  selectedTime: string,
  calendarLink?: string
) {
  if (!transporter) {
    await initializeTransporter();
  }

  const formattedDate = selectedDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const emailContent = {
    from: `"Scailer Booking" <${process.env.EMAIL_FROM || 'bookings@scailer.io'}>`,
    to: formData.email,
    subject: 'Your Strategy Session Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: #25D366; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Strategy Session Confirmed</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #eee; background-color: #f9f9f9;">
          <p>Dear ${formData.firstName} ${formData.lastName},</p>
          
          <p>Thank you for booking a strategy session with Scailer. Your session has been confirmed for:</p>
          
          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #25D366; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${selectedTime}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> 30 minutes</p>
          </div>
          
          ${calendarLink ? `<p><a href="${calendarLink}" style="display: inline-block; background-color: #25D366; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Add to Calendar</a></p>` : ''}
          
          <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible.</p>
          
          <p>We look forward to speaking with you!</p>
          
          <p>Best regards,<br>The Scailer Team</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #777; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Scailer. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(emailContent);
    console.log('Client confirmation email sent:', {
      messageId: info.messageId,
      previewURL: nodemailer.getTestMessageUrl(info)
    });
    return info;
  } catch (error) {
    console.error('Failed to send client confirmation email:', error);
    throw error;
  }
}

// Send notification email to admin
export async function sendAdminNotificationEmail(
  formData: BookingFormData,
  selectedDate: Date,
  selectedTime: string
) {
  if (!transporter) {
    await initializeTransporter();
  }

  const formattedDate = selectedDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const adminEmail = process.env.ADMIN_EMAIL || 'josh@scailer.io';

  const emailContent = {
    from: `"Scailer Booking System" <${process.env.EMAIL_FROM || 'bookings@scailer.io'}>`,
    to: adminEmail,
    subject: `New Strategy Session Booking: ${formData.firstName} ${formData.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: #2a2a2a; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">New Strategy Session Booking</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #eee; background-color: #f9f9f9;">
          <p>A new strategy session has been booked with the following details:</p>
          
          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #25D366; margin: 20px 0;">
            <h3 style="margin-top: 0;">Session Details</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${selectedTime}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> 30 minutes</p>
          </div>
          
          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #25D366; margin: 20px 0;">
            <h3 style="margin-top: 0;">Client Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${formData.phone}</p>
            <p style="margin: 5px 0;"><strong>Marketing Consent:</strong> ${formData.marketingConsent ? 'Yes' : 'No'}</p>
          </div>
          
          ${formData.additionalInfo ? `
          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #25D366; margin: 20px 0;">
            <h3 style="margin-top: 0;">Additional Information</h3>
            <p style="margin: 5px 0;">${formData.additionalInfo}</p>
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; padding: 20px; color: #777; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Scailer. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(emailContent);
    console.log('Admin notification email sent:', {
      messageId: info.messageId,
      previewURL: nodemailer.getTestMessageUrl(info)
    });
    return info;
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    throw error;
  }
} 