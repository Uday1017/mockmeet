import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

const Matches = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("discover");
  const [sentIds, setSentIds] = useState([]);

  // ── Fetch potential matches ──
  const { data: potentialData, isLoading: loadingPotential } = useQuery({
    queryKey: ["potentialMatches"],
    queryFn: async () => {
      const response = await api.get("/matches");
      return response.data;
    },
  });

  // ── Fetch accepted matches ──
  const { data: acceptedData, isLoading: loadingAccepted } = useQuery({
    queryKey: ["acceptedMatches"],
    queryFn: async () => {
      const response = await api.get("/matches/accepted");
      return response.data;
    },
  });

  // ── Send match request ──
  const sendRequest = useMutation({
    mutationFn: async (targetUserId) => {
      const response = await api.post("/matches", { targetUserId });
      return response.data;
    },
    onSuccess: (_, targetUserId) => {
      setSentIds((prev) => [...prev, targetUserId]);
    },
  });

  const potential = potentialData?.matches || [];
  const accepted = acceptedData?.matches || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xl font-bold text-indigo-600"
          >
            MockMeet
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Matches</h2>
          <p className="text-gray-500 text-sm mt-1">
            People ranked by how well your skills complement each other.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "discover"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab("connected")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "connected"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Connected{" "}
            {accepted.length > 0 && (
              <span className="ml-1 bg-indigo-100 text-indigo-600 text-xs px-1.5 py-0.5 rounded-full">
                {accepted.length}
              </span>
            )}
          </button>
        </div>

        {/* Discover tab */}
        {activeTab === "discover" && (
          <>
            {loadingPotential ? (
              <LoadingGrid />
            ) : potential.length === 0 ? (
              <EmptyState
                message="No matches found"
                description="Make sure you've added skills you offer and skills you want in your profile."
                buttonText="Update Profile"
                onClick={() => navigate("/profile")}
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {potential.map((match) => (
                  <MatchCard
                    key={match.user._id}
                    match={match}
                    isSent={sentIds.includes(match.user._id)}
                    onSendRequest={() => sendRequest.mutate(match.user._id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Connected tab */}
        {activeTab === "connected" && (
          <>
            {loadingAccepted ? (
              <LoadingGrid />
            ) : accepted.length === 0 ? (
              <EmptyState
                message="No connections yet"
                description="Send match requests to people in the Discover tab."
                buttonText="Discover Matches"
                onClick={() => setActiveTab("discover")}
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accepted.map((match) => (
                  <ConnectedCard key={match._id} match={match} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ── Match card for discover tab ──
const MatchCard = ({ match, isSent, onSendRequest }) => {
  const { user, score, aTeachesB, bTeachesA } = match;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-400">
              {user.college || "No college added"}
            </p>
          </div>
        </div>
        {/* Match score badge */}
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            score >= 80
              ? "bg-green-50 text-green-600"
              : score >= 50
                ? "bg-amber-50 text-amber-600"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {score}% match
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-xs text-gray-500 line-clamp-2">{user.bio}</p>
      )}

      {/* Skill exchange */}
      <div className="space-y-2">
        <SkillExchangeRow
          label="They teach you"
          skills={user.skillsOffered}
          color="blue"
          coverage={bTeachesA}
        />
        <SkillExchangeRow
          label="You teach them"
          skills={user.skillsWanted}
          color="green"
          coverage={aTeachesB}
        />
      </div>

      {/* Reputation */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>⭐ {user.reputationScore?.toFixed(1)}</span>
        <span>•</span>
        <span>{user.city || "Location unknown"}</span>
      </div>

      {/* Action button */}
      <button
        onClick={onSendRequest}
        disabled={isSent}
        className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${
          isSent
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
      >
        {isSent ? "Request Sent ✓" : "Send Match Request"}
      </button>
    </div>
  );
};

// ── Connected match card ──
const ConnectedCard = ({ match }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
          {match.userA?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {match.userA?.name}
          </p>
          <p className="text-xs text-green-500 font-medium">Connected</p>
        </div>
        <div className="ml-auto text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          {match.matchScore}% match
        </div>
      </div>
      <button
        onClick={() => navigate(`/chat/${match._id}`)}
        className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium transition-colors"
      >
        Open Chat
      </button>
    </div>
  );
};

// ── Skill exchange row ──
const SkillExchangeRow = ({ label, skills, color, coverage }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">
        {label} ({coverage}% match)
      </p>
      <div className="flex flex-wrap gap-1">
        {skills?.slice(0, 3).map((skill, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}
          >
            {skill}
          </span>
        ))}
        {skills?.length > 3 && (
          <span className="text-xs text-gray-400">
            +{skills.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
};

// ── Loading skeleton ──
const LoadingGrid = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-2 w-16 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full bg-gray-200 rounded" />
          <div className="h-2 w-3/4 bg-gray-200 rounded" />
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
    <button
      onClick={onClick}
      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
    >
      {buttonText}
    </button>
  </div>
);

export default Matches;
