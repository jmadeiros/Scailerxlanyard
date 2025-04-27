# Time Format Issue Fix Documentation

## Problem Description

The booking form was experiencing an error when users selected a time in 12-hour format (e.g., "03:00 PM"). The error message was "Invalid time value" and the calendar event was not being created. 

## Root Cause

The issue was identified in the `createCalendarEvent` function in `functions/index.js`. The function was using `selectedTime.split(':').map(Number)` to parse the time, which only works for 24-hour format (e.g., "15:00"). When a 12-hour format with AM/PM was provided (e.g., "03:00 PM"), the parsing would fail because:

1. The split would result in `["03", "00 PM"]`
2. The `map(Number)` would convert the second part to `NaN` because "00 PM" is not a valid number
3. This would lead to invalid hour/minute values being used in the calendar event creation

## Solution Implemented

We modified the `createCalendarEvent` function to handle both 12-hour and 24-hour time formats:

1. Added detection for AM/PM in the time string
2. Implemented regex pattern matching to extract hours, minutes, and period (AM/PM) from 12-hour format
3. Added conversion logic to transform 12-hour format to 24-hour format
4. Implemented proper handling of edge cases (12 AM = 0 hours, 12 PM = 12 hours)
5. Added extensive logging to track the parsing process
6. Added validation to ensure the time components are valid numbers

## Code Changes

The key changes were made in the `createCalendarEvent` function in `functions/index.js`:

```javascript
// Before:
const [hours, minutes] = selectedTime.split(':').map(Number);

// After:
let hours, minutes;
console.log(`Parsing time: ${selectedTime}`);

if (selectedTime.includes('AM') || selectedTime.includes('PM')) {
  // Handle 12-hour format (e.g., "03:00 PM")
  const timeRegex = /(\d+):(\d+)\s*(AM|PM)/i;
  const match = selectedTime.match(timeRegex);
  
  if (match) {
    let [_, hoursStr, minutesStr, period] = match;
    console.log(`Matched 12-hour format: hours=${hoursStr}, minutes=${minutesStr}, period=${period}`);
    
    hours = parseInt(hoursStr, 10);
    minutes = parseInt(minutesStr, 10);
    
    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }
    
    console.log(`Converted to 24-hour format: hours=${hours}, minutes=${minutes}`);
  } else {
    console.error(`Failed to parse 12-hour time format: ${selectedTime}`);
    throw new Error(`Invalid time format: ${selectedTime}`);
  }
} else {
  // Handle 24-hour format (e.g., "15:00")
  [hours, minutes] = selectedTime.split(':').map(Number);
  console.log(`Parsed 24-hour format: hours=${hours}, minutes=${minutes}`);
}

// Validate the parsed values
if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
  console.error(`Invalid time values: hours=${hours}, minutes=${minutes}`);
  throw new Error(`Invalid time value: hours=${hours}, minutes=${minutes}`);
}
```

## Previous Fixes and Related Improvements

Prior to addressing the time format issue, several other improvements were made to the booking system:

### 1. Email Notification System

The email notification system was enhanced to:
- Send confirmation emails to clients with calendar event links
- Send notification emails to administrators with booking details
- Implement robust error handling to ensure client emails are prioritized
- Add detailed logging for troubleshooting

The email notification system was initially implemented in the client-side component (`HAL900-BookingForm.tsx`) and later moved to Firebase Functions for better security and reliability.

### 2. Calendar Integration

The calendar integration underwent several improvements:
- Added proper time zone handling for calendar events
- Implemented detailed event descriptions including client information
- Created a dedicated API route (`/api/calendar`) for calendar operations
- Added a time format conversion utility in `HAL900-BookingInterface.tsx`:

```javascript
const convertTo24Hour = (time12h: string) => {
  // Extract time and AM/PM
  const timeMatch = time12h.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeMatch) {
    console.error('Invalid time format:', time12h);
    return '00:00'; // Default fallback
  }
  
  let hours = parseInt(timeMatch[1], 10);
  const minutes = timeMatch[2];
  const modifier = timeMatch[3].toUpperCase();
  
  // Convert hours based on AM/PM
  if (hours === 12) {
    hours = modifier === 'AM' ? 0 : 12;
  } else if (modifier === 'PM') {
    hours += 12;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};
```

