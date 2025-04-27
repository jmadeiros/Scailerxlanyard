import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587");
const EMAIL_SECURE = process.env.EMAIL_SECURE === "true";
const EMAIL_USER = process.env.EMAIL_USER || "josh@scailer.io";
const EMAIL_PASS = process.env.EMAIL_PASS || "owrotwhi hckoesui"; // App Password
const EMAIL_FROM = process.env.EMAIL_FROM || "josh@scailer.io";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "josh@scailer.io";

// Log environment configuration (without exposing sensitive data)
console.log("Email configuration:", {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  user: EMAIL_USER ? "Set" : "Not set",
  pass: EMAIL_PASS ? "Set" : "Not set",
  from: EMAIL_FROM,
  adminEmail: ADMIN_EMAIL,
  environment: process.env.NODE_ENV
});

// Create transporter
let transporter: nodemailer.Transporter | null = null;

// Initialize transporter
async function initializeTransporter() {
  if (transporter) return transporter;

  console.log("Initializing email transporter...");
  
  try {
    // Remove spaces from App Password
    const appPassword = EMAIL_PASS.replace(/\s+/g, "");
    
    // Create transporter with Gmail settings
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: {
        user: EMAIL_USER,
        pass: appPassword,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("SMTP connection verified successfully!");
    return transporter;
  } catch (error) {
    console.error("Failed to initialize email transporter:", error);
    
    if (process.env.NODE_ENV === 'production') {
      // In production, we should fail clearly rather than falling back to test account
      throw new Error(`Email configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Create a test account using Ethereal Email for development/testing
    console.log("Falling back to test email account...");
    const testAccount = await createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    return transporter;
  }
}

// Create a test account using Ethereal Email
async function createTestAccount() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log("Test email account created:", {
      user: testAccount.user,
      pass: testAccount.pass,
      previewURL: "https://ethereal.email",
    });
    return testAccount;
  } catch (error) {
    console.error("Failed to create test email account:", error);
    throw error;
  }
}

// Send client confirmation email
async function sendClientConfirmationEmail(formData: any, selectedDate: string, selectedTime: string, calendarLink?: string) {
  const emailTransporter = await initializeTransporter();
  
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const emailContent = {
    from: `"Scailer Booking" <${EMAIL_FROM}>`,
    to: formData.email,
    subject: "Your Strategy Session Confirmation",
    text: `
      Hello ${formData.firstName},

      Thank you for booking a strategy session with Scailer!

      Your session has been scheduled for ${formattedDate} at ${selectedTime}.

      ${calendarLink ? `Add to your calendar: ${calendarLink}` : ""}

      If you need to reschedule or have any questions, please reply to this email.

      Best regards,
      The Scailer Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: #25D366; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Strategy Session Confirmation</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
          <p>Hello ${formData.firstName},</p>
          
          <p>Thank you for booking a strategy session with Scailer!</p>
          
          <div style="background-color: #fff; border-left: 4px solid #25D366; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 10px 0 0;"><strong>Time:</strong> ${selectedTime}</p>
          </div>
          
          ${
            calendarLink
              ? `<p><a href="${calendarLink}" style="display: inline-block; background-color: #25D366; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Add to Calendar</a></p>`
              : ""
          }
          
          <p>If you need to reschedule or have any questions, please reply to this email.</p>
          
          <p>Best regards,<br>The Scailer Team</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #777; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Scailer. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await emailTransporter.sendMail(emailContent);
    console.log("Client confirmation email sent:", {
      messageId: info.messageId,
      previewURL: nodemailer.getTestMessageUrl(info),
    });
    return info;
  } catch (error) {
    console.error("Failed to send client confirmation email:", error);
    throw error;
  }
}

// Send admin notification email
async function sendAdminNotificationEmail(formData: any, selectedDate: string, selectedTime: string) {
  const emailTransporter = await initializeTransporter();
  
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const emailContent = {
    from: `"Scailer Booking System" <${EMAIL_FROM}>`,
    to: ADMIN_EMAIL,
    subject: `New Booking: Strategy Session with ${formData.firstName} ${formData.lastName}`,
    text: `
      New Strategy Session Booking

      Client: ${formData.firstName} ${formData.lastName}
      Email: ${formData.email}
      Phone: ${formData.phone}
      
      Date: ${formattedDate}
      Time: ${selectedTime}
      
      Additional Information:
      ${formData.additionalInfo || "None provided"}
      
      Marketing Consent: ${formData.marketingConsent ? "Yes" : "No"}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: #25D366; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">New Strategy Session Booking</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
          <h2 style="color: #25D366; margin-top: 0;">Client Details</h2>
          
          <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          
          <h2 style="color: #25D366; margin-top: 20px;">Session Details</h2>
          
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${selectedTime}</p>
          
          <h2 style="color: #25D366; margin-top: 20px;">Additional Information</h2>
          
          <p>${formData.additionalInfo || "None provided"}</p>
          
          <p><strong>Marketing Consent:</strong> ${formData.marketingConsent ? "Yes" : "No"}</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #777; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Scailer. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await emailTransporter.sendMail(emailContent);
    console.log("Admin notification email sent:", {
      messageId: info.messageId,
      previewURL: nodemailer.getTestMessageUrl(info),
    });
    return info;
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("Starting email sending process...");
    console.log("Request headers:", Object.fromEntries([...req.headers.entries()]));
    
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log("Request body parsed successfully");
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json({ 
        error: "Invalid request format",
        details: parseError instanceof Error ? parseError.message : "Unknown parsing error"
      }, { status: 400 });
    }
    
    const { formData, selectedDate, selectedTime, calendarLink } = body;

    // Validate required fields
    if (!formData || !selectedDate || !selectedTime) {
      console.error("Missing required fields:", { 
        formData: !!formData, 
        selectedDate: !!selectedDate, 
        selectedTime: !!selectedTime,
        formDataKeys: formData ? Object.keys(formData) : 'null',
        selectedDateType: selectedDate ? typeof selectedDate : 'null',
        selectedTimeType: selectedTime ? typeof selectedTime : 'null'
      });
      return NextResponse.json({ 
        error: "Missing required fields",
        details: {
          formData: !!formData, 
          selectedDate: !!selectedDate, 
          selectedTime: !!selectedTime
        }
      }, { status: 400 });
    }

    // Validate formData structure
    const requiredFormFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFormFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      console.error("Missing required form fields:", missingFields);
      return NextResponse.json({ 
        error: "Missing required form fields", 
        details: { missingFields } 
      }, { status: 400 });
    }

    console.log("Received booking request:", {
      formData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone?.substring(0, 3) + "***" // Log partial phone for privacy
      },
      selectedDate,
      selectedTime,
      hasCalendarLink: !!calendarLink,
    });

    // Send client confirmation email
    let clientEmailInfo;
    try {
      console.log("Sending client confirmation email...");
      clientEmailInfo = await sendClientConfirmationEmail(
        formData,
        selectedDate,
        selectedTime,
        calendarLink
      );
      console.log("Client confirmation email sent successfully");
    } catch (clientEmailError) {
      console.error("Failed to send client confirmation email:", clientEmailError);
      return NextResponse.json({
        error: "Failed to send client confirmation email",
        details: clientEmailError instanceof Error ? clientEmailError.message : "Unknown error"
      }, { status: 500 });
    }

    // Send admin notification email
    let adminEmailInfo;
    try {
      console.log("Sending admin notification email...");
      adminEmailInfo = await sendAdminNotificationEmail(
        formData,
        selectedDate,
        selectedTime
      );
      console.log("Admin notification email sent successfully");
    } catch (adminEmailError) {
      console.error("Failed to send admin notification email:", adminEmailError);
      // Continue even if admin email fails, as client has already been notified
    }

    // Return success response
    return NextResponse.json({
      success: true,
      clientEmail: clientEmailInfo ? {
        messageId: clientEmailInfo.messageId,
        previewURL: nodemailer.getTestMessageUrl(clientEmailInfo),
      } : null,
      adminEmail: adminEmailInfo ? {
        messageId: adminEmailInfo.messageId,
        previewURL: nodemailer.getTestMessageUrl(adminEmailInfo),
      } : null,
    });
  } catch (error: any) {
    console.error("Error sending booking emails:", error);
    return NextResponse.json({
      error: "Failed to send booking emails",
      details: error.message || "Unknown error",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 