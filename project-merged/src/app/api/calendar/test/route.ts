import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'josh@scailer.io';

async function testAuth() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

    if (!privateKey || !clientEmail) {
      return {
        success: false,
        error: 'Missing required environment variables',
        details: {
          hasPrivateKey: !!privateKey,
          hasClientEmail: !!clientEmail
        }
      };
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: SCOPES,
    });

    await auth.authorize();
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Try to list a single event to verify access
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      maxResults: 1,
    });

    return {
      success: true,
      calendarId: CALENDAR_ID,
      hasEvents: response.data.items && response.data.items.length > 0
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      type: error instanceof Error ? error.constructor.name : typeof error
    };
  }
}

export async function GET() {
  const result = await testAuth();
  return NextResponse.json(result);
} 