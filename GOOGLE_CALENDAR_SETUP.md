# Google Calendar API Setup Guide

## Overview
This guide will help you set up Google Calendar API integration to automatically create calendar events with Google Meet links when users confirm mock interview sessions.

## Prerequisites
- Google Cloud Console account
- MockMeet backend server

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "MockMeet" and click "Create"

### 2. Enable Google Calendar API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials

#### Option A: Service Account (Recommended for automated calendar creation)

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name it "mockmeet-calendar-service"
4. Click "Create and Continue"
5. Grant role: "Project" → "Editor"
6. Click "Done"
7. Click on the created service account
8. Go to "Keys" tab → "Add Key" → "Create new key"
9. Choose "JSON" and download the file
10. Save this file as `google-credentials.json` in your server root directory

#### Option B: OAuth 2.0 Client (For user-based calendar access)

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure consent screen if prompted:
   - User Type: External
   - App name: MockMeet
   - User support email: your email
   - Developer contact: your email
4. Application type: "Web application"
5. Name: "MockMeet Calendar Integration"
6. Authorized redirect URIs: `http://localhost:5001/auth/google/callback`
7. Click "Create"
8. Copy the Client ID and Client Secret

### 4. Update Environment Variables

Add these to your `.env` file:

```env
# Google Calendar API (Service Account)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# OR Google Calendar API (OAuth 2.0)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5001/auth/google/callback
```

### 5. Install Required Package

```bash
cd server
npm install googleapis
```

### 6. Configure Calendar Service

The calendar service is already created at `server/services/calendarService.js`

For Service Account approach, update the service to use:

```javascript
const auth = new google.auth.GoogleAuth({
  keyFile: './google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/calendar'],
});
```

### 7. Grant Calendar Access (Service Account Only)

If using a service account:
1. Copy your service account email (from the JSON file)
2. Go to your Google Calendar
3. Settings → Add calendar → Subscribe to calendar
4. Share your calendar with the service account email
5. Give "Make changes to events" permission

## How It Works

1. **User A** proposes a session to **User B**
2. **User B** confirms the session
3. **Both users** confirm → System automatically:
   - Creates a Google Calendar event
   - Generates a Google Meet link
   - Sends calendar invites to both users' emails
   - Stores the meet link in the session

## Testing

1. Create a match between two users
2. Propose a session with a future date/time
3. Both users confirm the session
4. Check both users' email for calendar invite
5. Verify Google Meet link is generated
6. Check the session object for `meetLink`, `calendarEventId`, and `calendarHtmlLink`

## Troubleshooting

### Error: "Calendar API has not been used"
- Make sure you enabled Google Calendar API in Google Cloud Console

### Error: "Invalid credentials"
- Verify your service account JSON file is correct
- Check that environment variables are properly set

### Error: "Insufficient permissions"
- Make sure the service account has calendar access
- Share your calendar with the service account email

### Calendar invite not received
- Check spam folder
- Verify email addresses in User model are correct
- Check that `sendUpdates: 'all'` is set in the API call

## Alternative: Simple Meet Link Generation

If Google Calendar API setup is too complex, you can use a simpler approach:

1. Generate a random Google Meet link format: `https://meet.google.com/xxx-yyyy-zzz`
2. Store it in the session
3. Send email notifications manually using nodemailer

However, this won't create actual calendar events or official Google Meet rooms.

## Production Considerations

1. Use environment-specific credentials
2. Implement proper error handling
3. Add retry logic for API failures
4. Monitor API quota usage
5. Consider using a dedicated calendar for all MockMeet events
6. Implement webhook for calendar event updates

## Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [Google Auth Library for Node.js](https://github.com/googleapis/google-auth-library-nodejs)
- [googleapis npm package](https://www.npmjs.com/package/googleapis)
