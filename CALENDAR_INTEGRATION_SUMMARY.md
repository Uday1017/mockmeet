# Google Calendar Integration - Complete Flow

## 🎯 What We Built

Automatic Google Calendar event creation with Google Meet links when both users confirm a mock interview session.

## 📋 How It Works

### Step 1: Session Proposal
- User A (Interviewer) proposes a session to User B (Interviewee)
- Includes: date/time, duration, target role, difficulty
- Session status: `scheduled`
- Both `interviewerConfirmed` and `intervieweeConfirmed` are `false`

### Step 2: User Confirmations
- User A confirms → `interviewerConfirmed = true`
- User B confirms → `intervieweeConfirmed = true`

### Step 3: Automatic Calendar Event Creation ✨
When **BOTH** users confirm:
1. **Credits Transfer**: 1 credit deducted from interviewee, added to interviewer
2. **Calendar Event Created**:
   - Google Calendar event is created
   - Google Meet link is automatically generated
   - Calendar invites sent to both users' emails
   - Event details stored in session:
     - `meetLink`: Google Meet URL
     - `calendarEventId`: For future updates/cancellations
     - `calendarHtmlLink`: Link to view event in Google Calendar

### Step 4: Users Receive
- ✅ Email notification with calendar invite
- ✅ Google Meet link in the session
- ✅ Automatic reminders (24h, 1h, 10min before)
- ✅ Event appears in their Google Calendar

### Step 5: Session Cancellation (Optional)
If either user cancels:
- Session status → `cancelled`
- Calendar event is automatically deleted
- Both users receive cancellation notification

## 🔧 Technical Implementation

### Files Modified/Created:
1. **`server/services/calendarService.js`** - Google Calendar API integration
2. **`server/models/Session.js`** - Added `calendarEventId` and `calendarHtmlLink` fields
3. **`server/controllers/sessionController.js`** - Auto-create calendar events on confirmation
4. **`server/.env`** - Added Google Calendar API credentials
5. **`GOOGLE_CALENDAR_SETUP.md`** - Complete setup guide

### Key Functions:
- `createCalendarEvent(session)` - Creates event with Meet link
- `cancelCalendarEvent(eventId)` - Deletes calendar event
- `updateCalendarEvent(eventId, updates)` - Updates existing event

## 🚀 Setup Required

### Quick Setup (5 minutes):
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project "MockMeet"
3. Enable "Google Calendar API"
4. Create Service Account credentials
5. Download JSON key file
6. Add credentials to `.env`:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
7. Share your Google Calendar with the service account email

### Detailed Setup:
See `GOOGLE_CALENDAR_SETUP.md` for complete step-by-step instructions.

## 📊 Database Schema Changes

### Session Model - New Fields:
```javascript
{
  meetLink: String,              // Google Meet URL
  calendarEventId: String,       // Google Calendar event ID
  calendarHtmlLink: String,      // Link to view in Google Calendar
  // ... existing fields
}
```

## 🎨 Frontend Integration

The frontend already displays the `meetLink` in the Sessions page. No changes needed!

Users will see:
- "Join Meeting" button with the Google Meet link
- Calendar invite in their email
- Event in their Google Calendar

## ✅ Benefits

1. **Automatic**: No manual calendar creation needed
2. **Professional**: Official Google Meet links
3. **Reminders**: Automatic email/popup reminders
4. **Sync**: Events appear in users' calendars
5. **Cancellation**: Auto-removes cancelled sessions
6. **Attendance**: Reduces no-shows with reminders

## 🔒 Security & Privacy

- Service account has limited access (only calendar)
- Users' calendar data is not accessed
- Only creates events, doesn't read existing ones
- Credentials stored securely in environment variables

## 🧪 Testing

1. Create two test users with real email addresses
2. Create a match between them
3. User A proposes a session for tomorrow
4. User B confirms
5. User A confirms
6. Check both emails for calendar invite
7. Verify Google Meet link is generated
8. Check session object has `meetLink`, `calendarEventId`

## 🐛 Troubleshooting

### Calendar events not created?
- Check Google Calendar API is enabled
- Verify credentials in `.env` are correct
- Check server logs for error messages
- Ensure service account has calendar access

### Meet link not generated?
- Verify `conferenceDataVersion: 1` is set
- Check `conferenceData.createRequest` is properly configured
- Ensure Calendar API has Meet integration enabled

### Email invites not sent?
- Verify `sendUpdates: 'all'` is set
- Check user email addresses are valid
- Look in spam folder

## 🚀 Future Enhancements

1. **Timezone Support**: Convert times to user's timezone
2. **Recurring Sessions**: Support for weekly practice sessions
3. **Custom Reminders**: Let users choose reminder times
4. **Calendar Sync**: Two-way sync with user's calendar
5. **Meeting Recording**: Auto-record sessions for review
6. **Waiting Room**: Add waiting room to Meet links

## 📝 API Endpoints

### Existing Endpoints (Enhanced):
- `POST /api/sessions` - Propose session
- `PATCH /api/sessions/:id/confirm` - Confirm session (now creates calendar event)
- `PATCH /api/sessions/:id/cancel` - Cancel session (now deletes calendar event)
- `GET /api/sessions/upcoming` - Get upcoming sessions (includes meetLink)

## 💡 Alternative Approach (If Google Calendar Setup is Complex)

If you don't want to set up Google Calendar API, you can:

1. Use a third-party service like Calendly or Cal.com
2. Generate simple meet links: `https://meet.google.com/xxx-yyyy-zzz`
3. Send email notifications manually using nodemailer
4. Use Zoom API or other video conferencing services

However, the Google Calendar approach is recommended for:
- Professional appearance
- Automatic reminders
- Calendar integration
- Official Google Meet rooms

## 🎓 For Recruiters

This feature demonstrates:
- ✅ Third-party API integration (Google Calendar API)
- ✅ OAuth 2.0 / Service Account authentication
- ✅ Asynchronous operations and error handling
- ✅ Database schema design
- ✅ Email notification systems
- ✅ User experience optimization
- ✅ Production-ready code with proper logging

---

**Built by Uday Gundu**
- LinkedIn: https://www.linkedin.com/in/uday-gundu-4b8658268/
- GitHub: https://github.com/Uday1017
- Email: udaygundu17@gmail.com
