import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const Questions = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['sessionQuestions', sessionId],
    queryFn: async () => {
      const response = await api.get(`/sessions/${sessionId}/questions`);
      return response.data;
    }
  });

  const questions = data?.questions || [];

  const topicColors = {
    'DSA': 'bg-blue-50 text-blue-600',
    'System Design': 'bg-purple-50 text-purple-600',
    'CS Fundamentals': 'bg-amber-50 text-amber-600',
    'Behavioral': 'bg-green-50 text-green-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xl font-bold text-indigo-600"
          >
            MockMeet
          </button>
          <button
            onClick={() => navigate('/sessions')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Sessions
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">✨</span>
            <h2 className="text-2xl font-bold text-gray-800">
              AI Generated Questions
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Tailored questions for this session. Use these to conduct a structured interview.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
            Failed to load questions. Please try again.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                {/* Question number + topic */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400">
                    Question {index + 1}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    topicColors[q.topic] || 'bg-gray-100 text-gray-600'
                  }`}>
                    {q.topic}
                  </span>
                </div>

                {/* Question */}
                <p className="text-sm font-medium text-gray-800 mb-3 leading-relaxed">
                  {q.question}
                </p>

                {/* Hint */}
                {q.hint && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                    <p className="text-xs font-semibold text-amber-700 mb-0.5">
                      💡 Interviewer hint
                    </p>
                    <p className="text-xs text-amber-600">{q.hint}</p>
                  </div>
                )}

              </div>
            ))}

            {/* Note */}
            <div className="bg-indigo-50 rounded-2xl px-5 py-4">
              <p className="text-xs font-semibold text-indigo-700 mb-1">
                📝 How to use these
              </p>
              <p className="text-xs text-indigo-600 leading-relaxed">
                Share this screen with your interviewee or pick questions you like.
                The hints are only visible to you as the interviewer.
                Questions are cached — refreshing won't change them.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Questions;
