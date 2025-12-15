import React, { useState } from 'react';
import { Icons } from './Icons';

interface WeightCardProps {
  currentWeight: number;
  onUpdateWeight: (weight: number) => void;
}

const WeightCard: React.FC<WeightCardProps> = ({ currentWeight, onUpdateWeight }) => {
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val > 0) {
      onUpdateWeight(val);
      setInputValue('');
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Peso Atual</div>
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{currentWeight.toFixed(1)}</span>
                <span className="text-slate-500 font-medium">kg</span>
            </div>
        </div>
        <div className="text-right">
             <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Meta</div>
             <div className="flex items-baseline gap-1 justify-end">
                <span className="text-xl font-bold text-indigo-400">90.0</span>
                <span className="text-slate-600 font-medium text-sm">kg</span>
            </div>
        </div>
      </div>

      <div className="relative">
        <input 
            type="number" 
            placeholder="Novo peso..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsEditing(true)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        {inputValue && (
             <button 
                onClick={handleSave}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 rounded-lg flex items-center justify-center text-white hover:bg-indigo-500 transition-colors"
            >
                <Icons.Check className="w-5 h-5" />
            </button>
        )}
      </div>
    </div>
  );
};

export default WeightCard;