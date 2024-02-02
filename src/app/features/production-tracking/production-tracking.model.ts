export const ProcessStatus = Object.freeze({
  4: 'COMPLETED',
});

export interface Status {
  status?: string;
  isLate?: boolean;
  lastUpdated?: string;
}

export interface SalesOrder {
  id: number;
  salesOrderNumber: string;
  customerId: number;
  customerName: string;
  lineItems: LineItem[];
}

export interface LineItem {
  productId: number; // Created by RPS.
  productNo: string;
  productName: string;
  quantity: number;
}

export interface WorkOrder {
  id: number;
  workOrderNumber: string;
  issueDate: string;
  committedDeliveryDate: string;
  completionDate: string | null;
  createdBy: string;
  dueDate: string;
  customer: Customer;
  poNumbers: string; // SalesOrder number created by OrderApp.
  soPriority: string;
  urgentFlag: number;
  priority: number;
  status: number;
  productId: number; // Created by RPS. required for mapping.
  productNo: string; // i.e. 15ESZ-9010-AA-P06.
  productName: string; // Description i.e. eScentz (L-C, BL) with Personalised Text
}

export interface Customer {
  id: number;
  name: string;
  description: string;
}

export interface Execution {
  id: number;
  woid: string;
  step: number; // Sequence number.
  processStartTime: string | null;
  processEndTime: string | null;
  estimateCompleteTime: string;
  process: Process;
  completeQty: number;
  outStandingQty: number;
  releasedQty: number;
  scrapQty: number;
  statusId: number;
  statusName: string;
  currMachine: Machine;
  textStatus?: string;
}

export interface Process {
  id: number;
  name: string;
}

export interface Machine {
  id: number;
  machineNo: string;
  name: string;
}

export interface SalesOrderStatus extends Status {
  salesOrderNo: string;
  customer: string;
}

export interface WorkOrderStatus extends Status {
  workOrderNo: string;
  processStage: string;
}

export interface Product {
  id: string | number; // Created by RPS. required for mapping.
  number: string; // i.e. 15ESZ-9010-AA-P06.
  name: string; // Description i.e. eScentz (L-C, BL) with Personalised Text
  workOrders: WorkOrder[];
  executions: Execution[];
}

export interface ProcessTracking {
  productId: number;
  category: string;
  rows: number;
  cols: number;
  items: ProcessTrackingItem[];
}

export interface ProcessTrackingItem {
  text: string;
  processId: number;
  row: number;
  col: number;
  toProcessId?: number;
  statusId?: number;
}
