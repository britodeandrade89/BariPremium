import React, { useState } from 'react';
import { TimelineEvent, FoodItem, MedicationItem, CustomFoodItem } from '../types';
import { getIcon, Icons } from './Icons';
import { GoogleGenAI, Type } from "@google/genai";

interface TimelineItemProps {
  event: TimelineEvent;
  checkedItemIds: string[];
  customItems?: CustomFoodItem[];
  onToggleItem: (itemId: string, calories: number) => void;
  onAddCustomItem?: (eventId: string, item: { name: string; calories: number }) => void;
  onRemoveCustomItem?: (itemId: string, calories: number) => void;
  apiKey: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ 
  event, 
  checkedItemIds, 
  customItems = [], 
  onToggleItem,
  onAddCustomItem,
  onRemoveCustomItem,
  apiKey
}) => {
  const [customInput, setCustomInput] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [aiResult, setAiResult] = useState<{name: string, calories: number} | null>(null);

  const isChecked = (id: string) => checkedItemIds.includes(id);

  // Styling based on type
  const getTypeStyles = () => {
    switch(event.type) {
        case 'block': return 'border-l-4 border-rose-500 bg-rose-900/10';
        case 'medication': return 'border-l-4 border-indigo-500 bg-slate-800';
        case 'meal': return 'border-l-4 border-emerald-500 bg-slate-800';
        case 'hydration': return 'border-l-4 border-blue-500 bg-blue-900/10';
        case 'tea': return 'border-l-4 border-amber-500 bg-amber-900/10';
        default: return 'border-l-4 border-slate-500 bg-slate-800';
    }
  };

  const getIconColor = () => {
     switch(event.type) {
        case 'block': return 'text-rose-400';
        case 'medication': return 'text-indigo-400';
        case 'meal': return 'text-emerald-400';
        case 'hydration': return 'text-blue-400';
        case 'tea': return 'text-amber-400';
        default: return 'text-slate-400';
    }
  }

  const handleEstimateCalories = async () => {
    if (!customInput.trim()) return;
    setIsEstimating(true);
    setAiResult(null);

    try {
      // Use the provided API key or fallback to env for dev
      const key = apiKey || process?.env?.API_KEY;
      
      if (!key) {
        throw new Error("Chave de API não configurada. Clique na engrenagem no topo para adicionar.");
      }

      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Identifique o alimento e estime as calorias totais de: '${customInput}'. Responda APENAS o JSON com nome curto e calorias.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodName: { type: Type.STRING, description: "Short name of the food in Portuguese" },
              calories: { type: Type.INTEGER, description: "Total estimated calories" },
            },
            required: ["foodName", "calories"]
          }
        }
      });

      if (response.text) {
        // Clean up markdown code blocks if present
        const text = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(text);
        setAiResult({ name: data.foodName, calories: data.calories });
      }
    } catch (error: any) {
      console.error("Error estimating calories:", error);
      
      let friendlyMessage = "Não foi possível conectar com a IA.";
      const errorMessage = error.message || JSON.stringify(error);
      
      if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
        friendlyMessage = "Sua Chave de API é inválida. Clique na engrenagem no topo e insira uma chave que comece com 'AIza'.";
      } else if (errorMessage.includes("Failed to fetch")) {
        friendlyMessage = "Erro de conexão. Verifique sua internet.";
      } else {
        // Attempt to parse complicated google errors
        friendlyMessage = "Erro ao processar. Verifique se a chave está correta.";
      }

      alert(friendlyMessage);
    } finally {
      setIsEstimating(false);
    }
  };

  const confirmAddCustomItem = () => {
    if (aiResult && onAddCustomItem) {
      onAddCustomItem(event.id, aiResult);
      setAiResult(null);
      setCustomInput('');
    }
  };

  return (
    <div className={`mb-6 ml-4 relative`}>
        {/* Timeline Line */}
        <div className="absolute -left-[29px] top-2 h-full w-0.5 bg-slate-800"></div>
        {/* Time Bullet */}
        <div className="absolute -left-[35px] top-0 bg-slate-900 text-slate-500 text-xs font-bold py-1">
            {event.time}
        </div>

      <div className={`rounded-2xl p-5 ${getTypeStyles()} relative overflow-hidden`}>
        <div className="flex items-start gap-3 mb-3">
             <div className={`${getIconColor()} mt-1`}>
                {getIcon(event.icon || 'circle', "w-6 h-6")}
             </div>
             <div className="flex-1">
                 <h4 className="text-lg font-bold text-white leading-tight">{event.title}</h4>
                 {event.description && (
                     <p className="text-sm text-slate-400 mt-1">{event.description}</p>
                 )}
                 {event.warning && (
                     <div className="mt-2 flex items-center gap-2 text-xs text-rose-300 bg-rose-900/20 px-3 py-1.5 rounded-lg border border-rose-900/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                        <span>{event.warning}</span>
                     </div>
                 )}
             </div>
        </div>

        {/* Nutrition Tip */}
        {event.tip && (
            <div className="mb-4 bg-amber-900/20 border border-amber-900/30 rounded-xl p-3 flex gap-3">
                <Icons.Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                    <span className="block text-xs font-bold text-amber-400 mb-0.5">Dica Nutri</span>
                    <p className="text-xs text-amber-100/80 leading-relaxed">{event.tip}</p>
                </div>
            </div>
        )}

        {/* Recipe Ingredients */}
        {event.isRecipe && event.recipeIngredients && (
            <div className="mb-2 bg-slate-900/50 rounded-xl p-3">
                <ul className="grid grid-cols-2 gap-2">
                    {event.recipeIngredients.map((ing, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                            {ing}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Standard Items */}
        {event.items && (
            <div className="space-y-2 mt-3">
                {event.type === 'meal' && (
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <Icons.Utensils className="w-3 h-3" />
                        <span>Opções do Protocolo</span>
                    </div>
                )}
                
                {event.items.map((item) => {
                    const checked = isChecked(item.id);
                    const isFood = 'calories' in item;
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => onToggleItem(item.id, isFood ? (item as FoodItem).calories : 0)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group text-left
                                ${checked 
                                    ? 'bg-indigo-600/20 border-indigo-500/50' 
                                    : 'bg-slate-900/40 border-slate-700/50 hover:bg-slate-700/50'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors
                                    ${checked 
                                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                                        : 'border-slate-600 bg-slate-800'
                                    }
                                `}>
                                    {checked && <Icons.Check className="w-3.5 h-3.5" />}
                                </div>
                                <div>
                                    <div className={`text-sm font-medium ${checked ? 'text-indigo-200 line-through' : 'text-slate-200'}`}>
                                        {item.name}
                                    </div>
                                    {'dose' in item && (
                                        <div className="text-xs text-slate-500">{(item as MedicationItem).dose}</div>
                                    )}
                                </div>
                            </div>
                            
                            {isFood && (
                                <div className={`text-xs font-bold ${checked ? 'text-indigo-300' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                    {(item as FoodItem).calories} kcal
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        )}

        {/* Custom Items List */}
        {customItems.length > 0 && (
             <div className="mt-4 space-y-2">
                 <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                    <Icons.CheckCircle className="w-3 h-3" />
                    <span>Meus Registros</span>
                </div>
                {customItems.map((item) => (
                    <div key={item.id} className="w-full flex items-center justify-between p-3 rounded-xl border border-indigo-500/30 bg-indigo-900/10">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-500 border border-indigo-500 text-white">
                                <Icons.Check className="w-3.5 h-3.5" />
                            </div>
                            <div className="text-sm font-medium text-indigo-200">
                                {item.name}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="text-xs font-bold text-indigo-300">
                                {item.calories} kcal
                            </div>
                            {onRemoveCustomItem && (
                                <button 
                                    onClick={() => onRemoveCustomItem(item.id, item.calories)}
                                    className="text-slate-500 hover:text-red-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
             </div>
        )}

        {/* AI Custom Input for Meals */}
        {event.type === 'meal' && onAddCustomItem && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
                {!aiResult ? (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                            Comeu algo diferente?
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Ex: Café preto e pão integral"
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                                onKeyDown={(e) => e.key === 'Enter' && handleEstimateCalories()}
                            />
                            <button 
                                onClick={handleEstimateCalories}
                                disabled={isEstimating || !customInput.trim()}
                                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-3 rounded-xl flex items-center justify-center transition-colors"
                            >
                                {isEstimating ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-indigo-900/20 border border-indigo-500/50 rounded-xl p-3 animate-in fade-in zoom-in duration-300">
                        <div className="space-y-3 mb-3">
                            <div>
                                <label className="block text-[10px] text-indigo-300 uppercase font-bold mb-1">O que identificamos:</label>
                                <input 
                                    type="text" 
                                    value={aiResult.name}
                                    onChange={(e) => setAiResult(prev => prev ? ({...prev, name: e.target.value}) : null)}
                                    className="w-full bg-slate-800 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-indigo-300 uppercase font-bold mb-1">Calorias Estimadas:</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={aiResult.calories}
                                        onChange={(e) => setAiResult(prev => prev ? ({...prev, calories: Number(e.target.value)}) : null)}
                                        className="w-full bg-slate-800 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    />
                                    <span className="absolute right-3 top-2 text-sm text-slate-500">kcal</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={() => { setAiResult(null); setCustomInput(''); }}
                                className="flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmAddCustomItem}
                                className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20 transition-colors"
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;