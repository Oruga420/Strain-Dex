
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div
        className="w-16 h-16 border-4 border-gray-500 border-solid rounded-full animate-spin border-t-transparent"
        style={{
            borderTopColor: '#e53e3e',
        }}
        ></div>
        <p className="text-emerald-400 font-semibold tracking-wider">Analyzing...</p>
    </div>
  );
};

export default Spinner;
