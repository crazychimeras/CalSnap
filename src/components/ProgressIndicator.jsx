import React from 'react';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index + 1 === currentStep
              ? 'w-8 bg-green-500'
              : index + 1 < currentStep
              ? 'w-2 bg-green-500'
              : 'w-2 bg-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
};

export default ProgressIndicator;
