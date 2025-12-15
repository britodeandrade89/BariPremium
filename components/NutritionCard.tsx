import React from 'react';
import { CALORIE_GOAL } from '../constants';

interface NutritionCardProps {
  consumed: number;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ consumed }) => {
  const percentage = Math.min((consumed / CALORIE_GOAL) * 100, 100);
  const isOver = consumed > CALORIE_GOAL;
  
  return (
    <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.06 8.3a4.77 4.77 0 0 0-3.8-3.5 6 6 0 1 0-8 8.4 5 5 0 0 0 4.4 1.7 2.86 2.86 0 0 1 2.4 2.1c.5 1.7 2.6 1.9 3.5.7a4.92 4.92 0 0 0 1.5-5.4Z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-white">Nutrição Diária</h3>
        </div>
        <span className="text-xs font-medium text-slate-400">Meta: ~{CALORIE_GOAL} kcal</span>
      </div>

      <div className="flex items-end gap-2 mb-2 relative z-10">
        <span className={`text-4xl font-bold ${isOver ? 'text-red-400' : 'text-white'}`}>
            {consumed}
        </span>
        <span className="text-slate-500 mb-1 font-medium">/ {CALORIE_GOAL} kcal</span>
      </div>

      <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden relative z-10">
        <div 
          className={`h-full transition-all duration-700 ease-out rounded-full ${
            isOver ? 'bg-red-500' : 'bg-gradient-to-r from-orange-400 to-orange-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-center text-xs text-slate-500 mt-3 italic relative z-10">
        {isOver ? 'Atenção: Limite calórico excedido.' : 'Consumo sob controle'}
      </p>
    </div>
  );
};

export default NutritionCard;