### 3. Error Handling and Logging

Comprehensive error handling and logging were implemented throughout the application:
- Added detailed logging for API requests and responses
- Implemented error detection for HTML responses (indicating routing issues)
- Added validation for JSON parsing to prevent cryptic errors
- Implemented user-friendly error messages with toast notifications

## Environment Configuration

In addition to the code changes, we also ensured that the Firebase Functions had the correct environment variables set:

1. Verified that email configuration was properly set in Firebase Functions:
   ```
   firebase functions:config:get
   ```

2. Added Google Calendar credentials to Firebase Functions:
   ```
   firebase functions:config:set google.client_email="firebase-adminsdk-fbsvc@scailertest-37078.iam.gserviceaccount.com" google.calendar_id="josh@scailer.io"
   ```

3. Updated the code to use `functions.config()` instead of `process.env` to access environment variables in Firebase Functions.

## Google Cloud Console Setup

To ensure the booking system functions correctly, several configurations are required in the Google Cloud Console:

### 1. Firebase Blaze Plan Upgrade

The application requires the Firebase Blaze (pay-as-you-go) plan because:
- It enables outbound network requests from Firebase Functions (required for Google Calendar API)
- It allows for higher quotas on function executions and storage
- It enables access to additional Google Cloud services

Steps to upgrade:
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select the project (scailertest-37078)
3. Navigate to "Billing" from the left sidebar
4. Click "Upgrade plan" and select the "Blaze" plan
5. Complete the billing information and confirm the upgrade

### 2. Required API Permissions

The following APIs must be enabled in the Google Cloud Console:
1. Google Calendar API
2. Gmail API (if using Gmail for sending emails)
3. Cloud Functions API
4. Cloud Build API

Steps to enable APIs:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select the project (scailertest-37078)
3. Navigate to "APIs & Services" > "Library"
4. Search for each API and click "Enable"

### 3. Service Account Configuration

The application uses a service account for authentication with Google APIs:

1. Create or use an existing service account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Create a new service account or use the Firebase Admin SDK service account

2. Assign the following roles to the service account:
   - Calendar API: "Calendar Editor" role
   - Firebase: "Firebase Admin" role
   - Storage: "Storage Admin" role (if using Firebase Storage)

3. Generate and download a new private key:
   - Click on the service account
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Select JSON format and download the key file

4. Store the key securely and use it for authentication in the application

### 4. Domain Verification and Security

If using custom domains or requiring additional security:

1. Verify domain ownership:
   - Go to "APIs & Services" > "Credentials"
   - Under "Domain verification", add and verify your domain

2. Configure OAuth consent screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Set up the consent screen with appropriate information
   - Add authorized domains and scopes

3. Set up CORS configuration if needed:
   - Go to Firebase Storage or other services
   - Configure CORS settings to allow requests from your domain

## Deployment Steps

After making the changes, we deployed the updated code:

1. Deployed the Firebase Functions:
   ```
   firebase deploy --only functions
   ```

2. Rebuilt the web application:
   ```
   npm run build
   ```

3. Deployed the updated web application:
   ```
   firebase deploy --only hosting
   ```

## Testing

The fix was tested by submitting the booking form with a time in 12-hour format (e.g., "03:00 PM"). The logs confirmed that the time was correctly parsed from "03:00 PM" to "15:00" and the calendar event was successfully created.

## Future Considerations

To prevent similar issues in the future:
1. Add more robust input validation on the client side
2. Consider standardizing on either 12-hour or 24-hour format throughout the application
3. Add unit tests for time parsing logic
4. Implement more comprehensive error handling and user feedback 
5. Create a centralized time utility service for consistent time format handling across the application
6. Consider implementing end-to-end tests that simulate the entire booking flow 