
import React from 'react';
import { PokedexEntry } from '../types';

interface EntryCardProps {
  entry: PokedexEntry;
  onClick: () => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <img src={entry.image} alt={entry.productName} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-white truncate">{entry.productName}</h3>
        <p className="text-gray-400 text-sm">{entry.strain}</p>
      </div>
    </div>
  );
};

export default EntryCard;
