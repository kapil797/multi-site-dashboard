export type Period = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'HALF-YEARLY' | 'YEARLY';

export interface OverallResourceHealth {
  id: number;
  title: string;
  categories: CategoryResourceHealth[];
}

export interface CategoryResourceHealth {
  name: string;
  value: number | null;
}

export interface MachineResourceHealth {
  name: string;
  category: string;
  OEE: number | null;
  availability: number | null;
  performance: number | null;
  quality: number | null;
}

export interface ResourceConsumption {
  createdDate: string;
  generationIntensity: number;
  amount: number;
}

export interface AggregatedResourceConsumption {
  generationIntensity: number;
  amount: number;
  periodRange: string;
}
