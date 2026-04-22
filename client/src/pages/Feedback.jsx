import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

const STRENGTHS_SUGGESTIONS = [
  "Clear explanation",
  "Strong DSA knowledge",
  "Good problem approach",
  "Excellent communication",
  "Well structured answers",
  "Good time management",
  "Strong system design thinking",
  "Asked good clarifying questions",
];

const IMPROVEMENTS_SUGGESTIONS = [
  "Work on time complexity analysis",
  "Practice explaining thought process",
  "Improve system design basics",
  "Work on communication clarity",
  "Practice more DSA problems",
  "Improve code structure",
  "Work on behavioral answers",
  "Better edge case handling",
];

const Feedback = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [ratings, setRatings] = useState({
    technical: 0,
    communication: 0,
    problemSolving: 0,
    overall: 0,
  });
  const [strengths, setStrengths] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [wouldInterviewAgain, setWouldInterviewAgain] = useState(true);
  const [customStrength, setCustomStrength] = useState('');
  const [customImprovement, setCustomImprovement] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch session details ──
  const { data: sessionsData } = useQuery({
    queryKey: ["pastSessions"],
    queryFn: async () => {
      const response = await api.get("/sessions/past");
      return response.data;
    },
  });

  const session = sessionsData?.sessions?.find((s) => s._id === sessionId);

  const toggleTag = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all ratings filled
    const allRated = Object.values(ratings).every((r) => r > 0);
    if (!allRated) {
      setError("Please rate all 4 categories");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/reviews", {
        sessionId,
        ratings,
        strengths,
        improvements,
        wouldInterviewAgain,
        comments,
      });
      navigate("/sessions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xl font-bold text-indigo-600"
          >
            MockMeet
          </button>
          <button
            onClick={() => navigate("/sessions")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Sessions
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Give Feedback</h2>
          <p className="text-gray-500 text-sm mt-1">
            Your honest feedback helps everyone improve.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ratings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Rate the session across 4 areas
            </h3>
            <div className="space-y-5">
              <RatingRow
                label="Technical Depth"
                description="How strong was their technical knowledge?"
                value={ratings.technical}
                onChange={(v) => setRatings({ ...ratings, technical: v })}
              />
              <RatingRow
                label="Communication"
                description="How clearly did they explain their thinking?"
                value={ratings.communication}
                onChange={(v) => setRatings({ ...ratings, communication: v })}
              />
              <RatingRow
                label="Problem Solving"
                description="How well did they approach problems?"
                value={ratings.problemSolving}
                onChange={(v) => setRatings({ ...ratings, problemSolving: v })}
              />
              <RatingRow
                label="Overall Experience"
                description="How was the overall session quality?"
                value={ratings.overall}
                onChange={(v) =>
                  setRatings({ ...ratings, overall: v })
                }
              />
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              What did they do well?
            </h3>
            <p className="text-xs text-gray-400 mb-4">Select all that apply or add your own</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {STRENGTHS_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleTag(strengths, setStrengths, s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    strengths.includes(s)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Custom strength input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customStrength}
                onChange={(e) => setCustomStrength(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (customStrength.trim()) {
                      setStrengths([...strengths, customStrength.trim()]);
                      setCustomStrength('');
                    }
                  }
                }}
                placeholder="Add your own strength and press Enter..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (customStrength.trim()) {
                    setStrengths([...strengths, customStrength.trim()]);
                    setCustomStrength('');
                  }
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
            {/* Show custom added strengths */}
            {strengths.filter(s => !STRENGTHS_SUGGESTIONS.includes(s)).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {strengths.filter(s => !STRENGTHS_SUGGESTIONS.includes(s)).map(s => (
                  <span key={s} className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    {s}
                    <button type="button" onClick={() => setStrengths(strengths.filter(i => i !== s))}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Improvements */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              What should they improve?
            </h3>
            <p className="text-xs text-gray-400 mb-4">Select all that apply or add your own</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {IMPROVEMENTS_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleTag(improvements, setImprovements, s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    improvements.includes(s)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Custom improvement input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customImprovement}
                onChange={(e) => setCustomImprovement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (customImprovement.trim()) {
                      setImprovements([...improvements, customImprovement.trim()]);
                      setCustomImprovement('');
                    }
                  }
                }}
                placeholder="Add your own improvement and press Enter..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="button"
                onClick={() => {
                  if (customImprovement.trim()) {
                    setImprovements([...improvements, customImprovement.trim()]);
                    setCustomImprovement('');
                  }
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
            {/* Show custom added improvements */}
            {improvements.filter(s => !IMPROVEMENTS_SUGGESTIONS.includes(s)).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {improvements.filter(s => !IMPROVEMENTS_SUGGESTIONS.includes(s)).map(s => (
                  <span key={s} className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                    {s}
                    <button type="button" onClick={() => setImprovements(improvements.filter(i => i !== s))}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Would interview again */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Would you interview this person again?
            </h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setWouldInterviewAgain(true)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  wouldInterviewAgain
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Yes, definitely
              </button>
              <button
                type="button"
                onClick={() => setWouldInterviewAgain(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  !wouldInterviewAgain
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Not really
              </button>
            </div>
          </div>

          {/* General comments */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              Any other comments? <span className="text-gray-400 font-normal">(optional)</span>
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Anything specific you want them to know
            </p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="e.g. Great session overall! Would recommend practicing more DP problems..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{comments.length}/500</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Star rating row ──
const RatingRow = ({ label, description, value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-2xl transition-transform hover:scale-110"
          >
            <span
              className={
                star <= (hovered || value) ? "text-amber-400" : "text-gray-200"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Feedback;