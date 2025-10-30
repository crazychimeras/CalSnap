import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings, Camera, Plus, ChevronDown } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('userProfile') || 'null');
    if (!profile) {
      navigate('/onboarding');
      return;
    }
    setUserProfile(profile);
  }, [navigate]);

  useEffect(() => {
    if (!userProfile) return;
    loadMealsForDate(currentDate);
  }, [currentDate, userProfile]);

  const loadMealsForDate = (date) => {
    const dateKey = formatDateKey(date);
    const storedData = localStorage.getItem(`meals-${dateKey}`);

    if (storedData) {
      const data = JSON.parse(storedData);
      setMeals(data.meals || []);
      calculateTotals(data.meals || []);
    } else {
      setMeals([]);
      calculateTotals([]);
    }
  };

  const calculateTotals = (mealsArray) => {
    const totals = mealsArray.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    setTotals(totals);
  };

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === today.getTime()) {
      return 'Today';
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (newDate <= today) {
      setCurrentDate(newDate);
    }
  };

  const isFutureDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentDate);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= tomorrow;
  };

  const getMealsByType = (type) => {
    return meals.filter(meal => meal.mealType === type);
  };

  const getProgressColor = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage > 100) return '#ef4444';
    if (percentage >= 80) return '#fbbf24';
    return '#10b981';
  };

  const CircularProgress = ({ current, target }) => {
    const percentage = Math.min((current / target) * 100, 100);
    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const color = getProgressColor(current, target);

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-3xl font-bold text-gray-800">
            {Math.round(current)}
          </div>
          <div className="text-sm text-gray-500">/ {target}</div>
        </div>
      </div>
    );
  };

  const MacroProgress = ({ label, current, target, color }) => {
    const percentage = Math.min((current / target) * 100, 100);

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold text-gray-800">
            {Math.round(current)}g / {target}g
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
    );
  };

  const MealSection = ({ title, mealType }) => {
    const mealsList = getMealsByType(mealType);

    return (
      <div className="bg-white rounded-xl p-4 mb-3 shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={() => navigate('/camera')}
            className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Meal
          </button>
        </div>
        {mealsList.length === 0 ? (
          <p className="text-gray-400 text-sm py-2">No {title.toLowerCase()} logged yet</p>
        ) : (
          <div className="space-y-2">
            {mealsList.map((meal) => (
              <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{meal.foodName}</p>
                  <p className="text-sm text-gray-500">
                    P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                  </p>
                </div>
                <p className="font-semibold text-gray-800">{meal.calories} cal</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const remaining = userProfile.dailyCalories - totals.calories;
  const isOverGoal = remaining < 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-24">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <h2 className="text-lg font-semibold text-gray-800">
            {formatDateDisplay(currentDate)}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate(1)}
              disabled={isFutureDate()}
              className={`p-2 rounded-full transition-colors ${
                isFutureDate()
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col items-center">
            <CircularProgress
              current={totals.calories}
              target={userProfile.dailyCalories}
            />
            <div className="mt-4 text-center">
              <p className={`text-lg font-semibold ${isOverGoal ? 'text-red-500' : 'text-gray-600'}`}>
                {isOverGoal
                  ? `${Math.abs(remaining)} over goal`
                  : `${remaining} remaining`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Macros</h3>
          <MacroProgress
            label="Protein"
            current={totals.protein}
            target={userProfile.proteinTarget}
            color="#3b82f6"
          />
          <MacroProgress
            label="Carbs"
            current={totals.carbs}
            target={userProfile.carbsTarget}
            color="#10b981"
          />
          <MacroProgress
            label="Fat"
            current={totals.fat}
            target={userProfile.fatTarget}
            color="#f59e0b"
          />
        </div>

        {meals.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-6 text-center">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No meals logged yet!</h3>
            <p className="text-gray-600 mb-4">Tap the camera button to log your first meal</p>
            <ChevronDown className="w-8 h-8 mx-auto text-green-500 animate-bounce" />
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Meals</h2>
          <MealSection title="Breakfast" mealType="breakfast" />
          <MealSection title="Lunch" mealType="lunch" />
          <MealSection title="Dinner" mealType="dinner" />
          <MealSection title="Snacks" mealType="snacks" />
        </div>
      </div>

      <button
        onClick={() => navigate('/camera')}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-50 md:w-16 md:h-16 md:bottom-8 md:right-8"
        aria-label="Add meal"
      >
        <Camera className="w-7 h-7" />
      </button>
    </div>
  );
};

export default Dashboard;
