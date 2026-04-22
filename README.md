# 🎯 MockMeet - Peer-to-Peer Mock Interview Platform

A full-stack web application that connects professionals for peer-to-peer mock interviews using a credit-based economy system. Practice your interview skills by both teaching and learning from others.

## Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Discover Matches
![Matches](./screenshots/matches.png)

### Sessions Management
![Sessions](./screenshots/sessions.png)

### Feedback System
![Feedback](./screenshots/feedback.png)

##  Features

### Core Functionality
-  **User Authentication** - Secure JWT-based authentication with email/password
-  **Smart Matching Algorithm** - Connects users based on complementary skills
-  **Real-time Chat** - Socket.io powered instant messaging between matched users
-  **Session Management** - Schedule, confirm, and manage mock interview sessions
-  **Credit Economy** - Earn credits by teaching, spend credits to learn
-  **Reputation System** - Build your reputation through quality sessions
-  **Feedback System** - Give and receive detailed feedback after sessions
-  **Video Integration** - Automatic Google Meet/Jitsi Meet link generation
-  **Email Notifications** - Automated reminders and calendar invites
-  **Fully Responsive** - Optimized for mobile, tablet, and desktop

### Advanced Features
-  **AI-Powered Feedback** - Gemini AI generates structured interview feedback
-  **Analytics Dashboard** - Track your sessions, reputation, and progress
-  **Smart Notifications** - Real-time updates for matches, sessions, and messages
-  **Profile Pictures** - Cloudinary integration for image uploads
-  **Google Calendar Integration** - Automatic calendar event creation with reminders
-  **Modern UI/UX** - Beautiful gradient designs with Tailwind CSS v4

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management
- **Socket.io Client** - Real-time communication
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **Socket.io** - WebSocket server
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Node-cron** - Scheduled jobs

### APIs & Services
- **Google Calendar API** - Calendar event management
- **Google Gemini AI** - AI-powered feedback generation
- **Cloudinary** - Image hosting and optimization
- **Nodemailer** - Email service
- **Jitsi Meet** - Video conferencing fallback

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mockmeet.git
cd mockmeet
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create `.env` file in `/server`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mockmeet

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Google Calendar (Optional)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"

# Frontend URL
CLIENT_URL=http://localhost:5173
```

Create `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

5. **Run the application**

Terminal 1 - Start server:
```bash
cd server
npm run dev
```

Terminal 2 - Start client:
```bash
cd client
npm run dev
```

## 📁 Project Structure

```
mockmeet/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth, Socket)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── socket/           # Socket.io handlers
│   └── server.js         # Entry point
│
└── README.md
```

## 🎮 How It Works

### Credit Economy System
1. **New users start with 5 credits**
2. **Teach a session** → Earn 1 credit
3. **Take a session** → Spend 1 credit
4. Balance maintained by both teaching and learning

### Matching Flow
1. Set your skills (offered & wanted) in profile
2. Browse matches in Discover tab
3. Send match request to users
4. Chat with matched users
5. Schedule mock interview sessions

### Session Flow
1. Propose a session with date/time
2. Both users confirm the session
3. Automatic calendar invite sent with meet link
4. Attend the session via video call
5. Provide feedback after completion

##  Key Features Explained

### Smart Matching Algorithm
- Matches users based on complementary skills
- Shows match percentage based on skill overlap
- Inclusive system - shows all users even with 0% match
- Sorted by best matches first

### Reputation System
- Starts at 5.0 stars
- Increases with positive feedback
- Decreases with no-shows or negative feedback
- Affects match visibility and credibility

### Real-time Features
- Instant chat messages
- Live notifications for matches and sessions
- Online/offline status indicators
- Typing indicators in chat

##  Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes with middleware
- Input validation and sanitization
- Secure file uploads with Cloudinary
- Environment variable protection

##  Responsive Design

Fully optimized for:
-  Mobile (320px+)
-  Tablet (640px+)
-  Laptop (1024px+)
-  Desktop (1280px+)

##  Contributing

This is a personal resume project. Feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this project for learning purposes.

##  Author

**Uday Gundu**
- GitHub: [@Uday1017](https://github.com/Uday1017)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/uday-gundu-4b8658268/)
- Email: udaygundu17@gmail.com

## 🙏 Acknowledgments

- Built as a full-stack portfolio project
- Inspired by the need for peer-to-peer interview practice
- Thanks to all open-source libraries used

---

⭐ If you found this project helpful, please give it a star!
