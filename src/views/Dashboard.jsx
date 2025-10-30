import React from 'react';
import { Camera, User, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to CalSnap</h1>
          <p className="text-gray-600">Your daily calorie tracking dashboard</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white mb-6 shadow-xl">
          <p className="text-green-100 text-sm font-medium mb-2">Daily Goal</p>
          <p className="text-5xl font-bold mb-4">{userProfile.dailyCalories.toLocaleString()}</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-green-100 text-xs mb-1">Protein</p>
              <p className="text-xl font-semibold">{userProfile.proteinTarget}g</p>
            </div>
            <div>
              <p className="text-green-100 text-xs mb-1">Carbs</p>
              <p className="text-xl font-semibold">{userProfile.carbsTarget}g</p>
            </div>
            <div>
              <p className="text-green-100 text-xs mb-1">Fat</p>
              <p className="text-xl font-semibold">{userProfile.fatTarget}g</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-center">
            <Camera className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-800">Snap Meal</p>
            <p className="text-sm text-gray-600 mt-1">Coming soon</p>
          </button>

          <button className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-center">
            <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-800">View Progress</p>
            <p className="text-sm text-gray-600 mt-1">Coming soon</p>
          </button>

          <button className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-center">
            <User className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-800">Edit Profile</p>
            <p className="text-sm text-gray-600 mt-1">Coming soon</p>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Meals</h2>
          <div className="text-center py-12 text-gray-500">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No meals tracked yet</p>
            <p className="text-sm mt-2">Start by snapping a photo of your meal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
