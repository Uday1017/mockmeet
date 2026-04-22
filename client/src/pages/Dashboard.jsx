import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  Coins, 
  Star, 
  TrendingUp, 
  Users, 
  Calendar, 
  Award, 
  Target, 
  Sparkles,
  MessageSquare,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">M</span>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MockMeet
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => navigate("/matches")}
              className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors whitespace-nowrap"
            >
              Matches
            </button>
            <button
              onClick={() => navigate("/sessions")}
              className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors whitespace-nowrap"
            >
              Sessions
            </button>
            <button
              onClick={() => navigate("/my-feedback")}
              className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors whitespace-nowrap"
            >
              Feedback
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors whitespace-nowrap"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all font-medium whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome header with gradient */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className="text-2xl sm:text-3xl font-bold">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h2>
            </div>
            <p className="text-indigo-100 text-base sm:text-lg mb-2">
              Ready to level up your interview skills today?
            </p>
            <p className="text-indigo-200 text-xs sm:text-sm truncate">
              Logged in as: {user?.email}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            label="Credits"
            value={stats.credits}
            description="Available to spend"
            icon={<Coins className="w-6 h-6" />}
            gradient="from-indigo-500 to-indigo-600"
          />
          <StatCard
            label="Reputation"
            value={stats.reputationScore?.toFixed(1)}
            description="Your rating"
            icon={<Star className="w-6 h-6" />}
            gradient="from-amber-500 to-amber-600"
          />
          <StatCard
            label="Sessions Given"
            value={stats.totalSessionsGiven}
            description="You interviewed others"
            icon={<Users className="w-6 h-6" />}
            gradient="from-green-500 to-green-600"
          />
          <StatCard
            label="Sessions Taken"
            value={stats.totalSessionsTaken}
            description="Others interviewed you"
            icon={<BookOpen className="w-6 h-6" />}
            gradient="from-blue-500 to-blue-600"
          />
        </div>

        {/* Skills section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SkillsCard
            title="Skills You Offer"
            skills={user?.skillsOffered || []}
            icon={<Award className="w-5 h-5" />}
            gradient="from-green-500 to-emerald-500"
            emptyMessage="Add skills you can teach"
          />
          <SkillsCard
            title="Skills You Want"
            skills={user?.skillsWanted || []}
            icon={<Target className="w-5 h-5" />}
            gradient="from-blue-500 to-cyan-500"
            emptyMessage="Add skills you want to learn"
          />
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard
              title="Find Matches"
              description="Discover people with complementary skills"
              icon={<Users className="w-6 h-6" />}
              onClick={() => navigate("/matches")}
              gradient="from-indigo-500 to-purple-500"
            />
            <ActionCard
              title="View Sessions"
              description="Manage your upcoming and past interviews"
              icon={<Calendar className="w-6 h-6" />}
              onClick={() => navigate("/sessions")}
              gradient="from-blue-500 to-cyan-500"
            />
            <ActionCard
              title="My Feedback"
              description="See what others think about your performance"
              icon={<MessageSquare className="w-6 h-6" />}
              onClick={() => navigate("/my-feedback")}
              gradient="from-green-500 to-emerald-500"
            />
          </div>
        </div>

        {/* Activity Overview */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Your Activity
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <ActivityCard
              title="Total Sessions"
              value={stats.totalSessionsGiven + stats.totalSessionsTaken}
              icon={<CheckCircle2 className="w-8 h-8" />}
              gradient="from-purple-500 to-pink-500"
              description="Completed interviews"
            />
            <ActivityCard
              title="Success Rate"
              value={`${stats.noShowCount === 0 ? 100 : Math.round((1 - stats.noShowCount / (stats.totalSessionsGiven + stats.totalSessionsTaken + stats.noShowCount)) * 100)}%`}
              icon={<TrendingUp className="w-8 h-8" />}
              gradient="from-green-500 to-teal-500"
              description="Attendance record"
            />
            <ActivityCard
              title="No-Shows"
              value={stats.noShowCount}
              icon={<XCircle className="w-8 h-8" />}
              gradient="from-red-500 to-orange-500"
              description="Missed sessions"
            />
          </div>
        </div>

        {/* Tips & Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            title="💡 Pro Tip"
            description="Maintain a high reputation score by being punctual, prepared, and providing constructive feedback. Your reputation helps you get more matches!"
            gradient="from-amber-500 to-orange-500"
          />
          <InfoCard
            title="🎯 Credit System"
            description="Teach 1 session = Earn 1 credit. Spend 1 credit = Get interviewed. Keep the balance by both teaching and learning!"
            gradient="from-indigo-500 to-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

// ── Reusable components ──

const StatCard = ({ label, value, description, icon, gradient }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all hover:-translate-y-1 group">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
};

const SkillsCard = ({ title, skills, icon, gradient, emptyMessage }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className={`px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r ${gradient} text-white shadow-md`}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">{emptyMessage}</p>
          <button
            onClick={() => window.location.href = '/profile'}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Add skills →
          </button>
        </div>
      )}
    </div>
  );
};

const ActionCard = ({ title, description, icon, onClick, gradient }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:gap-2 transition-all">
        <span>Get started</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

const ActivityCard = ({ title, value, icon, gradient, description }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div className="text-4xl font-bold text-gray-900">{value}</div>
      </div>
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
};

const InfoCard = ({ title, description, gradient }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-sm text-white/90 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default Dashboard;
