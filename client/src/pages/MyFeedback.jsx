import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const MyFeedback = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['myReviews'],
    queryFn: async () => {
      const response = await api.get('/reviews/mine');
      return response.data;
    }
  });

  const reviews = data?.reviews || [];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-lg sm:text-xl font-bold text-indigo-600"
          >
            MockMeet
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Feedback Received</h2>
          <p className="text-sm text-gray-500 mt-1">
            See what others think about your interview performance.
          </p>
        </div>

        {isLoading ? (
          <LoadingList />
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-800 font-semibold text-lg mb-2">
              No feedback yet
            </p>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Complete a session and ask your match to give feedback.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <FeedbackCard key={review._id} review={review} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

const FeedbackCard = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const avgRating = (
    (review.ratings.technical +
      review.ratings.communication +
      review.ratings.problemSolving +
      review.ratings.overall) / 4
  ).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            {review.reviewer?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {review.reviewer?.name}
            </p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-amber-500">{avgRating} ★</p>
          <p className="text-xs text-gray-400">avg rating</p>
        </div>
      </div>

      {/* Session info */}
      {review.sessionId?.targetRole && (
        <div className="bg-gray-50 rounded-xl px-4 py-2 text-xs text-gray-500">
          Session for: <span className="font-medium text-gray-700">
            {review.sessionId.targetRole}
          </span>
        </div>
      )}

      {/* Ratings breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <RatingItem label="Technical Depth" value={review.ratings.technical} />
        <RatingItem label="Communication" value={review.ratings.communication} />
        <RatingItem label="Problem Solving" value={review.ratings.problemSolving} />
        <RatingItem label="Overall" value={review.ratings.overall} />
      </div>

      {/* Strengths */}
      {review.strengths?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">
            ✅ What you did well
          </p>
          <div className="flex flex-wrap gap-2">
            {review.strengths.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {review.improvements?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">
            📈 Areas to improve
          </p>
          <div className="flex flex-wrap gap-2">
            {review.improvements.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      {review.comments && (
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-600 mb-1">💬 Comments</p>
          <p className="text-sm text-gray-600">{review.comments}</p>
        </div>
      )}

      {/* Would interview again */}
      <div className={`px-4 py-2 rounded-xl text-xs font-medium ${
        review.wouldInterviewAgain
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-600'
      }`}>
        {review.wouldInterviewAgain
          ? '✓ They would interview you again'
          : '✗ They would not interview you again'
        }
      </div>

    </div>
  );
};

const RatingItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl px-3 py-2">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={`text-sm ${star <= value ? 'text-amber-400' : 'text-gray-200'}`}>
          ★
        </span>
      ))}
    </div>
  </div>
);

const LoadingList = () => (
  <div className="space-y-4">
    {[1, 2].map(i => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-3 w-28 bg-gray-200 rounded" />
            <div className="h-2 w-20 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(j => (
            <div key={j} className="h-14 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default MyFeedback;
