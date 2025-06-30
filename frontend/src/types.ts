// src/types.ts

export interface Goal {
  _id: string; // MongoDB's default ID field
  title: string;
  targetAmount: number;
  imageUrl?: string; // Optional if not always provided
  createdAt: string; // ISO Date string from timestamps
  updatedAt: string; // ISO Date string from timestamps
}

export interface Contribution {
  _id: string;
  goalId: string; // Refers to Goal._id
  amount: number;
  note?: string; // Optional
  date: string; // ISO Date string, default Date.now
}

// Type for the progress endpoint response
export interface GoalProgress {
  goalId: string;
  titulo: string;
  totalAportado: number;
  montoObjetivo: number;
  porcentajeAvance: string; // It's a string from toFixed(2)
}