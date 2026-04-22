# 📅 Automatic Calendar Invites & Meet Links

## ✨ Feature Overview

When both users confirm a mock interview session, the system **automatically**:
- ✅ Creates a Google Calendar event
- ✅ Generates a Google Meet link
- ✅ Sends calendar invites to both users' emails
- ✅ Sets up automatic reminders (24h, 1h, 10min before)
- ✅ Stores the meet link in the session

**Fallback**: If Google Calendar API is not configured, the system automatically generates a **Jitsi Meet** link (free, no setup required).

---

## 🚀 Quick Start (No Setup Required)

The system works **out of the box** with Jitsi Meet links!

1. User A proposes a session
2. User B confirms
3. User A confirms
4. **Boom!** A Jitsi Meet link is automatically generated: `https://meet.jit.si/MockMeet-{sessionId}`

No configuration needed. Just works! 🎉

---

## 🎯 Full Setup (Google Calendar + Google Meet)

For a more professional experience with calendar invites and official Google Meet rooms:

### Prerequisites
- Google Cloud Console account (free)
- 5-10 minutes for setup

### Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "MockMeet"
3. Enable "Google Calendar API":
   - APIs & Services → Library
   - Search "Google Calendar API"
   - Click "Enable"

### Step 2: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: `mockmeet-calendar-service`
4. Role: "Project" → "Editor"
5. Click "Done"

### Step 3: Generate Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON"
5. Download the file

### Step 4: Extract Credentials

Open the downloaded JSON file and find:
- `client_email`: Your service account email
- `private_key`: Your private key (starts with `-----BEGIN PRIVATE KEY-----`)

### Step 5: Update .env File

Add these to `server/.env`:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important**: Keep the quotes and `\n` characters in the private key!

### Step 6: Share Your Calendar

1. Open Google Calendar
2. Click Settings (gear icon) → Settings
3. Select your calendar from the left sidebar
4. Scroll to "Share with specific people"
5. Click "Add people"
6. Add your service account email (from step 4)
7. Permission: "Make changes to events"
8. Click "Send"

### Step 7: Restart Server

```bash
cd server
npm run dev
```

You should see: `✅ Google Calendar API configured`

---

## 🧪 Testing

### Test the Feature:

1. **Create two users** with real email addresses
2. **Create a match** between them
3. **User A proposes a session** for tomorrow at 6 PM
4. **User B confirms** the session
5. **User A confirms** the session
6. **Check emails** - both users should receive calendar invites
7. **Check session** - should have `meetLink` field with Google Meet URL

### Expected Results:

- ✅ Both users receive email with calendar invite
- ✅ Event appears in both users' Google Calendars
- ✅ Session has `meetLink` with Google Meet URL
- ✅ Session has `calendarEventId` and `calendarHtmlLink`
- ✅ Automatic reminders are set up

---

## 🔄 How It Works

### Flow Diagram:

```
User A proposes session
         ↓
User B confirms (intervieweeConfirmed = true)
         ↓
User A confirms (interviewerConfirmed = true)
         ↓
    BOTH CONFIRMED!
         ↓
    ┌────────────────────────────────┐
    │  1. Transfer Credits           │
    │     (1 credit: B → A)          │
    └────────────────────────────────┘
         ↓
    ┌────────────────────────────────┐
    │  2. Create Calendar Event      │
    │     - Google Calendar API      │
    │     - Generate Meet link       │
    │     - Send invites             │
    └────────────────────────────────┘
         ↓
    ┌────────────────────────────────┐
    │  3. Save to Session            │
    │     - meetLink                 │
    │     - calendarEventId          │
    │     - calendarHtmlLink         │
    └────────────────────────────────┘
         ↓
    ┌────────────────────────────────┐
    │  4. Users Receive              │
    │     - Email with invite        │
    │     - Calendar event           │
    │     - Meet link                │
    │     - Automatic reminders      │
    └────────────────────────────────┘
```

### Cancellation Flow:

```
User cancels session
         ↓
Session status = "cancelled"
         ↓
Delete Google Calendar event
         ↓
Both users notified
```

---

## 📊 Database Schema

### Session Model - New Fields:

```javascript
{
  meetLink: {
    type: String,
    default: "",
    // Google Meet URL or Jitsi Meet URL
  },
  calendarEventId: {
    type: String,
    default: "",
    // Google Calendar event ID (for updates/cancellations)
  },
  calendarHtmlLink: {
    type: String,
    default: "",
    // Link to view event in Google Calendar
  },
  // ... existing fields
}
```

---

## 🎨 Frontend Integration

The frontend already displays the meet link! No changes needed.

In `Sessions.jsx`, users see:
- "Join Meeting" button (if `meetLink` exists)
- Clicking opens the Google Meet or Jitsi Meet link

