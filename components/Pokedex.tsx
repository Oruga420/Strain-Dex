import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { PokedexEntry, ExtractedProductInfo } from '../types';
import EntryForm from './EntryForm';
import EntryDetail from './EntryDetail';
// FIX: Import missing components to resolve reference errors.
import PlusIcon from './icons/PlusIcon';
import EntryCard from './EntryCard';

type View = 'list' | 'form' | 'detail';

const Pokedex: React.FC = () => {
  const [entries, setEntries] = useLocalStorage<PokedexEntry[]>('pokedex-entries', []);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedEntry, setSelectedEntry] = useState<PokedexEntry | null>(null);
  const [newEntryData, setNewEntryData] = useState<Omit<PokedexEntry, 'id' | 'createdAt'> | null>(null);
  
  const handleAddClick = () => {
    setSelectedEntry(null);
    setNewEntryData(null);
    setCurrentView('form');
  };

  const handleAnalysisComplete = (data: ExtractedProductInfo, image: string, originalReview: string) => {
    setNewEntryData({ ...data, image, originalReview });
    setCurrentView('detail');
  };
  
  const handleSaveEntry = () => {
    if (newEntryData) {
      const entryToSave: PokedexEntry = {
        ...newEntryData,
        id: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setEntries([entryToSave, ...entries]);
      setNewEntryData(null);
      setCurrentView('list');
    }
  };
  
  const viewEntry = (entry: PokedexEntry) => {
    setSelectedEntry(entry);
    setNewEntryData(null);
    setCurrentView('detail');
  };

  const showList = () => {
    setSelectedEntry(null);
    setNewEntryData(null);
    setCurrentView('list');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'form':
        return <EntryForm onAnalysisComplete={handleAnalysisComplete} onCancel={showList} />;
      case 'detail':
        if (selectedEntry) {
          return <EntryDetail entry={selectedEntry} onSave={() => {}} onBack={showList} isSaved={true} />;
        }
        if (newEntryData) {
          return <EntryDetail entry={newEntryData} onSave={handleSaveEntry} onBack={() => setCurrentView('form')} isSaved={false} />;
        }
        // Fallback to list if no data
        setCurrentView('list');
        return <EntryList entries={entries} onAddClick={handleAddClick} onViewEntry={viewEntry} />;
      case 'list':
      default:
        return <EntryList entries={entries} onAddClick={handleAddClick} onViewEntry={viewEntry} />;
    }
  };

  return (
    <div className="w-full max-w-4xl h-[75vh] bg-gray-800 border-4 border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-red-700 p-4 flex items-center border-b-4 border-gray-900">
            <div className="w-12 h-12 bg-blue-400 rounded-full border-4 border-white shadow-inner"></div>
            <div className="flex gap-2 ml-4">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
        </div>
        <div className="flex-grow bg-gray-900 overflow-y-auto">
            {renderContent()}
        </div>
    </div>
  );
};


const EntryList: React.FC<{
  entries: PokedexEntry[];
  onAddClick: () => void;
  onViewEntry: (entry: PokedexEntry) => void;
}> = ({ entries, onAddClick, onViewEntry }) => {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-end mb-6">
         <button 
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 text-white font-semibold bg-emerald-600 rounded-md hover:bg-emerald-700 transition-transform transform hover:scale-105"
         >
          <PlusIcon />
          New Entry
        </button>
      </div>
      {entries.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-400">Your Strain Dex is empty.</h2>
          <p className="text-gray-500 mt-2">Click "New Entry" to add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map(entry => (
            <EntryCard key={entry.id} entry={entry} onClick={() => onViewEntry(entry)} />
          ))}
        </div>
      )}
    </div>
  );
};


export default Pokedex;