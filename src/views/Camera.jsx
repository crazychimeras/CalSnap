import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';

const CameraView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white p-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <Camera className="w-24 h-24 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Camera Feature</h2>
        <p className="text-gray-400">Coming soon</p>
      </div>
    </div>
  );
};

export default CameraView;
