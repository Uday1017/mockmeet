import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Sessions from './pages/Sessions';
import Feedback from './pages/Feedback';
import MyFeedback from './pages/MyFeedback';
import Questions from './pages/Questions';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/matches" element={
        <ProtectedRoute><Matches /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />
      <Route path="/chat/:matchId" element={
        <ProtectedRoute><Chat /></ProtectedRoute>
      } />
      <Route path="/sessions" element={
        <ProtectedRoute><Sessions /></ProtectedRoute>
      } />
      <Route path="/review/:sessionId" element={
        <ProtectedRoute><Feedback /></ProtectedRoute>
      } />
      <Route path="/my-feedback" element={
        <ProtectedRoute><MyFeedback /></ProtectedRoute>
      } />
      <Route path="/questions/:sessionId" element={
        <ProtectedRoute><Questions /></ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;
