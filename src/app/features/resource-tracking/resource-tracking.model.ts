export interface TrackedMachine {
  metadata: MachineStatus;
  resourceData: ResourceConsumption[];
  alertHistoryData: MachineAlertHistory[];
}

export interface MachineStatus {
  id: string;
  name: string;
  category: string;
  power: number;
  energy: number;
  waste: number;
  x: number;
  y: number;
  idlingThreshold: Threshold;
  productionThreshold: Threshold;
}

export interface Threshold {
  eGreen: number; // Threshold for low consumption.
  eRed: number; // Threshold for high consumption.
}

export interface ResourceConsumption {
  windowedMode: number; // Idling vs production.
  receivedDate: string;
  powerLoad: number;
  sequence: number;
}

export interface MachineAlertHistory {
  issue: string;
  createdDate: string;
  description: string;
}
