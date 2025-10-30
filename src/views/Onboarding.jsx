import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Check } from 'lucide-react';
import ProgressIndicator from '../components/ProgressIndicator';
import {
  calculateDailyPlan,
  poundsToKg,
  kgToPounds,
  feetInchesToCm,
  cmToFeetInches
} from '../utils/calculations';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    heightUnit: 'imperial',
    heightFeet: '',
    heightInches: '',
    heightCm: '',
    weightUnit: 'imperial',
    weightLbs: '',
    weightKg: '',
    activityLevel: '',
    targetWeightLbs: '',
    targetWeightKg: '',
    goal: ''
  });

  const [errors, setErrors] = useState({});

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.age || formData.age < 13 || formData.age > 100) {
      newErrors.age = 'Please enter a valid age (13-100)';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    if (formData.heightUnit === 'imperial') {
      if (!formData.heightFeet || formData.heightFeet < 3 || formData.heightFeet > 8) {
        newErrors.height = 'Please enter a valid height';
      }
      if (formData.heightInches === '' || formData.heightInches < 0 || formData.heightInches > 11) {
        newErrors.height = 'Please enter valid inches (0-11)';
      }
    } else {
      if (!formData.heightCm || formData.heightCm < 100 || formData.heightCm > 250) {
        newErrors.height = 'Please enter a valid height (100-250 cm)';
      }
    }
    if (formData.weightUnit === 'imperial') {
      if (!formData.weightLbs || formData.weightLbs < 50 || formData.weightLbs > 500) {
        newErrors.weight = 'Please enter a valid weight';
      }
    } else {
      if (!formData.weightKg || formData.weightKg < 20 || formData.weightKg > 250) {
        newErrors.weight = 'Please enter a valid weight';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.activityLevel) {
      newErrors.activityLevel = 'Please select your activity level';
    }
    if (formData.weightUnit === 'imperial') {
      if (!formData.targetWeightLbs || formData.targetWeightLbs < 50 || formData.targetWeightLbs > 500) {
        newErrors.targetWeight = 'Please enter a valid target weight';
      }
    } else {
      if (!formData.targetWeightKg || formData.targetWeightKg < 20 || formData.targetWeightKg > 250) {
        newErrors.targetWeight = 'Please enter a valid target weight';
      }
    }
    if (!formData.goal) {
      newErrors.goal = 'Please select your goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;

    if (step === 3) {
      calculateAndShowResults();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleHeightUnitChange = (unit) => {
    if (unit === formData.heightUnit) return;

    if (unit === 'metric' && formData.heightFeet && formData.heightInches !== '') {
      const cm = feetInchesToCm(Number(formData.heightFeet), Number(formData.heightInches));
      setFormData({ ...formData, heightUnit: unit, heightCm: Math.round(cm) });
    } else if (unit === 'imperial' && formData.heightCm) {
      const { feet, inches } = cmToFeetInches(Number(formData.heightCm));
      setFormData({ ...formData, heightUnit: unit, heightFeet: feet, heightInches: inches });
    } else {
      setFormData({ ...formData, heightUnit: unit });
    }
  };

  const handleWeightUnitChange = (unit) => {
    if (unit === formData.weightUnit) return;

    if (unit === 'metric' && formData.weightLbs) {
      const kg = poundsToKg(Number(formData.weightLbs));
      const targetKg = formData.targetWeightLbs ? poundsToKg(Number(formData.targetWeightLbs)) : '';
      setFormData({
        ...formData,
        weightUnit: unit,
        weightKg: Math.round(kg * 10) / 10,
        targetWeightKg: targetKg ? Math.round(targetKg * 10) / 10 : ''
      });
    } else if (unit === 'imperial' && formData.weightKg) {
      const lbs = kgToPounds(Number(formData.weightKg));
      const targetLbs = formData.targetWeightKg ? kgToPounds(Number(formData.targetWeightKg)) : '';
      setFormData({
        ...formData,
        weightUnit: unit,
        weightLbs: Math.round(lbs * 10) / 10,
        targetWeightLbs: targetLbs ? Math.round(targetLbs * 10) / 10 : ''
      });
    } else {
      setFormData({ ...formData, weightUnit: unit });
    }
  };

  const calculateAndShowResults = () => {
    const height_cm = formData.heightUnit === 'imperial'
      ? feetInchesToCm(Number(formData.heightFeet), Number(formData.heightInches))
      : Number(formData.heightCm);

    const weight_kg = formData.weightUnit === 'imperial'
      ? poundsToKg(Number(formData.weightLbs))
      : Number(formData.weightKg);

    const targetWeight_kg = formData.weightUnit === 'imperial'
      ? poundsToKg(Number(formData.targetWeightLbs))
      : Number(formData.targetWeightKg);

    const profile = {
      age: Number(formData.age),
      gender: formData.gender,
      height_cm: Math.round(height_cm),
      weight_kg: Math.round(weight_kg * 10) / 10,
      activityLevel: formData.activityLevel,
      targetWeight_kg: Math.round(targetWeight_kg * 10) / 10,
      goal: formData.goal
    };

    const dailyPlan = calculateDailyPlan(profile);
    const completeProfile = { ...profile, ...dailyPlan };

    localStorage.setItem('userProfile', JSON.stringify(completeProfile));
    setStep(4);
  };

  const handleStartTracking = () => {
    navigate('/dashboard');
  };

  const userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {step === 1 && (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&q=80)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/50"></div>
          </div>

          <div className="relative z-10 text-center px-6 max-w-lg">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">CalSnap</h1>
              <p className="text-xl md:text-2xl text-green-400 font-medium">
                Track calories in seconds with AI
              </p>
            </div>

            <p className="text-lg text-gray-200 mb-12 leading-relaxed">
              Snap a photo of your meal and let AI calculate calories and macros instantly.
              Achieve your fitness goals with effortless tracking.
            </p>

            <button
              onClick={() => setStep(2)}
              className="group bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
            >
              Get Started
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="min-h-screen px-6 py-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <ProgressIndicator currentStep={2} totalSteps={4} />

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your age"
                    min="13"
                    max="100"
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gender
                  </label>
                  <div className="space-y-2">
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <label key={gender} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-4 h-4 text-green-500 focus:ring-green-500"
                        />
                        <span className="ml-3 text-gray-700">{gender}</span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Height
                    </label>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => handleHeightUnitChange('imperial')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          formData.heightUnit === 'imperial'
                            ? 'bg-white text-green-600 shadow'
                            : 'text-gray-600'
                        }`}
                      >
                        ft/in
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHeightUnitChange('metric')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          formData.heightUnit === 'metric'
                            ? 'bg-white text-green-600 shadow'
                            : 'text-gray-600'
                        }`}
                      >
                        cm
                      </button>
                    </div>
                  </div>

                  {formData.heightUnit === 'imperial' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={formData.heightFeet}
                        onChange={(e) => setFormData({ ...formData, heightFeet: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Feet"
                        min="3"
                        max="8"
                      />
                      <input
                        type="number"
                        value={formData.heightInches}
                        onChange={(e) => setFormData({ ...formData, heightInches: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Inches"
                        min="0"
                        max="11"
                      />
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={formData.heightCm}
                      onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Centimeters"
                      min="100"
                      max="250"
                    />
                  )}
                  {errors.height && <p className="mt-1 text-sm text-red-500">{errors.height}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Weight
                    </label>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => handleWeightUnitChange('imperial')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          formData.weightUnit === 'imperial'
                            ? 'bg-white text-green-600 shadow'
                            : 'text-gray-600'
                        }`}
                      >
                        lbs
                      </button>
                      <button
                        type="button"
                        onClick={() => handleWeightUnitChange('metric')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          formData.weightUnit === 'metric'
                            ? 'bg-white text-green-600 shadow'
                            : 'text-gray-600'
                        }`}
                      >
                        kg
                      </button>
                    </div>
                  </div>

                  <input
                    type="number"
                    value={formData.weightUnit === 'imperial' ? formData.weightLbs : formData.weightKg}
                    onChange={(e) => setFormData({
                      ...formData,
                      [formData.weightUnit === 'imperial' ? 'weightLbs' : 'weightKg']: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={formData.weightUnit === 'imperial' ? 'Pounds' : 'Kilograms'}
                    step="0.1"
                  />
                  {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight}</p>}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="min-h-screen px-6 py-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <ProgressIndicator currentStep={3} totalSteps={4} />

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Activity & Goals</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Level
                  </label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select activity level</option>
                    <option value="Sedentary (little or no exercise)">Sedentary (little or no exercise)</option>
                    <option value="Lightly Active (exercise 1-3 days/week)">Lightly Active (exercise 1-3 days/week)</option>
                    <option value="Moderately Active (exercise 3-5 days/week)">Moderately Active (exercise 3-5 days/week)</option>
                    <option value="Very Active (exercise 6-7 days/week)">Very Active (exercise 6-7 days/week)</option>
                    <option value="Extremely Active (physical job or training twice per day)">Extremely Active (physical job or training twice per day)</option>
                  </select>
                  {errors.activityLevel && <p className="mt-1 text-sm text-red-500">{errors.activityLevel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Weight ({formData.weightUnit === 'imperial' ? 'lbs' : 'kg'})
                  </label>
                  <input
                    type="number"
                    value={formData.weightUnit === 'imperial' ? formData.targetWeightLbs : formData.targetWeightKg}
                    onChange={(e) => setFormData({
                      ...formData,
                      [formData.weightUnit === 'imperial' ? 'targetWeightLbs' : 'targetWeightKg']: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={`Target weight in ${formData.weightUnit === 'imperial' ? 'pounds' : 'kilograms'}`}
                    step="0.1"
                  />
                  {errors.targetWeight && <p className="mt-1 text-sm text-red-500">{errors.targetWeight}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Goal
                  </label>
                  <div className="space-y-3">
                    {['Lose Weight', 'Maintain Weight', 'Gain Muscle'].map((goal) => (
                      <label
                        key={goal}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.goal === goal
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="goal"
                          value={goal}
                          checked={formData.goal === goal}
                          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                          className="w-4 h-4 text-green-500 focus:ring-green-500"
                        />
                        <span className="ml-3 text-gray-700 font-medium">{goal}</span>
                      </label>
                    ))}
                  </div>
                  {errors.goal && <p className="mt-1 text-sm text-red-500">{errors.goal}</p>}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Calculate Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && userProfile && (
        <div className="min-h-screen px-6 py-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Daily Plan</h2>
                <p className="text-gray-600">Personalized just for you</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white mb-6 text-center shadow-lg">
                <p className="text-green-100 text-sm font-medium mb-2">Daily Calorie Goal</p>
                <p className="text-5xl font-bold mb-1">{userProfile.dailyCalories.toLocaleString()}</p>
                <p className="text-green-100 text-lg">calories</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-blue-600 text-xs font-medium mb-1">Protein</p>
                  <p className="text-2xl font-bold text-gray-800">{userProfile.proteinTarget}g</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <p className="text-yellow-600 text-xs font-medium mb-1">Carbs</p>
                  <p className="text-2xl font-bold text-gray-800">{userProfile.carbsTarget}g</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-orange-600 text-xs font-medium mb-1">Fat</p>
                  <p className="text-2xl font-bold text-gray-800">{userProfile.fatTarget}g</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Your Profile Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal:</span>
                    <span className="font-medium text-gray-800">{userProfile.goal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activity Level:</span>
                    <span className="font-medium text-gray-800">
                      {userProfile.activityLevel.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Weight:</span>
                    <span className="font-medium text-gray-800">{userProfile.weight_kg.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Weight:</span>
                    <span className="font-medium text-gray-800">{userProfile.targetWeight_kg.toFixed(1)} kg</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartTracking}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Start Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
