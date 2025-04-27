import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log("Book session API called with data:", {
      summary: data.summary,
      description: data.description?.substring(0, 50) + "...",
      startTime: data.startTime,
      endTime: data.endTime,
      formData: data.formData ? "Present" : "Missing"
    });
    
    // Create calendar event through the new API route
    console.log("Calling calendar API at:", `${process.env.NEXT_PUBLIC_URL}/api/calendar`);
    const calendarResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calendar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: data.summary || 'Booking Session',
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
      }),
    });

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      console.error("Calendar API error:", {
        status: calendarResponse.status,
        statusText: calendarResponse.statusText,
        responseText: errorText.substring(0, 200) // Log first 200 chars
      });
      throw new Error(`Failed to create calendar event: ${calendarResponse.status} ${calendarResponse.statusText}`);
    }

    const calendarResult = await calendarResponse.json();
    console.log("Calendar API success:", {
      eventId: calendarResult.id,
      htmlLink: calendarResult.htmlLink?.substring(0, 50) + "..."
    });

    // Send email notification
    const functionUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTION_URL || '';
    console.log("Calling Firebase function at:", functionUrl);
    
    const emailPayload = {
      formData: data.formData,
      selectedDate: data.startTime,
      selectedTime: new Date(data.startTime).toLocaleTimeString(),
      calendarLink: calendarResult.htmlLink,
    };
    
    console.log("Email payload:", JSON.stringify(emailPayload).substring(0, 200) + "...");
    
    const emailResponse = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    // Log the raw response before trying to parse it
    const rawEmailResponse = await emailResponse.text();
    console.log("Raw email function response:", {
      status: emailResponse.status,
      statusText: emailResponse.statusText,
      contentType: emailResponse.headers.get('content-type'),
      responseText: rawEmailResponse.substring(0, 200) // Log first 200 chars
    });
    
    if (!emailResponse.ok) {
      throw new Error(`Failed to send email notification: ${emailResponse.status} ${emailResponse.statusText} - ${rawEmailResponse.substring(0, 100)}`);
    }

    // Parse the response as JSON only if it's valid JSON
    let emailResult;
    try {
      emailResult = JSON.parse(rawEmailResponse);
      console.log("Email function success:", emailResult);
    } catch (jsonError) {
      console.error("Failed to parse email function response as JSON:", jsonError);
      throw new Error("Invalid JSON response from email function");
    }

    return NextResponse.json({
      success: true,
      calendar: calendarResult,
      email: emailResult,
    });
  } catch (error: unknown) {
    console.error('Error in book-session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process booking', details: errorMessage },
      { status: 500 }
    );
  }
} 