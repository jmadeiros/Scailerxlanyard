const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Email configuration
const EMAIL_HOST = (functions.config().email && functions.config().email.host) 
  ? functions.config().email.host 
  : (process.env.EMAIL_HOST || "smtp.gmail.com");
  
const EMAIL_PORT = parseInt((functions.config().email && functions.config().email.port) 
  ? functions.config().email.port 
  : (process.env.EMAIL_PORT || "587"));
  
const EMAIL_SECURE = (functions.config().email && functions.config().email.secure) 
  ? functions.config().email.secure === "true" 
  : (process.env.EMAIL_SECURE === "true");
  
const EMAIL_USER = (functions.config().email && functions.config().email.user) 
  ? functions.config().email.user 
  : (process.env.EMAIL_USER || "josh@scailer.io");
  
const EMAIL_PASS = (functions.config().email && functions.config().email.pass) 
  ? functions.config().email.pass 
  : (process.env.EMAIL_PASS || "owrotwhi hckoesui"); // App Password
  
const EMAIL_FROM = (functions.config().email && functions.config().email.from) 
  ? functions.config().email.from 
  : (process.env.EMAIL_FROM || "josh@scailer.io");
  
const ADMIN_EMAIL = (functions.config().email && functions.config().email.admin) 
  ? functions.config().email.admin 
  : (process.env.ADMIN_EMAIL || "josh@scailer.io");

// Google Calendar configuration
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_ID = (functions.config().google && functions.config().google.calendar_id) 
  ? functions.config().google.calendar_id 
  : (process.env.GOOGLE_CALENDAR_ID || 'josh@scailer.io');

// Create transporter
let transporter = null;

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
    throw error;
  }
}

// Send client confirmation email
async function sendClientConfirmationEmail(formData, selectedDate, selectedTime, calendarLink) {
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
    });
    return info;
  } catch (error) {
    console.error("Failed to send client confirmation email:", error);
    throw error;
  }
}

// Send admin notification email
async function sendAdminNotificationEmail(formData, selectedDate, selectedTime) {
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
    });
    return info;
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    throw error;
  }
}

async function getAuthClient() {
  // Get config from Firebase Functions
  const config = functions.config();
  
  console.log('Environment check:', {
    hasCalendarId: !!(config.google && config.google.calendar_id),
    hasPrivateKey: !!(config.google && config.google.private_key),
    hasClientEmail: !!(config.google && config.google.client_email),
    calendarIdUsed: config.google?.calendar_id || CALENDAR_ID
  });

  // Use Firebase Functions config if available, fall back to process.env
  const privateKey = (config.google && config.google.private_key) 
    ? config.google.private_key.replace(/\\n/g, '\n') 
    : process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
  const clientEmail = (config.google && config.google.client_email)
    ? config.google.client_email
    : process.env.GOOGLE_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    console.error('Missing required environment variables:', {
      hasPrivateKey: !!privateKey,
      hasClientEmail: !!clientEmail
    });
    throw new Error('Missing required environment variables for Google Calendar');
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: SCOPES,
    });

    return auth;
  } catch (error) {
    console.error('Error creating JWT client:', error);
    throw error;
  }
}

