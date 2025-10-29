
import React from 'react';
import { PokedexEntry } from '../types';
import SaveIcon from './icons/SaveIcon';
import BackIcon from './icons/BackIcon';

interface EntryDetailProps {
  entry: Omit<PokedexEntry, 'id' | 'createdAt'>;
  onSave: () => void;
  onBack: () => void;
  isSaved: boolean;
}

const DetailRow: React.FC<{ label: string; value: string | string[] }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
        {Array.isArray(value) ? (
          <ul className="list-disc list-inside">
            {value.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        ) : (
          value
        )}
      </dd>
    </div>
);

const EntryDetail: React.FC<EntryDetailProps> = ({ entry, onSave, onBack, isSaved }) => {
  return (
    <div className="p-4 sm:p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
             <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                >
                <BackIcon className="w-4 h-4" />
                Back
            </button>
            {!isSaved && (
                <button
                    onClick={onSave}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                >
                    <SaveIcon className="w-4 h-4" />
                    Save to Dex
                </button>
            )}
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-1">
          <img src={entry.image} alt={entry.productName} className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>
        <div className="mt-6 lg:mt-0 lg:col-span-2">
          <h2 className="text-3xl font-bold text-emerald-400">{entry.productName}</h2>
          <p className="text-lg text-gray-300">{entry.strain}</p>
          
          <dl className="mt-4 border-t border-b border-gray-700 divide-y divide-gray-700">
            <DetailRow label="Manufacturer" value={entry.manufacturer} />
            <DetailRow label="Potency" value={entry.potency} />
            {entry.otherDetails.length > 0 && (
                <DetailRow label="Other Details" value={entry.otherDetails} />
            )}
          </dl>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Your Review</h3>
          <p className="bg-gray-800 p-4 rounded-lg text-gray-300 whitespace-pre-wrap font-mono text-sm">{entry.originalReview}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-emerald-400 mb-2">AI Enhanced Review</h3>
          <p className="bg-gray-800 border border-emerald-800 p-4 rounded-lg text-white whitespace-pre-wrap">{entry.enhancedReview}</p>
        </div>
      </div>

    </div>
  );
};

export default EntryDetail;
