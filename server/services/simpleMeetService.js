const crypto = require('crypto');

/**
 * Generate a Google Meet-style link
 * Note: This creates a link format similar to Google Meet, but it's not an official Google Meet room
 * For production, use the actual Google Calendar API integration
 * 
 * @returns {String} - Meet-style link
 */
const generateMeetLink = () => {
  // Generate random segments like Google Meet: xxx-yyyy-zzz
  const segment1 = crypto.randomBytes(2).toString('hex').substring(0, 3);
  const segment2 = crypto.randomBytes(2).toString('hex').substring(0, 4);
  const segment3 = crypto.randomBytes(2).toString('hex').substring(0, 3);
  
  return `https://meet.google.com/${segment1}-${segment2}-${segment3}`;
};

/**
 * Generate a Zoom-style link (alternative)
 * @returns {String} - Zoom-style link
 */
const generateZoomLink = () => {
  const meetingId = Math.floor(100000000 + Math.random() * 900000000);
  return `https://zoom.us/j/${meetingId}`;
};

/**
 * Generate a Jitsi Meet link (free, open-source alternative)
 * @param {String} sessionId - Session ID to create unique room
 * @returns {String} - Jitsi Meet link
 */
const generateJitsiLink = (sessionId) => {
  return `https://meet.jit.si/MockMeet-${sessionId}`;
};

/**
 * Generate a Microsoft Teams-style link
 * @returns {String} - Teams-style link
 */
const generateTeamsLink = () => {
  const meetingId = crypto.randomBytes(16).toString('hex');
  return `https://teams.microsoft.com/l/meetup-join/${meetingId}`;
};

/**
 * Simple fallback: Generate a meet link without Google Calendar API
 * This is useful when Google Calendar API is not configured
 * 
 * @param {Object} session - Session object
 * @param {String} provider - 'google', 'zoom', 'jitsi', or 'teams'
 * @returns {String} - Meeting link
 */
const generateSimpleMeetLink = (session, provider = 'jitsi') => {
  switch (provider) {
    case 'google':
      return generateMeetLink();
    case 'zoom':
      return generateZoomLink();
    case 'jitsi':
      return generateJitsiLink(session._id);
    case 'teams':
      return generateTeamsLink();
    default:
      return generateJitsiLink(session._id);
  }
};

module.exports = {
  generateMeetLink,
  generateZoomLink,
  generateJitsiLink,
  generateTeamsLink,
  generateSimpleMeetLink,
};
