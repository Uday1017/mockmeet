import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Target, 
  Sparkles, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  BookOpen 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">M</span>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MockMeet
            </span>
          </div>
          
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-200 hover:shadow-xl"
            >
              Dashboard
            </button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-200 hover:shadow-xl"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <span className="bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 w-fit mx-auto">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Peer-to-Peer Mock Interviews
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
              Master Interviews
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Together
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto px-4">
              Practice real interviews with peers. Teach to earn credits, spend to learn.
              Get AI-powered questions and honest feedback to ace your next interview.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-2xl shadow-indigo-300 hover:shadow-indigo-400 hover:scale-105"
              >
                Start Practicing Free
              </button>
              <button
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all border-2 border-gray-200 hover:border-gray-300"
              >
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-2xl mx-auto px-4">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">100%</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">Free Forever</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">Powered Questions</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">P2P</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">Real Practice</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose MockMeet?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Everything you need to prepare for technical interviews, all in one platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={<Target className="w-7 h-7" />}
              title="Credit Economy"
              description="Teach 1 session, earn 1 credit. Spend credits to learn. Fair, balanced, and sustainable."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Sparkles className="w-7 h-7" />}
              title="AI Questions"
              description="Get tailored interview questions powered by Gemini AI based on role and difficulty."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<MessageSquare className="w-7 h-7" />}
              title="Real-time Chat"
              description="Connect with your match instantly. Discuss, schedule, and coordinate seamlessly."
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<Star className="w-7 h-7" />}
              title="Reputation System"
              description="Build your reputation through quality sessions. Get rated on technical depth, communication, and more."
              gradient="from-amber-500 to-yellow-500"
            />
            <FeatureCard
              icon={<TrendingUp className="w-7 h-7" />}
              title="Detailed Feedback"
              description="Receive structured feedback with strengths, improvements, and actionable insights."
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Users className="w-7 h-7" />}
              title="Smart Matching"
              description="Find peers with complementary skills. Match based on what you offer and what you need."
              gradient="from-indigo-500 to-purple-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Get started in 4 simple steps and start practicing today.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <StepCard
              number="1"
              title="Sign Up"
              description="Create your free account and set up your profile with skills and target roles."
            />
            <StepCard
              number="2"
              title="Find Matches"
              description="Browse peers with complementary skills. Send match requests to connect."
            />
            <StepCard
              number="3"
              title="Schedule Sessions"
              description="Propose interview sessions with matched peers. Get AI-generated questions."
            />
            <StepCard
              number="4"
              title="Give & Get Feedback"
              description="Complete sessions, exchange feedback, and improve together."
            />
          </div>
        </div>
      </section>

      {/* Credit System Explainer */}
      <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">The Credit Economy</h2>
              <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 sm:mb-8 max-w-2xl">
                MockMeet runs on a simple, fair credit system that keeps the community balanced and active.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Earn Credits</h3>
                  <p className="text-sm sm:text-base text-indigo-100">
                    Interview someone = Earn 1 credit. Share your knowledge and help others prepare.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Spend Credits</h3>
                  <p className="text-sm sm:text-base text-indigo-100">
                    Get interviewed = Spend 1 credit. Practice with experienced peers.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <p className="text-sm sm:text-base md:text-lg">
                  <span className="font-bold">New users start with 3 free credits</span> to get started.
                  The more you teach, the more you can learn. It's a win-win!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4">
            Ready to Ace Your Interviews?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 px-4">
            Join MockMeet today and start practicing with peers who understand your journey.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl transition-all shadow-2xl hover:scale-105 w-full sm:w-auto"
          >
            Get Started - It's Free!
          </button>
          <p className="text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6 px-4">
            No credit card required • 3 free credits to start • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold text-white">MockMeet</span>
              </div>
              <p className="text-sm">
                Peer-to-peer mock interviews for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features').scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Features</a></li>
                <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">How it works</a></li>
                <li><a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.linkedin.com/in/uday-gundu-4b8658268/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="https://github.com/Uday1017" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://medium.com/@udaygundu17" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:udaygundu17@gmail.com" className="hover:text-white transition-colors">udaygundu17@gmail.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
            <p>© 2026 MockMeet. Built by <a href="https://www.linkedin.com/in/uday-gundu-4b8658268/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">Uday Gundu</a></p>
          </div>
        </div>
      </footer>

    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
    <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Step Card Component
const StepCard = ({ number, title, description }) => (
  <div className="relative">
    <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all">
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-5">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default Home;
