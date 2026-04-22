# 🔧 Troubleshooting: User Session Isolation

## Problem Description

You created a new account but are seeing sessions from previous accounts. This happens because:
1. You're still logged in with an old token from a previous account
2. Browser is caching the old authentication token
3. You didn't properly logout before creating the new account

## ✅ Solution: Proper Logout & Login

### Step 1: Clear Everything
1. Go to your browser
2. Open Developer Tools (F12)
3. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
4. Clear:
   - Local Storage
   - Session Storage
   - Cookies
5. Close all browser tabs with MockMeet

### Step 2: Use the Debug Page
1. Navigate to: `http://localhost:5173/debug`
2. Click "Clear All Storage & Logout"
3. This will:
   - Clear localStorage
   - Clear sessionStorage
   - Redirect to login page

### Step 3: Login with New Account
1. Login with your new email and password
2. Check the dashboard - you should see:
   - Your new email displayed
   - Credits: 3 (default for new users)
   - Sessions Given: 0
   - Sessions Taken: 0
   - No sessions in the list

## 🔍 How to Verify It's Working

### Check 1: Dashboard Header
The dashboard should show:
```
Welcome back, [Your Name]!
Logged in as: your-new-email@example.com
```

### Check 2: Stats
- Credits: 3 (new users start with 3)
- Reputation: 5.0 (default)
- Sessions Given: 0
- Sessions Taken: 0

### Check 3: Sessions Page
- Should show "No upcoming sessions"
- Should show "No past sessions yet"

### Check 4: Debug Page
Go to `/debug` and verify:
- User email matches your new account
- Stats show 0 sessions
- Sessions arrays are empty

## 🛡️ How User Isolation Works

### Backend Protection
Every API endpoint checks `req.user._id` from the JWT token:

```javascript
// Get upcoming sessions
const sessions = await Session.find({
  $or: [
    { interviewer: req.user._id },  // User is interviewer
    { interviewee: req.user._id }   // User is interviewee
  ],
  status: "scheduled",
  scheduledAt: { $gte: new Date() },
});
```

This ensures:
- ✅ Users only see sessions where they are interviewer OR interviewee
- ✅ No user can see another user's sessions
- ✅ Each account is completely isolated

### Frontend Protection
The frontend uses the JWT token from localStorage:

```javascript
// API interceptor adds token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🐛 Common Issues & Fixes

### Issue 1: Seeing Old Sessions
**Cause**: Still logged in with old token
**Fix**: 
1. Go to `/debug`
2. Click "Clear All Storage & Logout"
3. Login again with new account

### Issue 2: Wrong Stats Showing
**Cause**: Browser cached old user data
**Fix**:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or clear browser cache
3. Or use incognito/private window

### Issue 3: Token Not Updating
**Cause**: Multiple tabs open with different accounts
**Fix**:
1. Close ALL browser tabs
2. Clear storage
3. Open ONE tab and login

### Issue 4: Sessions from Other Users
**Cause**: Database has sessions with your old account
**Fix**: This is normal! Those sessions belong to your old account. Your new account should show 0 sessions.

## 🧪 Testing User Isolation

### Test 1: Create Two Accounts
1. Create Account A (email: user1@test.com)
2. Logout completely
3. Create Account B (email: user2@test.com)
4. Verify Account B shows 0 sessions

### Test 2: Create Session Between Accounts
1. Login as Account A
2. Create a match with Account B
3. Propose a session
4. Logout
5. Login as Account B
6. Confirm the session
7. Verify: Account B sees 1 session (as interviewee)
8. Logout
9. Login as Account A
10. Verify: Account A sees 1 session (as interviewer)

### Test 3: Check Isolation
1. Login as Account A
2. Note the session ID
3. Logout
4. Login as Account B
5. Try to access Account A's session
6. Should see: "Not authorized" or session not visible

## 📝 Best Practices

### When Creating New Accounts:
1. ✅ Always logout first
2. ✅ Clear browser storage
3. ✅ Use incognito mode for testing
4. ✅ Verify email in dashboard header

### When Testing:
1. ✅ Use different browsers for different accounts
2. ✅ Use incognito windows
3. ✅ Check `/debug` page to verify user
4. ✅ Hard refresh after login

### When Developing:
1. ✅ Never share tokens between accounts
2. ✅ Always check `req.user._id` in backend
3. ✅ Use proper logout that clears all storage
4. ✅ Test with multiple accounts

## 🔐 Security Features

### JWT Token
- Contains user ID
- Expires after 15 minutes
- Verified on every request
- Cannot be forged

### Session Isolation
- Database queries filter by user ID
- No user can access another user's data
- All endpoints are protected
- Authorization checked on every request

### Logout
- Clears localStorage
- Clears sessionStorage
- Invalidates token
- Redirects to login

## 🚀 Quick Fix Commands

### Clear Everything (Browser Console)
```javascript
localStorage.clear();
sessionStorage.clear();
window.location.href = '/login';
```

### Check Current User (Browser Console)
```javascript
console.log('Token:', localStorage.getItem('accessToken'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### Force Logout (Browser Console)
```javascript
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
window.location.href = '/login';
```

## 📊 Debug Page Features

Access at: `http://localhost:5173/debug`

Shows:
- ✅ Current user info (from context)
- ✅ Stats (from API)
- ✅ All sessions (from API)
- ✅ Current JWT token
- ✅ Quick action buttons

Use this page to:
- Verify which user is logged in
- Check if sessions belong to current user
- Clear storage and logout
- Troubleshoot authentication issues

## ✨ Improved Logout

The logout function now:
```javascript
const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.clear();        // Clear all localStorage
    sessionStorage.clear();       // Clear all sessionStorage
    setUser(null);               // Reset user state
    window.location.href = '/login'; // Force reload
  }
};
```

This ensures:
- ✅ All storage is cleared
- ✅ User state is reset
- ✅ Page is reloaded
- ✅ No cached data remains

## 🎯 Summary

**The Issue**: You were still logged in with an old account's token

**The Fix**: 
1. Use improved logout (clears all storage)
2. Use `/debug` page to verify user
3. Always logout before creating new accounts

**The Result**: Each user now has completely isolated sessions and data!

---

**Need Help?**
1. Go to `/debug` page
2. Check which user is logged in
3. Click "Clear All Storage & Logout"
4. Login with correct account
5. Verify stats show 0 sessions for new accounts