async function createCalendarEvent(formData, selectedDate, selectedTime) {
  const auth = await getAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });

  // Add detailed logging for debugging
  console.log("createCalendarEvent received:", {
    selectedDate: selectedDate,
    selectedTime: selectedTime,
    selectedDateType: typeof selectedDate,
    selectedTimeType: typeof selectedTime
  });

  try {
    // Parse date and time
    const dateObj = new Date(selectedDate);
    console.log("Parsed date object:", {
      dateObj: dateObj,
      isValid: !isNaN(dateObj.getTime()),
      dateObjToString: dateObj.toString(),
      dateObjToISOString: dateObj.toISOString()
    });

    // Parse time - handle both 24-hour format (15:00) and 12-hour format (03:00 PM)
    let hours = 0;
    let minutes = 0;

    // Check if time includes AM/PM
    if (selectedTime.includes('AM') || selectedTime.includes('PM')) {
      // 12-hour format (e.g., "03:00 PM")
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeMatch) {
        console.error("Invalid 12-hour time format:", selectedTime);
        throw new Error("Invalid time format. Expected format: HH:MM AM/PM");
      }
      
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      const period = timeMatch[3].toUpperCase();
      
      // Convert to 24-hour format
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
    } else {
      // 24-hour format (e.g., "15:00")
      if (!selectedTime.includes(':')) {
        console.error("Invalid 24-hour time format:", selectedTime);
        throw new Error("Invalid time format. Expected format: HH:MM");
      }
      
      const timeParts = selectedTime.split(':');
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
    }

    console.log("Parsed time components:", {
      hours: hours,
      minutes: minutes,
      isHoursValid: !isNaN(hours) && hours >= 0 && hours < 24,
      isMinutesValid: !isNaN(minutes) && minutes >= 0 && minutes < 60
    });

    // Validate time components
    if (isNaN(hours) || hours < 0 || hours >= 24 || isNaN(minutes) || minutes < 0 || minutes >= 60) {
      console.error("Invalid time components:", { hours, minutes });
      throw new Error("Invalid time value");
    }

    // Create start and end times (1 hour duration)
    const startTime = new Date(dateObj);
    startTime.setHours(hours, minutes, 0, 0);
    console.log("Start time:", {
      startTime: startTime,
      isValid: !isNaN(startTime.getTime()),
      startTimeToString: startTime.toString(),
      startTimeToISOString: startTime.toISOString()
    });

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    console.log("End time:", {
      endTime: endTime,
      isValid: !isNaN(endTime.getTime()),
      endTimeToString: endTime.toString(),
      endTimeToISOString: endTime.toISOString()
    });

    // Create event
    const event = {
      summary: `Strategy Session with ${formData.firstName} ${formData.lastName}`,
      description: `
        Client: ${formData.firstName} ${formData.lastName}
        Email: ${formData.email}
        Phone: ${formData.phone}
        
        Additional Information:
        ${formData.additionalInfo || "None provided"}
      `,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Europe/London',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Europe/London',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    console.log("Calendar event payload:", {
      summary: event.summary,
      start: event.start,
      end: event.end
    });

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
      sendUpdates: 'none',
    });

    console.log('Calendar event created:', {
      id: response.data.id,
      htmlLink: response.data.htmlLink,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

// Firebase Function to send booking emails
exports.sendBookingEmails = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }
    
    try {
      console.log("Starting email sending process...");
      
      // Parse request body
      const body = req.body;
      
      // Validate required fields
      if (!body.formData || !body.selectedDate || !body.selectedTime) {
        console.error("Missing required fields:", { 
          formData: !!body.formData, 
          selectedDate: !!body.selectedDate, 
          selectedTime: !!body.selectedTime 
        });
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      
      const { formData, selectedDate, selectedTime, calendarLink } = body;
      
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
        res.status(500).json({
          error: "Failed to send client confirmation email",
          details: clientEmailError.message || "Unknown error"
        });
        return;
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
      res.status(200).json({
        success: true,
        clientEmail: clientEmailInfo ? {
          messageId: clientEmailInfo.messageId,
        } : null,
        adminEmail: adminEmailInfo ? {
          messageId: adminEmailInfo.messageId,
        } : null,
      });
    } catch (error) {
      console.error("Error sending booking emails:", error);
      res.status(500).json({
        error: "Failed to send booking emails",
        details: error.message || "Unknown error"
      });
    }
  });

// Firebase Function to create calendar event
exports.calendar = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }
    
    try {
      console.log("Starting calendar event creation process...");
      console.log("Request headers:", req.headers);
      console.log("Raw request body:", req.body);
      
      // Parse request body
      const body = req.body;
      
      // Validate required fields
      if (!body.formData || !body.selectedDate || !body.selectedTime) {
        console.error("Missing required fields:", { 
          formData: !!body.formData, 
          selectedDate: !!body.selectedDate, 
          selectedTime: !!body.selectedTime,
          bodyKeys: Object.keys(body)
        });
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      
      const { formData, selectedDate, selectedTime } = body;
      
      console.log("Received calendar event request:", {
        formData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone?.substring(0, 3) + "***" // Log partial phone for privacy
        },
        selectedDate,
        selectedTime,
        selectedDateType: typeof selectedDate,
        selectedTimeType: typeof selectedTime
      });
      
      // Create calendar event
      const calendarEvent = await createCalendarEvent(formData, selectedDate, selectedTime);
      
      // Return success response
      res.status(200).json({
        success: true,
        id: calendarEvent.id,
        htmlLink: calendarEvent.htmlLink,
      });
    } catch (error) {
      console.error("Error creating calendar event:", error);
      res.status(500).json({
        error: "Failed to create calendar event",
        details: error.message || "Unknown error"
      });
    }
  }); 