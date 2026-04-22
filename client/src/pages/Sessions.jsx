import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Sessions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showProposeForm, setShowProposeForm] = useState(false);

  // ── Fetch upcoming sessions ──
  const { data: upcomingData, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['upcomingSessions'],
    queryFn: async () => {
      const response = await api.get('/sessions/upcoming');
      return response.data;
    }
  });

  // ── Fetch past sessions ──
  const { data: pastData, isLoading: loadingPast } = useQuery({
    queryKey: ['pastSessions'],
    queryFn: async () => {
      const response = await api.get('/sessions/past');
      return response.data;
    }
  });

  // ── Fetch accepted matches for propose form ──
  const { data: matchesData } = useQuery({
    queryKey: ['acceptedMatches'],
    queryFn: async () => {
      const response = await api.get('/matches/accepted');
      return response.data;
    }
  });

  // ── Confirm session ──
  const confirmSession = useMutation({
    mutationFn: async (sessionId) => {
      const response = await api.patch(`/sessions/${sessionId}/confirm`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['upcomingSessions']);
      queryClient.invalidateQueries(['pastSessions']);
    }
  });

  // ── Cancel session ──
  const cancelSession = useMutation({
    mutationFn: async (sessionId) => {
      const response = await api.patch(`/sessions/${sessionId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['upcomingSessions']);
      queryClient.invalidateQueries(['pastSessions']);
    }
  });

  const upcoming = upcomingData?.sessions || [];
  const past = pastData?.sessions || [];
  const matches = matchesData?.matches || [];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-lg sm:text-xl font-bold text-indigo-600"
          >
            MockMeet
          </button>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/matches')}
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-700"
            >
              Matches
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-700"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Sessions</h2>
            <p className="text-sm text-gray-500 mt-1">
              Schedule and manage your mock interview sessions.
            </p>
          </div>
          <button
            onClick={() => setShowProposeForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors w-full sm:w-auto"
          >
            + Propose Session
          </button>
        </div>

        {/* Propose form modal */}
        {showProposeForm && (
          <ProposeSessionForm
            matches={matches}
            userId={user?._id}
            onClose={() => setShowProposeForm(false)}
            onSuccess={() => {
              setShowProposeForm(false);
              queryClient.invalidateQueries(['upcomingSessions']);
            }}
          />
        )}

        {/* Tabs */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-4 sm:mb-6 w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming {upcoming.length > 0 && (
              <span className="ml-1 bg-indigo-100 text-indigo-600 text-xs px-1.5 py-0.5 rounded-full">
                {upcoming.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'past'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past
          </button>
        </div>

        {/* Upcoming sessions */}
        {activeTab === 'upcoming' && (
          <>
            {loadingUpcoming ? (
              <LoadingList />
            ) : upcoming.length === 0 ? (
              <EmptyState
                message="No upcoming sessions"
                description="Propose a session with one of your matches to get started."
                buttonText="Propose Session"
                onClick={() => setShowProposeForm(true)}
              />
            ) : (
              <div className="space-y-4">
                {upcoming.map(session => (
                  <SessionCard
                    key={session._id}
                    session={session}
                    currentUserId={user?._id}
                    onConfirm={() => confirmSession.mutate(session._id)}
                    onCancel={() => cancelSession.mutate(session._id)}
                    onReview={() => navigate(`/review/${session._id}`)}
                    onViewQuestions={() => navigate(`/questions/${session._id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Past sessions */}
        {activeTab === 'past' && (
          <>
            {loadingPast ? (
              <LoadingList />
            ) : past.length === 0 ? (
              <EmptyState
                message="No past sessions yet"
                description="Your completed sessions will appear here."
              />
            ) : (
              <div className="space-y-4">
                {past.map(session => (
                  <SessionCard
                    key={session._id}
                    session={session}
                    currentUserId={user?._id}
                    isPast={true}
                    onReview={() => navigate(`/review/${session._id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

// ── Propose session form ──
const ProposeSessionForm = ({ matches, userId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    matchId: '',
    scheduledAt: '',
    duration: 60,
    targetRole: '',
    difficulty: 'medium',
    meetLink: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/sessions', form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to propose session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">Propose a Session</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Select match */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Match
            </label>
            <select
              value={form.matchId}
              onChange={(e) => setForm({ ...form, matchId: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a match...</option>
              {matches.map(match => {
                const other = match.userA?._id === userId ? match.userB : match.userA;
                return (
                  <option key={match._id} value={match._id}>
                    {other?.name} ({match.matchScore}% match)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Date and time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <select
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
          </div>

          {/* Target role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Role
            </label>
            <input
              type="text"
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
              placeholder="e.g. SDE-1, Backend Engineer"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <div className="flex gap-2">
              {['easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm({ ...form, difficulty: d })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                    form.difficulty === d
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Meet link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meet Link <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={form.meetLink}
              onChange={(e) => setForm({ ...form, meetLink: e.target.value })}
              placeholder="https://meet.google.com/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Proposing...' : 'Propose Session'}
          </button>

        </form>
      </div>
    </div>
  );
};

// ── Session card ──
const SessionCard = ({ session, currentUserId, isPast, onConfirm, onCancel, onReview, onViewQuestions }) => {
  const isInterviewer = session.interviewer?._id === currentUserId;
  const otherUser = isInterviewer ? session.interviewee : session.interviewer;

  const scheduledDate = new Date(session.scheduledAt);
  const dateStr = scheduledDate.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
  const timeStr = scheduledDate.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  });

  const statusColors = {
    scheduled: 'bg-blue-50 text-blue-600',
    completed: 'bg-green-50 text-green-600',
    cancelled: 'bg-gray-100 text-gray-500',
    'no-show': 'bg-red-50 text-red-500',
  };

  const difficultyColors = {
    easy: 'bg-green-50 text-green-600',
    medium: 'bg-amber-50 text-amber-600',
    hard: 'bg-red-50 text-red-600',
  };

  const hasConfirmed = isInterviewer
    ? session.interviewerConfirmed
    : session.intervieweeConfirmed;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-4">

        {/* Left side */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
            {otherUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{otherUser?.name}</p>
            <p className="text-xs text-gray-400">
              {isInterviewer ? 'You are interviewing them' : 'They are interviewing you'}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[session.status]}`}>
          {session.status}
        </span>

      </div>

      {/* Session details */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Detail label="Date" value={dateStr} />
        <Detail label="Time" value={timeStr} />
        <Detail label="Duration" value={`${session.duration} min`} />
        <Detail
          label="Difficulty"
          value={session.difficulty}
          valueClass={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[session.difficulty]}`}
        />
      </div>

      {session.targetRole && (
        <div className="mt-2">
          <span className="text-xs text-gray-400">Target role: </span>
          <span className="text-xs font-medium text-gray-700">{session.targetRole}</span>
        </div>
      )}

      {/* Meet link */}
      {session.meetLink && (
        <a
          href={session.meetLink}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-3 text-xs text-indigo-600 hover:underline"
        >
          Join meeting →
        </a>
      )}

      {/* Actions */}
      {!isPast && session.status === 'scheduled' && (
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex gap-2">
            {!hasConfirmed && (
              <button
                onClick={onConfirm}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-xl transition-colors"
              >
                Confirm Session
              </button>
            )}
            {hasConfirmed && (
              <div className="flex-1 bg-green-50 text-green-600 text-sm font-medium py-2 rounded-xl text-center">
                ✓ You confirmed
              </div>
            )}
            <button
              onClick={onCancel}
              className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
          {/* AI Questions button */}
          <button
            onClick={onViewQuestions}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-xl transition-colors"
          >
            ✨ View AI Generated Questions
          </button>
        </div>
      )}

      {/* Review button for completed sessions */}
      {isPast && session.status === 'completed' && (
        <button
          onClick={onReview}
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-xl transition-colors"
        >
          Give Feedback
        </button>
      )}

    </div>
  );
};

// ── Detail item ──
const Detail = ({ label, value, valueClass }) => (
  <div>
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    {valueClass
      ? <span className={valueClass}>{value}</span>
      : <p className="text-xs font-medium text-gray-700">{value}</p>
    }
  </div>
);

// ── Loading skeleton ──
const LoadingList = () => (
  <div className="space-y-4">
    {[1, 2].map(i => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-3 w-32 bg-gray-200 rounded" />
            <div className="h-2 w-24 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(j => (
            <div key={j} className="h-8 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ── Empty state ──
const EmptyState = ({ message, description, buttonText, onClick }) => (
  <div className="text-center py-16">
    <p className="text-gray-800 font-semibold text-lg mb-2">{message}</p>
    <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">{description}</p>
    {buttonText && (
      <button
        onClick={onClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
      >
        {buttonText}
      </button>
    )}
  </div>
);

export default Sessions;