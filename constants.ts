import { TimelineEvent } from './types';

export const TOTAL_DAYS = 17;
export const CALORIE_GOAL = 1200;
export const WATER_GOAL = 3500;

export const DEFAULT_TIMELINE: TimelineEvent[] = [
  {
    id: 'evt_0700_meds',
    time: '07:00',
    title: 'Despertar & Meds',
    type: 'medication',
    icon: 'pill',
    items: [
      { id: 'med_venvanse', name: 'Venvanse', dose: '30mg' },
      { id: 'med_sertralina', name: 'Sertralina', dose: '25mg' },
      { id: 'med_bup', name: 'Bup', dose: '100mg' },
      { id: 'med_topiramato', name: 'Topiramato', dose: '100mg' },
      { id: 'med_vitamina', name: 'Vitamina Bariátrica' },
    ]
  },
  {
    id: 'evt_0700_bkf',
    time: '07:15',
    title: 'Café da Manhã',
    type: 'meal',
    icon: 'coffee',
    tip: 'Café rico em proteína. Evite farinhas brancas para não ter pico de insulina.',
    items: [
      { id: 'food_eggs', name: '2 Ovos Mexidos', calories: 160 },
      { id: 'food_cheese', name: 'Queijo Minas (2 fat)', calories: 120 },
      { id: 'food_bread', name: 'Pão Int. + Ricota', calories: 140 },
      { id: 'food_yogurt', name: 'Iogurte Proteico', calories: 90 },
      { id: 'food_whey', name: 'Dose Whey Protein', calories: 120 },
    ]
  },
  {
    id: 'evt_1000_water',
    time: '10:00',
    title: 'Hidratação Turbo',
    type: 'hydration',
    icon: 'droplet',
    description: 'Beba pelo menos 500ml de água agora.'
  },
  {
    id: 'evt_1130_block',
    time: '11:30',
    title: 'Bloqueio Gástrico',
    type: 'block',
    icon: 'shield',
    description: 'Psyllium + Chia + 300ml Água',
    warning: 'Essencial para saciedade.'
  },
  {
    id: 'evt_1200_lunch',
    time: '12:00',
    title: 'Almoço Bariátrico',
    type: 'meal',
    icon: 'utensils',
    tip: "Coma a proteína primeiro. Pare ao sinal de saciedade (o 'suspiro').",
    items: [
      { id: 'food_chicken_veg', name: 'Frango + Legumes', calories: 220 },
      { id: 'food_fish_puree', name: 'Peixe + Purê', calories: 200 },
      { id: 'food_beef_salad', name: 'Carne Moída + Salada', calories: 250 },
      { id: 'food_omelet_oven', name: 'Omelete de Forno', calories: 180 },
    ]
  },
  {
    id: 'evt_1500_tea',
    time: '15:00',
    title: 'Chá Seca-Barriga',
    type: 'tea',
    icon: 'tea',
    isRecipe: true,
    recipeIngredients: [
      '1L Água',
      'Hibisco',
      'Chá Verde',
      'Anis Estrelado'
    ],
    description: 'Termogênico natural. Beba ao longo da tarde.'
  },
  {
    id: 'evt_1600_snack',
    time: '16:00',
    title: 'Lanche Proteico',
    type: 'meal',
    icon: 'apple',
    tip: 'Evite beliscar. Faça uma refeição sentada.',
    items: [
      { id: 'food_snack_yogurt', name: 'Iogurte Natural', calories: 80 },
      { id: 'food_snack_fruit', name: 'Fruta', calories: 60 },
      { id: 'food_snack_egg', name: '1 Ovo Cozido', calories: 70 },
      { id: 'food_snack_shake', name: 'Shake de Whey', calories: 120 },
    ]
  },
  {
    id: 'evt_1830_block',
    time: '18:30',
    title: 'Bloqueio Noturno',
    type: 'block',
    icon: 'shield',
    description: 'Psyllium + Chia + Água'
  },
  {
    id: 'evt_1900_dinner',
    time: '19:00',
    title: 'Jantar Leve',
    type: 'meal',
    icon: 'soup',
    description: 'Tome seu Glifage XR 1000mg junto com o jantar.',
    items: [
      { id: 'food_soup', name: 'Sopa Legumes + Frango', calories: 150 },
      { id: 'food_dinner_omelet', name: 'Omelete (1 ovo)', calories: 100 },
      { id: 'food_pumpkin', name: 'Caldo de Abóbora', calories: 120 },
    ]
  },
  {
    id: 'evt_2100_meds',
    time: '21:00',
    title: 'Meds & Jejum',
    type: 'medication',
    icon: 'moon',
    warning: 'Jejum total a partir de agora.',
    items: [
      { id: 'med_bup_pm', name: 'Bup', dose: '100mg' },
      { id: 'med_topiramato_pm', name: 'Topiramato', dose: '50mg' },
    ]
  }
];