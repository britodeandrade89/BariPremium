export interface FoodItem {
  id: string;
  name: string;
  calories: number;
}

export interface MedicationItem {
  id: string;
  name: string;
  dose?: string;
}

export interface CustomFoodItem {
  id: string;
  name: string;
  calories: number;
  eventId: string;
}

export type TimelineEventType = 'medication' | 'meal' | 'hydration' | 'block' | 'tea' | 'info';

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  type: TimelineEventType;
  icon?: string;
  description?: string;
  warning?: string;
  tip?: string;
  items?: (FoodItem | MedicationItem)[];
  isRecipe?: boolean;
  recipeIngredients?: string[];
}

export interface DailyLog {
  waterIntake: number;
  consumedCalories: number;
  weight: number;
  checkedItems: string[]; // IDs of checked timeline items (foods or meds)
  customItems: CustomFoodItem[]; // Items added via AI
  isCompleted: boolean;
}

export interface AppState {
  currentDay: number; // 1 to 17
  logs: Record<number, DailyLog>; // day number -> log
}