---

## 🔧 Configuration Options

### Choose Your Meeting Provider:

Edit `server/controllers/sessionController.js`:

```javascript
// Use Jitsi Meet (default, free)
session.meetLink = generateSimpleMeetLink(session, 'jitsi');

// Or use Zoom-style link
session.meetLink = generateSimpleMeetLink(session, 'zoom');

// Or use Teams-style link
session.meetLink = generateSimpleMeetLink(session, 'teams');
```

### Customize Calendar Event:

Edit `server/services/calendarService.js`:

```javascript
const event = {
  summary: `Your Custom Title`,
  description: `Your custom description`,
  // ... customize as needed
};
```

---

## 🐛 Troubleshooting

### Issue: Calendar events not created

**Solution**:
- Check if Google Calendar API is enabled
- Verify credentials in `.env` are correct
- Check server logs for error messages
- Ensure service account has calendar access

### Issue: Meet link not generated

**Solution**:
- Check if `conferenceDataVersion: 1` is set
- Verify `conferenceData.createRequest` is configured
- System will fallback to Jitsi Meet automatically

### Issue: Email invites not sent

**Solution**:
- Verify `sendUpdates: 'all'` is set in API call
- Check user email addresses are valid
- Look in spam folder
- Ensure service account has proper permissions

### Issue: "Invalid credentials" error

**Solution**:
- Verify private key format in `.env`
- Ensure `\n` characters are preserved
- Check quotes around the private key
- Regenerate key if needed

---

## 🌟 Benefits

### For Users:
- ✅ No manual calendar creation
- ✅ Automatic reminders
- ✅ Professional Google Meet rooms
- ✅ Events sync across devices
- ✅ Easy to reschedule/cancel

### For You (Developer):
- ✅ Reduces no-shows
- ✅ Professional appearance
- ✅ Automated workflow
- ✅ Great for resume/portfolio
- ✅ Shows API integration skills

---

## 📚 Files Created/Modified

### New Files:
- `server/services/calendarService.js` - Google Calendar API integration
- `server/services/simpleMeetService.js` - Fallback meet link generation
- `GOOGLE_CALENDAR_SETUP.md` - Detailed setup guide
- `CALENDAR_INTEGRATION_SUMMARY.md` - Technical summary
- `CALENDAR_INVITES_README.md` - This file

### Modified Files:
- `server/models/Session.js` - Added calendar fields
- `server/controllers/sessionController.js` - Auto-create calendar events
- `server/.env` - Added Google Calendar credentials
- `server/package.json` - Added googleapis dependency

---

## 🚀 Next Steps

### Immediate:
1. Test with Jitsi Meet (works out of the box)
2. Set up Google Calendar API (optional, for production)
3. Test with real email addresses

### Future Enhancements:
1. **Timezone Support**: Convert times to user's timezone
2. **Recurring Sessions**: Weekly practice sessions
3. **Custom Reminders**: User-configurable reminder times
4. **Meeting Recording**: Auto-record sessions
5. **Waiting Room**: Add waiting room to meetings
6. **Calendar Sync**: Two-way sync with user's calendar

---

## 💡 Alternative Approaches

### If Google Calendar is too complex:

1. **Jitsi Meet** (Current fallback):
   - Free, open-source
   - No setup required
   - Works immediately
   - Good for MVP

2. **Calendly Integration**:
   - Professional scheduling
   - Easy to set up
   - Paid service

3. **Zoom API**:
   - Popular platform
   - Requires Zoom account
   - Good video quality

4. **Microsoft Teams**:
   - Enterprise solution
   - Requires Microsoft account
   - Good for corporate users

---

## 🎓 For Recruiters

This feature demonstrates:

- ✅ **Third-party API Integration**: Google Calendar API
- ✅ **Authentication**: OAuth 2.0 / Service Account
- ✅ **Error Handling**: Graceful fallbacks
- ✅ **Database Design**: Schema evolution
- ✅ **User Experience**: Automated workflows
- ✅ **Production Ready**: Proper logging and error handling
- ✅ **Documentation**: Comprehensive guides

---

## 📞 Support

**Issues?** Check:
1. Server logs for error messages
2. Google Cloud Console for API status
3. `.env` file for correct credentials
4. `GOOGLE_CALENDAR_SETUP.md` for detailed setup

**Still stuck?** The system will automatically use Jitsi Meet as fallback!

---

## 👨‍💻 Built By

**Uday Gundu**
- LinkedIn: [linkedin.com/in/uday-gundu-4b8658268](https://www.linkedin.com/in/uday-gundu-4b8658268/)
- GitHub: [github.com/Uday1017](https://github.com/Uday1017)
- Email: udaygundu17@gmail.com

---

**Happy Interviewing! 🚀**
