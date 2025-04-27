# Scailer Booking System

A booking system for Scailer with Google Calendar integration and email notifications.

## Features

- Book strategy sessions with date and time selection
- Google Calendar integration for event creation
- Email notifications for both clients and admin
- Responsive design for all devices

## Development

To run the development server:

```bash
npm run dev
```

This will start the Next.js development server at http://localhost:3001.

## Deployment

### Prerequisites

1. Make sure you have the Firebase CLI installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```bash
   firebase login
   ```

3. Ensure your Firebase project is set up and configured in `.firebaserc`.

### Deploy the Application

To deploy the entire application (website and Cloud Functions):

```bash
npm run deploy
```

This will:
1. Build the Next.js application
2. Create necessary files for client-side routing
3. Deploy to Firebase Hosting

### Deploy Only Cloud Functions

If you only need to update the Cloud Functions:

```bash
npm run deploy:functions
```

## Email Configuration

The booking system uses Gmail for sending emails. To configure email sending:

1. Set up an App Password in your Google Account:
   - Go to your Google Account settings
   - Navigate to Security → App passwords
   - Create a new App Password for "Scailer Booking System"

2. Update the `.env.local` file with your email credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ADMIN_EMAIL=admin-email@gmail.com
   ```

3. For production, update the same variables in the Firebase Cloud Functions environment.

## Google Calendar Integration

The booking system integrates with Google Calendar. To configure:

1. Set up a Google Cloud project and enable the Google Calendar API
2. Create a service account and download the credentials
3. Update the `.env.local` file with your Google Calendar credentials:
   ```
   GOOGLE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key\n-----END PRIVATE KEY-----\n"
   GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
   ```

## Testing

To test the booking system, navigate to `/test-booking` in your browser. This page provides a simple interface to test the entire booking flow, including:

1. Creating a calendar event
2. Sending confirmation emails
3. Sending admin notification emails

## Troubleshooting

### Email Issues

If emails are not being sent:

1. Check that your App Password is correct
2. Ensure your Google account allows less secure apps or has the correct App Password
3. Check the console logs for error messages

### Calendar Issues

If calendar events are not being created:

1. Verify your Google Cloud project has the Calendar API enabled
2. Check that your service account has the correct permissions
3. Ensure the GOOGLE_PRIVATE_KEY is properly formatted with newlines
