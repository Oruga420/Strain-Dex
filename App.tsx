
import React from 'react';
import Pokedex from './components/Pokedex';

const App: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-emerald-400 tracking-wider">
          Strain Dex
        </h1>
        <p className="text-gray-400 mt-2">Your AI-Powered Cannabis Catalog</p>
      </header>
      <main className="w-full flex justify-center">
        <Pokedex />
      </main>
    </div>
  );
};

export default App;
