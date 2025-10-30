export const calculateBMR = (weight_kg, height_cm, age, gender) => {
  if (gender === 'Male') {
    return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
  } else if (gender === 'Female') {
    return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
  } else {
    return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 78;
  }
};

export const getActivityMultiplier = (activityLevel) => {
  const multipliers = {
    'Sedentary (little or no exercise)': 1.2,
    'Lightly Active (exercise 1-3 days/week)': 1.375,
    'Moderately Active (exercise 3-5 days/week)': 1.55,
    'Very Active (exercise 6-7 days/week)': 1.725,
    'Extremely Active (physical job or training twice per day)': 1.9
  };
  return multipliers[activityLevel] || 1.2;
};

export const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = getActivityMultiplier(activityLevel);
  return bmr * multiplier;
};

export const adjustCaloriesForGoal = (tdee, goal) => {
  if (goal === 'Lose Weight') {
    return tdee - 500;
  } else if (goal === 'Gain Muscle') {
    return tdee + 300;
  }
  return tdee;
};

export const calculateMacros = (dailyCalories) => {
  const protein = Math.round((dailyCalories * 0.30) / 4);
  const carbs = Math.round((dailyCalories * 0.45) / 4);
  const fat = Math.round((dailyCalories * 0.25) / 9);

  return { protein, carbs, fat };
};

export const calculateDailyPlan = (profile) => {
  const bmr = calculateBMR(
    profile.weight_kg,
    profile.height_cm,
    profile.age,
    profile.gender
  );

  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const dailyCalories = Math.round(adjustCaloriesForGoal(tdee, profile.goal));
  const macros = calculateMacros(dailyCalories);

  return {
    dailyCalories,
    proteinTarget: macros.protein,
    carbsTarget: macros.carbs,
    fatTarget: macros.fat
  };
};

export const poundsToKg = (pounds) => pounds * 0.453592;
export const kgToPounds = (kg) => kg * 2.20462;
export const feetInchesToCm = (feet, inches) => (feet * 30.48) + (inches * 2.54);
export const cmToFeetInches = (cm) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};
