import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const Debug = () => {
  const { user } = useAuth();

  const { data: statsData } = useQuery({
    queryKey: ['myStats'],
    queryFn: async () => {
      const response = await api.get('/users/me/stats');
      return response.data.stats;
    },
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['allSessions'],
    queryFn: async () => {
      const [upcoming, past] = await Promise.all([
        api.get('/sessions/upcoming'),
        api.get('/sessions/past'),
      ]);
      return {
        upcoming: upcoming.data.sessions,
        past: past.data.sessions,
      };
    },
  });

  const token = localStorage.getItem('accessToken');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

        {/* Current User */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-bold mb-4 text-indigo-600">Current User (from Context)</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-bold mb-4 text-green-600">Stats (from API)</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(statsData, null, 2)}
          </pre>
        </div>

        {/* Sessions */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-bold mb-4 text-purple-600">Sessions (from API)</h2>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Upcoming Sessions:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(sessionsData?.upcoming || [], null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Past Sessions:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(sessionsData?.past || [], null, 2)}
            </pre>
          </div>
        </div>

        {/* Token */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-bold mb-4 text-orange-600">Access Token</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto break-all">
            {token || 'No token found'}
          </pre>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold mb-4 text-red-600">Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/login';
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg"
            >
              Clear All Storage & Logout
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
            >
              Reload Page
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-800">Troubleshooting</h2>
          <ul className="space-y-2 text-sm text-yellow-900">
            <li>• Check if the user email matches your new account</li>
            <li>• Check if sessions belong to this user (interviewer or interviewee should match user._id)</li>
            <li>• If you see wrong data, click "Clear All Storage & Logout" and login again</li>
            <li>• Each user should only see their own sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Debug;
