# 📊 Visual Flow Diagram

## Complete Session Scheduling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER A (INTERVIEWER)                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Proposes Session
                                  │ • Date: Tomorrow 6 PM
                                  │ • Duration: 60 min
                                  │ • Role: SDE-1
                                  │ • Difficulty: Medium
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SESSION CREATED                             │
│  Status: scheduled                                                  │
│  interviewerConfirmed: false                                        │
│  intervieweeConfirmed: false                                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Notification sent
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         USER B (INTERVIEWEE)                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Confirms Session
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SESSION UPDATED                             │
│  intervieweeConfirmed: true ✅                                      │
│  interviewerConfirmed: false                                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Notification sent
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         USER A (INTERVIEWER)                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Confirms Session
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BOTH CONFIRMED! 🎉                          │
│  interviewerConfirmed: true ✅                                      │
│  intervieweeConfirmed: true ✅                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐
    │   CREDIT TRANSFER         │   │   CALENDAR EVENT          │
    │                           │   │   CREATION                │
    │  User B: -1 credit        │   │                           │
    │  User A: +1 credit        │   │  Try Google Calendar API  │
    │                           │   │         │                 │
    │  creditsTransferred: true │   │         ├─ Success        │
    └───────────────────────────┘   │         │  └─ Google Meet │
                                    │         │                 │
                                    │         └─ Fail           │
                                    │            └─ Jitsi Meet  │
                                    └───────────────────────────┘
                                                │
                                                ▼
                    ┌───────────────────────────────────────────┐
                    │      SESSION UPDATED WITH MEET LINK       │
                    │                                           │
                    │  meetLink: "https://meet.google.com/..."  │
                    │  calendarEventId: "event123"              │
                    │  calendarHtmlLink: "https://calendar..."  │
                    └───────────────────────────────────────────┘
                                                │
                    ┌───────────────────────────┴───────────────────────────┐
                    │                                                       │
                    ▼                                                       ▼
    ┌───────────────────────────┐                       ┌───────────────────────────┐
    │   USER A RECEIVES         │                       │   USER B RECEIVES         │
    │                           │                       │                           │
    │  📧 Calendar Invite       │                       │  📧 Calendar Invite       │
    │  📅 Google Calendar Event │                       │  📅 Google Calendar Event │
    │  🔗 Meet Link in App      │                       │  🔗 Meet Link in App      │
    │  🔔 Reminders Set         │                       │  🔔 Reminders Set         │
    └───────────────────────────┘                       └───────────────────────────┘
```

---

## Reminder Flow

```
                    SESSION SCHEDULED
                           │
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   24h Before         1h Before         10min Before
        │                  │                  │
        ▼                  ▼                  ▼
    ┌───────┐          ┌───────┐          ┌───────┐
    │ 📧    │          │ 📧    │          │ 🔔    │
    │ Email │          │ Email │          │ Popup │
    └───────┘          └───────┘          └───────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           ▼
                    USERS REMINDED
```

---

## Cancellation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER CANCELS SESSION                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SESSION STATUS UPDATED                           │
│  status: "cancelled"                                                │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              DELETE GOOGLE CALENDAR EVENT                           │
│  calendarService.cancelCalendarEvent(calendarEventId)               │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐
    │   USER A NOTIFIED         │   │   USER B NOTIFIED         │
    │                           │   │                           │
    │  📧 Cancellation Email    │   │  📧 Cancellation Email    │
    │  📅 Event Removed         │   │  📅 Event Removed         │
    │  🔔 No More Reminders     │   │  🔔 No More Reminders     │
    └───────────────────────────┘   └───────────────────────────┘
```

---

## Google Calendar API Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BOTH USERS CONFIRMED                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              CHECK GOOGLE CALENDAR API CONFIG                       │
│  Is GOOGLE_SERVICE_ACCOUNT_EMAIL set?                               │
│  Is GOOGLE_PRIVATE_KEY set?                                         │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                YES │                           │ NO
                    ▼                           ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐
    │   USE GOOGLE CALENDAR     │   │   USE JITSI MEET          │
    │                           │   │   (FALLBACK)              │
    │  1. Authenticate          │   │                           │
    │  2. Create event          │   │  Generate Jitsi link:     │
    │  3. Generate Meet link    │   │  meet.jit.si/MockMeet-ID  │
    │  4. Send invites          │   │                           │
    │  5. Set reminders         │   │  Save to session          │
    │                           │   │                           │
    │  ✅ Professional          │   │  ✅ Works immediately     │
    │  ✅ Calendar invites      │   │  ✅ No setup required     │
    │  ✅ Auto reminders        │   │  ✅ Free forever          │
    └───────────────────────────┘   └───────────────────────────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │   SAVE MEET LINK          │
                    │   TO SESSION              │
                    └───────────────────────────┘
