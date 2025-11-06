import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Zap, TrendingDown, Award, ChevronRight, X, Check } from 'lucide-react';
import { signUp, signIn } from '../lib/supabase';

const Landing = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        navigate('/onboarding');
      } else {
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={() => {
            setShowAuth(false);
            setError('');
            setEmail('');
            setPassword('');
          }}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {isSignUp ? 'Start Your Journey' : 'Welcome Back'}
        </h2>
        <p className="text-gray-600 mb-6">
          {isSignUp
            ? 'Create your account to begin tracking'
            : 'Sign in to continue your progress'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Minimum 6 characters"
              required
              minLength="6"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {showAuth && <AuthModal />}

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">CalSnap</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsSignUp(false);
                setShowAuth(true);
              }}
              className="px-5 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setShowAuth(true);
              }}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              AI-Powered Nutrition Tracking
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Track Calories in <span className="text-green-500">Seconds</span>, Not Minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stop wasting time logging every ingredient. Snap a photo, get instant nutrition info, and stay on track with your health goals effortlessly.
            </p>
            <button
              onClick={() => {
                setIsSignUp(true);
                setShowAuth(true);
              }}
              className="group bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
            >
              Start Free Today
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 mt-4">No credit card required. Start tracking in 60 seconds.</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl opacity-20 blur-3xl"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mb-6">
                <p className="text-green-100 text-sm font-medium mb-2">Your Daily Goal</p>
                <p className="text-5xl font-bold mb-1">1,847</p>
                <p className="text-green-100">calories remaining</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-gray-800">Breakfast</span>
                  <span className="text-green-600 font-bold">420 cal</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-gray-800">Lunch</span>
                  <span className="text-green-600 font-bold">580 cal</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl opacity-50">
                  <span className="font-semibold text-gray-800">Dinner</span>
                  <span className="text-gray-400 font-bold">--- cal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why People Love CalSnap
            </h2>
            <p className="text-xl text-gray-600">
              The fastest way to track your nutrition and reach your goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Snap & Track</h3>
              <p className="text-gray-600 leading-relaxed">
                Take a photo of your meal and get instant calorie and macro breakdowns. No more tedious manual entry or guessing portion sizes.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Accuracy</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced AI recognizes thousands of foods and provides precise nutritional information in seconds, so you can trust your data.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                <TrendingDown className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reach Your Goals</h3>
              <p className="text-gray-600 leading-relaxed">
                Whether losing weight, gaining muscle, or maintaining, get a personalized plan that adapts to your lifestyle and keeps you motivated.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-500 to-green-600">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-green-100">
              From photo to tracked meal in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Snap Your Meal</h3>
              <p className="text-green-100">
                Take a quick photo of your food with your phone camera
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Analyzes</h3>
              <p className="text-green-100">
                Our AI instantly identifies foods and calculates nutrition
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track Progress</h3>
              <p className="text-green-100">
                See your daily totals and stay on track with your goals
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <Award className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Join Thousands Achieving Their Goals
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start your journey to better health today. No commitment, no hassle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSignUp(true);
                setShowAuth(true);
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="w-6 h-6 text-green-500" />
            <span className="text-xl font-bold text-white">CalSnap</span>
          </div>
          <p className="text-sm">
            © 2025 CalSnap. Track calories effortlessly with AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
