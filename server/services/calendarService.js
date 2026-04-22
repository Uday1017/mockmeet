const { google } = require('googleapis');
const User = require('../models/User');

// Initialize auth based on environment variables
let auth;

if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
  // Service Account approach (recommended)
  auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
} else if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // OAuth2 approach
  auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  // Set refresh token if available
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }
} else {
  console.warn('⚠️  Google Calendar API credentials not configured. Calendar events will not be created.');
}

/**
 * Create a Google Calendar event with Google Meet link
 * @param {Object} session - Session object with interviewer, interviewee, scheduledAt, duration, targetRole
 * @returns {Promise<Object>} - Calendar event with meet link
 */
const createCalendarEvent = async (session) => {
  try {
    if (!auth) {
      console.warn('Google Calendar API not configured. Skipping calendar event creation.');
      return { eventId: null, meetLink: null, htmlLink: null };
    }

    // Populate user details
    await session.populate('interviewer', 'name email');
    await session.populate('interviewee', 'name email');

    const interviewer = session.interviewer;
    const interviewee = session.interviewee;

    const calendar = google.calendar({ version: 'v3', auth });

    const startTime = new Date(session.scheduledAt);
    const endTime = new Date(startTime.getTime() + session.duration * 60000);

    const event = {
      summary: `MockMeet Interview: ${session.targetRole || 'Mock Interview'}`,
      description: `Mock Interview Session\n\nInterviewer: ${interviewer.name}\nInterviewee: ${interviewee.name}\n\nDifficulty: ${session.difficulty}\nTarget Role: ${session.targetRole || 'General'}\n\nPrepare well and good luck! 🚀\n\nPowered by MockMeet`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: [
        { email: interviewer.email, displayName: interviewer.name },
        { email: interviewee.email, displayName: interviewee.name },
      ],
      conferenceData: {
        createRequest: {
          requestId: `mockmeet-${session._id}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'email', minutes: 60 }, // 1 hour before
          { method: 'popup', minutes: 10 }, // 10 minutes before
        ],
      },
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: true,
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Send email to all attendees
    });

    console.log('✅ Calendar event created:', response.data.id);

    return {
      eventId: response.data.id,
      meetLink: response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri,
      htmlLink: response.data.htmlLink,
    };
  } catch (error) {
    console.error('❌ Error creating calendar event:', error.message);
    throw error;
  }
};

/**
 * Update an existing calendar event
 * @param {String} eventId - Google Calendar event ID
 * @param {Object} updates - Updates to apply
 */
const updateCalendarEvent = async (eventId, updates) => {
  try {
    if (!auth) {
      console.warn('Google Calendar API not configured.');
      return null;
    }

    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      resource: updates,
      sendUpdates: 'all',
    });

    console.log('✅ Calendar event updated:', eventId);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating calendar event:', error.message);
    throw error;
  }
};

/**
 * Cancel a calendar event
 * @param {String} eventId - Google Calendar event ID
 */
const cancelCalendarEvent = async (eventId) => {
  try {
    if (!auth) {
      console.warn('Google Calendar API not configured.');
      return { success: false };
    }

    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all', // Notify all attendees
    });

    console.log('✅ Calendar event cancelled:', eventId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error canceling calendar event:', error.message);
    throw error;
  }
};

/**
 * Set OAuth2 credentials (for OAuth2 approach)
 * @param {Object} credentials - OAuth2 credentials
 */
const setCredentials = (credentials) => {
  if (auth && auth.setCredentials) {
    auth.setCredentials(credentials);
  }
};

module.exports = {
  createCalendarEvent,
  updateCalendarEvent,
  cancelCalendarEvent,
  setCredentials,
};