```

---

## Database State Changes

```
INITIAL STATE (After Proposal)
┌─────────────────────────────────────────────────────────────────────┐
│ Session {                                                           │
│   interviewer: ObjectId("user1"),                                   │
│   interviewee: ObjectId("user2"),                                   │
│   scheduledAt: "2025-01-15T18:00:00Z",                              │
│   duration: 60,                                                     │
│   status: "scheduled",                                              │
│   interviewerConfirmed: false,                                      │
│   intervieweeConfirmed: false,                                      │
│   meetLink: "",                                                     │
│   calendarEventId: "",                                              │
│   calendarHtmlLink: "",                                             │
│   creditsTransferred: false                                         │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ User B confirms
                                  ▼
AFTER INTERVIEWEE CONFIRMS
┌─────────────────────────────────────────────────────────────────────┐
│ Session {                                                           │
│   ...                                                               │
│   interviewerConfirmed: false,                                      │
│   intervieweeConfirmed: true, ✅                                    │
│   ...                                                               │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ User A confirms
                                  ▼
AFTER BOTH CONFIRM (FINAL STATE)
┌─────────────────────────────────────────────────────────────────────┐
│ Session {                                                           │
│   interviewer: ObjectId("user1"),                                   │
│   interviewee: ObjectId("user2"),                                   │
│   scheduledAt: "2025-01-15T18:00:00Z",                              │
│   duration: 60,                                                     │
│   status: "scheduled",                                              │
│   interviewerConfirmed: true, ✅                                    │
│   intervieweeConfirmed: true, ✅                                    │
│   meetLink: "https://meet.google.com/abc-defg-hij", ✅              │
│   calendarEventId: "event123abc", ✅                                │
│   calendarHtmlLink: "https://calendar.google.com/...", ✅           │
│   creditsTransferred: true ✅                                       │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## User Credits Flow

```
BEFORE SESSION CONFIRMATION
┌─────────────────────────────────────────────────────────────────────┐
│ User A (Interviewer)                                                │
│ credits: 5                                                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ User B (Interviewee)                                                │
│ credits: 3                                                          │
└─────────────────────────────────────────────────────────────────────┘

                                  │
                                  │ Both confirm
                                  ▼

AFTER SESSION CONFIRMATION
┌─────────────────────────────────────────────────────────────────────┐
│ User A (Interviewer)                                                │
│ credits: 6 (+1) ✅                                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ User B (Interviewee)                                                │
│ credits: 2 (-1) ✅                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Email Timeline

```
TIME: Session Confirmed
│
├─ 📧 Immediate: Calendar Invite
│   Subject: "Invitation: MockMeet Interview: SDE-1"
│   Content: Event details + Meet link
│   Action: Add to calendar
│
├─ 📧 24 Hours Before
│   Subject: "Reminder: MockMeet Interview tomorrow"
│   Content: Preparation checklist
│   Action: Review questions
│
├─ 📧 1 Hour Before
│   Subject: "Starting soon: MockMeet Interview in 1 hour"
│   Content: Last-minute checklist + Meet link
│   Action: Join early
│
└─ 🔔 10 Minutes Before
    Type: Popup notification
    Content: "Starting in 10 minutes"
    Action: Join now
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                  │
│  (React + Vite)                                                     │
│                                                                     │
│  • Sessions.jsx - Display sessions & meet links                    │
│  • "Join Meeting" button                                           │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP Requests
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                   │
│  (Node.js + Express)                                                │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ sessionController.js                                        │   │
│  │  • proposeSession()                                         │   │
│  │  • confirmSession() ← Creates calendar event               │   │
│  │  • cancelSession() ← Deletes calendar event                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                  │                                  │
│                    ┌─────────────┴─────────────┐                    │
│                    │                           │                    │
│                    ▼                           ▼                    │
│  ┌─────────────────────────────┐   ┌───────────────────────────┐   │
│  │ calendarService.js          │   │ simpleMeetService.js      │   │
│  │  • createCalendarEvent()    │   │  • generateJitsiLink()    │   │
│  │  • cancelCalendarEvent()    │   │  • generateZoomLink()     │   │
│  │  • updateCalendarEvent()    │   │  • generateTeamsLink()    │   │
│  └─────────────────────────────┘   └───────────────────────────┘   │
│                    │                                                │
│                    ▼                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ creditService.js                                            │   │
│  │  • transferCredits()                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   GOOGLE CALENDAR API     │   │   MONGODB DATABASE        │
│                           │   │                           │
│  • Create events          │   │  • Session collection     │
│  • Generate Meet links    │   │  • User collection        │
│  • Send invites           │   │  • Match collection       │
│  • Set reminders          │   │                           │
└───────────────────────────┘   └───────────────────────────┘
```

---

**Visual guides complete! 🎨**

Use these diagrams to understand the complete flow at a glance.
