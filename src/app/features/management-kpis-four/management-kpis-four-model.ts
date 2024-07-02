export interface ManagementLayerOneData {
  Id: number;
  Category: string;
  Value: number;
  Projection: number;
  ProjectionHealth: string;
  Target: number;
  Period: string;
  ProjectionDay: string;
}
export interface ApiResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Result?: any;
}
// export interface FinancialKPI {
//   Id: number;
//   Category: string;
//   Value: number;
//   ValuePerUnit: number;
//   Projection: number;
//   ProjectionPerUnit: number;
//   ProjectionHealth: string;
//   Target: number;
//   FromTarget: number;
//   TargetPerUnit: number;
//   FromTargetPerUnit: number;
//   Period: string;
//   ProjectionDay: string;
// }
// export interface CustomerSatisfaction {
//   Id: number;
//   Category: string;
//   Value: number;
//   Projection: number;
//   ProjectionHealth: string;
//   Target: number;
//   FromTarget: number;
//   Period: string;
//   ProjectionDay: string;
// }
export interface InventoryKPI {
  Category: string;
  Cost: number;
  value: string;
  userColor: string;
}
export interface LabelColor {
  category: string;
  dataitem: object;
  percentage: number;
  series: { color: string };
  value: number;
}
// export interface OperationKPI {
//   Id: number;
//   Category: string;
//   Value: number;
//   Projection: number;
//   ProjectionHealth: string;
//   Target: number;
//   FromTarget: number;
//   Period: string;
//   ProjectionDay: string;
// }
// export interface ProductivityKPI {
//   Id: number;
//   Category: string;
//   Value: number;
//   Projection: number;
//   ProjectionHealth: string;
//   Target: number;
//   FromTarget: number;
//   Period: string;
//   ProjectionDay: string;
// }
// export interface SafetyKPI {
//   Id: number;
//   Category: string;
//   Value: number;
//   Projection: number;
//   ProjectionHealth: string;
//   Target: number;
//   FromTarget: number;
//   Period: string;
//   ProjectionDay: string;
// }
