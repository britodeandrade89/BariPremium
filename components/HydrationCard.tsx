import React from 'react';
import { WATER_GOAL } from '../constants';
import { Icons } from './Icons';

interface HydrationCardProps {
  intake: number;
  onAdd: (amount: number) => void;
}

const HydrationCard: React.FC<HydrationCardProps> = ({ intake, onAdd }) => {
  const percentage = Math.min((intake / WATER_GOAL) * 100, 100);

  return (
    <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                <Icons.Droplet />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">Hidratação</h3>
                <div className="text-xs text-blue-300 font-medium">
                    {intake} / {WATER_GOAL}ml
                </div>
            </div>
        </div>
        <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Simple Circular Progress Representation */}
             <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-blue-500 transition-all duration-500 ease-out" strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
             <div className="absolute text-[8px] font-bold text-blue-200">{Math.round(percentage)}%</div>
        </div>
      </div>

      <div className="flex gap-2 relative z-10">
        <button 
            onClick={() => onAdd(200)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all text-blue-200 text-sm py-3 rounded-xl font-medium border border-slate-600 flex flex-col items-center justify-center gap-1"
        >
            <span className="text-xs opacity-60">+200</span>
            <Icons.Droplet className="w-4 h-4" />
        </button>
        <button 
            onClick={() => onAdd(300)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all text-blue-200 text-sm py-3 rounded-xl font-medium border border-slate-600 flex flex-col items-center justify-center gap-1"
        >
            <span className="text-xs opacity-60">+300</span>
            <Icons.Droplet className="w-4 h-4" />
        </button>
        <button 
            onClick={() => onAdd(500)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white text-sm py-3 rounded-xl font-bold border border-blue-500 flex flex-col items-center justify-center gap-1 shadow-lg shadow-blue-900/20"
        >
             <span className="text-xs opacity-80">+500</span>
             <span className="text-xs">ml</span>
        </button>
      </div>
    </div>
  );
};

export default HydrationCard;