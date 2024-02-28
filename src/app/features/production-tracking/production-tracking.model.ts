export const ProcessStatus = Object.freeze({
  1: 'QUEUING',
  2: 'STANDBY',
  3: 'READY',
  4: 'COMPLETED',
  5: 'PAUSE',
  6: 'CANCELLED',
  8: 'PROCESSING',
});

export interface SalesOrder {
  id: number;
  salesOrderNumber: string;
  customerId: number;
  customerName: string;
  lineItems: LineItem[];
  createdDate: string;
}

export interface SalesOrderStatus {
  releasedQty: number;
  completedQty: number;
  lastUpdated: string;
  estimatedCompleteTime?: string;
}

export interface SalesOrderAggregate extends SalesOrder {
  lineItemAggregates: LineItemAggregate[];
  progress?: number;
  estimatedCompleteTime?: string;
  completedTime?: string;
  lastUpdated: string;
}

export interface LineItem {
  // Individual transaction on a salesorder.
  productId: number; // Created by RPS.
  productNo: string; // i.e. 15ESZ-9010-AA-P06.
  productName: string; // Description i.e. eScentz (L-C, BL) with Personalised Text
  quantity: number;
}

export interface LineItemAggregate extends LineItem {
  workOrderFamily: RpsWorkOrder;
  executions: Execution[];
  processTrackingMap?: ProcessTrackingMap;
}

export interface WorkOrder {
  id: number;
  workOrderNumber: string;
  issueDate: string;
  committedDeliveryDate: string;
  completionDate: string | null;
  createdBy: string | null;
  dueDate: string;
  customer: Customer;
  poNumbers: string; // PoNumber same as SalesOrderNumber, created by OrderApp.
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
  description: string | null;
}

export interface RpsWorkOrder {
  id: number; // Id is required to fetch executions from RTD.
  woid: string; // Work Order number e.g. 2402190003
  subWorkOrders: RpsWorkOrder[];
}

export interface RpsRtdCorrelation {
  correlationId: number;
  workOrderNumber: string;
}

export interface Execution {
  id: number;
  woid: string; // Work Order number e.g. 2402190003
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
  partsCompleted?: string;
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

export interface ProcessTrackingMap {
  productId: number;
  category: string;
  rows: number;
  cols: number;
  items: ProcessTrackingItem[];
}

export interface ProcessTrackingItem {
  text: string;
  id: number;
  row: number;
  col: number;
  toId?: number;
  statusId?: number; // Ongoing, completed, etc.
}

export interface WebsocketStream {
  type: string;
}

export interface ExecutionStream extends WebsocketStream {
  WOID: string;
  SalesOrderID: string;
  OutstandingQty: number;
  ScrapQty: number;
  CompletedQty: number;
  ProdStartdate: string;
  ProdEndDate: string;
  WOProcessStatus: string;
  CompletedDate: string;
  ProcessName: string;
}

export interface SalesOrderStream extends WebsocketStream {}
