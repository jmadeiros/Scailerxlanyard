import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'josh@scailer.io';

async function getAuthClient() {
  console.log('Environment check:', {
    hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
    hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
    calendarIdUsed: CALENDAR_ID
  });

  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

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

    console.log('Attempting to authorize with Google...');
    await auth.authorize();
    console.log('Google authorization successful');
    return auth;
  } catch (error) {
    console.error('Google authorization failed:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    console.log('Starting calendar event creation...');
    
    // Safely parse the request body
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('Request body parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const { formData, selectedDate, selectedTime } = requestBody;
    console.log('Received data:', { selectedDate, selectedTime });

    console.log('Getting auth client...');
    const auth = await getAuthClient();
    console.log('Auth client obtained successfully');

    const calendar = google.calendar({ version: 'v3', auth });
    console.log('Calendar client created');

    const [hours, minutes] = selectedTime.split(':');
    const startTime = new Date(selectedDate);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30);

    const eventDescription = `
Strategy Session with ${formData.firstName} ${formData.lastName}

CLIENT DETAILS:
- Name: ${formData.firstName} ${formData.lastName}
- Phone: ${formData.phone}
- Email: ${formData.email}

ADDITIONAL INFORMATION:
${formData.additionalInfo || 'None provided'}

BOOKING DETAILS:
- Date: ${startTime.toLocaleDateString()}
- Time: ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}
- Duration: 30 minutes
`;

    const event = {
      summary: `Strategy Session with ${formData.firstName} ${formData.lastName}`,
      description: eventDescription,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Europe/London',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Europe/London',
      }
    };

    console.log('Creating calendar event with data:', event);
    
    // Safely make the API call
    let response;
    try {
      response = await calendar.events.insert({
        auth,
        calendarId: CALENDAR_ID,
        requestBody: event,
        conferenceDataVersion: 1
      });
      console.log('Calendar event created successfully:', response.data);
    } catch (apiError) {
      console.error('Google Calendar API error:', apiError);
      return NextResponse.json(
        { error: apiError instanceof Error ? apiError.message : 'Failed to create calendar event' },
        { status: 500 }
      );
    }

    // Safely return the response
    try {
      return NextResponse.json(response.data);
    } catch (jsonError) {
      console.error('Error serializing response:', jsonError);
      return NextResponse.json(
        { error: 'Error processing response from Google Calendar' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Calendar API error:', error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('auth')) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your Google Calendar credentials.' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Handle non-Error objects
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating the calendar event' },
      { status: 500 }
    );
  }
} 