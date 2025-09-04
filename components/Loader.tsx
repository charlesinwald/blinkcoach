
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-6 bg-slate-800/50 rounded-lg">
        <div className="w-12 h-12 border-4 border-t-teal-400 border-r-teal-400 border-b-slate-600 border-l-slate-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-300 font-semibold tracking-wider">Analyzing your conversation...</p>
        <p className="mt-1 text-sm text-slate-500">This might take a moment.</p>
    </div>
  );
};

export default Loader;
