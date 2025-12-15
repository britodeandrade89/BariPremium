import React, { useRef, useEffect } from 'react';
import { TOTAL_DAYS } from '../constants';
import { DailyLog } from '../types';

interface DaySelectorProps {
  currentDay: number;
  onSelectDay: (day: number) => void;
  logs: Record<number, DailyLog>;
}

const DaySelector: React.FC<DaySelectorProps> = ({ currentDay, onSelectDay, logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Center the active day
      const activeEl = scrollRef.current.children[currentDay - 1] as HTMLElement;
      if (activeEl) {
        scrollRef.current.scrollTo({
          left: activeEl.offsetLeft - scrollRef.current.clientWidth / 2 + activeEl.clientWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentDay]);

  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']; // Generic repeating pattern for visuals

  return (
    <div className="w-full bg-slate-900 pb-4">
        <div className="flex justify-between items-center mb-4 px-4">
             <h2 className="text-xl font-bold text-white">Minha Jornada</h2>
             <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400 uppercase font-semibold">Dia Atual</span>
                <div className="text-indigo-400 font-bold text-center">{currentDay}/{TOTAL_DAYS}</div>
             </div>
        </div>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 px-4 no-scrollbar snap-x"
      >
        {days.map((day) => {
          const isSelected = day === currentDay;
          const isCompleted = logs[day]?.isCompleted;
          const dayLabel = weekDays[(day - 1) % 7];

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={`
                flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 snap-center border
                ${isSelected 
                  ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/30 -translate-y-1' 
                  : isCompleted
                    ? 'bg-slate-800 border-green-900/50 opacity-80'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                }
              `}
            >
              <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                {dayLabel}
              </span>
              <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {day}
              </span>
              
              <div className={`mt-2 w-2 h-2 rounded-full ${
                  isSelected ? 'bg-white' : isCompleted ? 'bg-green-500' : 'bg-slate-700'
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelector;