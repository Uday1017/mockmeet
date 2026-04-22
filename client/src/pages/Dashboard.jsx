import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: statsData } = useQuery({
    queryKey: ["myStats"],
    queryFn: async () => {
      const response = await api.get("/users/me/stats");
      return response.data.stats;
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const stats = statsData || {
    credits: user?.credits || 0,
    reputationScore: user?.reputationScore || 5,
    totalSessionsGiven: 0,
    totalSessionsTaken: 0,
    noShowCount: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">MockMeet</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/matches")}
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Find Matches
            </button>
            <button
              onClick={() => navigate("/sessions")}
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Sessions
            </button>
            <button
              onClick={() => navigate("/my-feedback")}
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              My Feedback
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Here's your MockMeet activity at a glance.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Credits"
            value={stats.credits}
            description="Available to spend"
            color="indigo"
          />
          <StatCard
            label="Reputation"
            value={`${stats.reputationScore?.toFixed(1)} ★`}
            description="Your rating"
            color="amber"
          />
          <StatCard
            label="Sessions Given"
            value={stats.totalSessionsGiven}
            description="You interviewed others"
            color="green"
          />
          <StatCard
            label="Sessions Taken"
            value={stats.totalSessionsTaken}
            description="Others interviewed you"
            color="blue"
          />
        </div>

        {/* Skills section */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <SkillsCard
            title="Skills You Offer"
            skills={user?.skillsOffered || []}
            color="green"
            emptyMessage="No skills added yet"
          />
          <SkillsCard
            title="Skills You Want"
            skills={user?.skillsWanted || []}
            color="blue"
            emptyMessage="No skills added yet"
          />
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <ActionCard
            title="Find Matches"
            description="Discover people with complementary skills"
            buttonText="Browse Matches"
            onClick={() => navigate("/matches")}
            color="indigo"
          />
          <ActionCard
            title="Feedback Received"
            description="See what others think about your performance"
            buttonText="View Feedback"
            onClick={() => navigate("/my-feedback")}
            color="indigo"
          />
          <ActionCard
            title="Update Profile"
            description="Add your skills and target roles"
            buttonText="Edit Profile"
            onClick={() => navigate("/profile")}
            color="purple"
          />
        </div>

        {/* Second row of action cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <ActionCard
            title="How Credits Work"
            description="Teach 1 session → earn 1 credit. Spend to learn."
            buttonText="Learn More"
            onClick={() => {}}
            color="amber"
          />
        </div>
      </div>
    </div>
  );
};

// ── Reusable components ──

const StatCard = ({ label, value, description, color }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div
        className={`inline-block px-3 py-1 rounded-lg text-2xl font-bold mb-2 ${colors[color]}`}
      >
        {value}
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>
  );
};

const SkillsCard = ({ title, skills, color, emptyMessage }) => {
  const tagColors = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors[color]}`}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      )}
    </div>
  );
};

const ActionCard = ({ title, description, buttonText, onClick, color }) => {
  const colors = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    amber: "bg-amber-500 hover:bg-amber-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <button
        onClick={onClick}
        className={`w-full text-white text-sm font-medium py-2 rounded-xl transition-colors ${colors[color]}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Dashboard;
