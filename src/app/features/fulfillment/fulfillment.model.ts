export interface DemandProfile {
  pastForecast: DemandSeries[];
  futureForecast: DemandSeries[];
  actual: DemandSeries[];
}

export interface DemandSeries {
  demand: number;
  createdDate: Date;
}

export type Product = 'ESCENTZ' | 'MFCONNECT+';
