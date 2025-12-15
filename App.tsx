import React, { useState, useEffect } from 'react';
import { DailyLog, AppState, CustomFoodItem } from './types';
import { DEFAULT_TIMELINE, TOTAL_DAYS } from './constants';
import DaySelector from './components/DaySelector';
import NutritionCard from './components/NutritionCard';
import HydrationCard from './components/HydrationCard';
import WeightCard from './components/WeightCard';
import TimelineItem from './components/TimelineItem';
import { Icons } from './components/Icons';
import { firebaseConfig } from './firebase'; // Import Firebase Config

const INITIAL_WEIGHT = 95.0;

const getInitialState = (): AppState => {
  const saved = localStorage.getItem('bariatric_app_state');
  if (saved) {
    try {
        const parsed = JSON.parse(saved);
        // Migration support: ensure customItems exists for older saves
        if (parsed.logs) {
            Object.keys(parsed.logs).forEach(key => {
                if (!parsed.logs[key].customItems) {
                    parsed.logs[key].customItems = [];
                }
            });
        }
        return parsed;
    } catch (e) {
        console.error("Failed to parse state", e);
    }
  }
  return {
    currentDay: 1,
    logs: {}
  };
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getInitialState);
  // Priority: 1. Manual User Key (localStorage) -> 2. Firebase Config Key
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || firebaseConfig.apiKey || '');
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState('');

  // Persistence
  useEffect(() => {
    localStorage.setItem('bariatric_app_state', JSON.stringify(state));
  }, [state]);

  const saveApiKey = () => {
    const cleanedKey = tempKey.trim();
    if (cleanedKey.length > 0 && !cleanedKey.startsWith('AIza')) {
        alert("Atenção: A chave parece incorreta. Uma API Key do Google geralmente começa com as letras 'AIza'.");
    }
    
    localStorage.setItem('gemini_api_key', cleanedKey);
    setApiKey(cleanedKey);
    setShowSettings(false);
  };

  const openSettings = () => {
    // If we have a stored key, show it. If not, but we have a firebase key, suggest it but don't force it in the input yet.
    setTempKey(localStorage.getItem('gemini_api_key') || '');
    setShowSettings(true);
  }

  const getCurrentLog = (): DailyLog => {
    return state.logs[state.currentDay] || {
      waterIntake: 0,
      consumedCalories: 0,
      weight: state.logs[state.currentDay - 1]?.weight || INITIAL_WEIGHT,
      checkedItems: [],
      customItems: [],
      isCompleted: false
    };
  };

  const updateCurrentLog = (updates: Partial<DailyLog>) => {
    setState(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [prev.currentDay]: { ...getCurrentLog(), ...updates }
      }
    }));
  };

  const handleSelectDay = (day: number) => {
    setState(prev => ({ ...prev, currentDay: day }));
  };

  const handleAddWater = (amount: number) => {
    const current = getCurrentLog();
    updateCurrentLog({ waterIntake: current.waterIntake + amount });
  };

  const handleUpdateWeight = (weight: number) => {
    updateCurrentLog({ weight });
  };

  const handleToggleItem = (itemId: string, calories: number) => {
    const current = getCurrentLog();
    const isChecked = current.checkedItems.includes(itemId);
    
    let newCheckedItems;
    let newCalories = current.consumedCalories;

    if (isChecked) {
      newCheckedItems = current.checkedItems.filter(id => id !== itemId);
      newCalories = Math.max(0, newCalories - calories);
    } else {
      newCheckedItems = [...current.checkedItems, itemId];
      newCalories += calories;
    }

    updateCurrentLog({ 
      checkedItems: newCheckedItems,
      consumedCalories: newCalories
    });
  };

  const handleAddCustomItem = (eventId: string, item: { name: string, calories: number }) => {
    const current = getCurrentLog();
    const newItem: CustomFoodItem = {
        id: `custom_${Date.now()}`,
        eventId: eventId,
        name: item.name,
        calories: item.calories
    };

    updateCurrentLog({
        customItems: [...(current.customItems || []), newItem],
        consumedCalories: current.consumedCalories + item.calories
    });
  };

  const handleRemoveCustomItem = (itemId: string, calories: number) => {
    const current = getCurrentLog();
    updateCurrentLog({
        customItems: current.customItems.filter(i => i.id !== itemId),
        consumedCalories: Math.max(0, current.consumedCalories - calories)
    });
  };

  const handleFinishDay = () => {
    // Mark complete
    updateCurrentLog({ isCompleted: true });
    
    // Simple visual feedback could go here
    setTimeout(() => {
        if (state.currentDay < TOTAL_DAYS) {
            setState(prev => ({
                ...prev,
                currentDay: prev.currentDay + 1
            }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
             alert("Parabéns! Você completou o protocolo!");
        }
    }, 500);
  };

  const currentLog = getCurrentLog();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20 font-sans relative">
      
      {/* Settings Button */}
      <button 
        onClick={openSettings}
        className="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full border border-slate-700"
      >
        <Icons.Settings className="w-5 h-5" />
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-2">Configurar IA</h3>
                <p className="text-sm text-slate-400 mb-4">
                    Para usar a estimativa de calorias, você precisa de uma API Key.
                    <br/>
                    <span className="text-xs text-green-400 block mt-2">
                        {firebaseConfig.apiKey ? "✓ Chave do Firebase detectada e em uso." : ""}
                    </span>
                </p>
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Sua Chave de API (Opcional se usar Firebase)</label>
                    <input 
                        type="text" 
                        value={tempKey}
                        onChange={(e) => setTempKey(e.target.value)}
                        placeholder={firebaseConfig.apiKey ? "Usando chave do Firebase..." : "Cole sua chave AIza... aqui"}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            onClick={() => setShowSettings(false)}
                            className="px-4 py-2 text-slate-400 font-medium hover:text-white"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={saveApiKey}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500"
                        >
                            Salvar Chave Manual
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <DaySelector 
        currentDay={state.currentDay} 
        onSelectDay={handleSelectDay}
        logs={state.logs}
      />

      <div className="px-4 space-y-6 max-w-lg mx-auto mt-4">
        
        <NutritionCard consumed={currentLog.consumedCalories} />
        
        <div className="grid grid-cols-1 gap-6">
             <WeightCard 
                currentWeight={currentLog.weight} 
                onUpdateWeight={handleUpdateWeight}
            />
            <HydrationCard 
                intake={currentLog.waterIntake} 
                onAdd={handleAddWater}
            />
        </div>

        <div className="pt-6">
            <h3 className="text-xl font-bold text-white mb-6 pl-2 border-l-4 border-indigo-500">Rotina Diária</h3>
            <div className="pl-4 border-l border-slate-800 ml-2 space-y-0">
                {DEFAULT_TIMELINE.map(event => (
                    <TimelineItem 
                        key={event.id}
                        event={event}
                        checkedItemIds={currentLog.checkedItems}
                        customItems={currentLog.customItems?.filter(i => i.eventId === event.id)}
                        onToggleItem={handleToggleItem}
                        onAddCustomItem={handleAddCustomItem}
                        onRemoveCustomItem={handleRemoveCustomItem}
                        apiKey={apiKey}
                    />
                ))}
            </div>
        </div>

        {/* Sticky Finish Button */}
        <div className="sticky bottom-4 z-50">
            {currentLog.isCompleted ? (
                 <div className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/50 opacity-90 backdrop-blur-sm">
                    <Icons.CheckCircle className="w-6 h-6" />
                    Dia Concluído
                </div>
            ) : (
                <button 
                    onClick={handleFinishDay}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-bold py-4 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-indigo-900/50 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-2 text-lg">
                        <Icons.CheckCircle className="w-6 h-6" />
                        CONCLUIR DIA (DAR BAIXA)
                    </div>
                    <span className="text-xs text-indigo-200 font-normal mt-1 opacity-80">
                        Isso salvará seu histórico e avançará o calendário.
                    </span>
                </button>
            )}
        </div>
        
        <div className="h-8"></div> {/* Spacer for bottom scroll */}
      </div>
    </div>
  );
};

export default App;