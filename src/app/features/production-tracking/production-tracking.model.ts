export const ProcessStatus = Object.freeze({
  1: 'QUEUING',
  2: 'STANDBY',
  3: 'READY',
  4: 'COMPLETED',
  5: 'PAUSE',
  6: 'CANCELLED',
  8: 'PROCESSING',
});

export interface StatusAggregate {
  releasedQty: number;
  completedQty: number;
  lastUpdated: string;
  estimatedCompleteDate?: string;
  completedDate?: string;
  progress: number;
  totalProcesses: number;
  completedProcesses: number;
}

export interface SalesOrder {
  id: number;
  salesOrderNumber: string;
  customerId: number;
  firstName: string;
  lastName: string;
  lineItems: LineItem[];
  createdAt: string;
  customerName: string;
  expectedDeliveryDate: string;
}

export interface RpsSalesOrder {
  id: number;
  salesOrderNumber: string;
  customerName: string;
  dueDate: string;
  orderDate: string;
  salesOrderLines: SalesOrderLine[];
  sortKey: string;
}

export interface SalesOrderAggregate extends RpsSalesOrder, StatusAggregate {
  lineItemAggregates: LineItemAggregate[];
}

export interface SalesOrderLine {
  id: number; // line item id.
  quantity: number;
  productId: number;
  lineNumber: number;
  salesOrderId: number;
  salesOrderNumber: string;
  productNo: string; // i.e. 15ESZ-9010-AA-P06.
  productName: string; // Description i.e. eScentz (L-C, BL) with Personalised Text
}

export interface LineItem {
  // Individual transaction on a salesorder.
  productId: number; // Created by RPS.
  productNo: string; // i.e. 15ESZ-9010-AA-P06.
  productName: string; // Description i.e. eScentz (L-C, BL) with Personalised Text
  quantity: number;
}

export interface LineItemAggregate extends SalesOrderLine {
  workOrderAggregates: WorkOrderAggregate[];
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
  workOrderLines: WorkOrderLine[]; // Should only contain 1 item; 1-to-1 mapping with SalesOrderLineItem.
}

export interface WorkOrderLine {
  id: number;
  workOrderId: number;
  salesOrderLineId: number;
  salesOrderNumber: string;
  salesOrderLineNumber: number;
}

export interface Customer {
  id: number;
  name: string;
  description: string | null;
}

export interface RpsWorkOrder {
  id: number; // correlationId is required to fetch executions from RTD.
  woid: string; // Work Order number e.g. 2402190003
  subWorkOrders: RpsWorkOrder[];
  issueTime: string;
  dueTime: string;
}

export interface RpsRtdCorrelation {
  correlationId: number;
  workOrderNumber: string;
}

export interface WorkOrderAggregate extends StatusAggregate {
  workOrderNumber: string;
  correlationId: number;
  executions: Execution[];
  executionStage?: string;
  issueTime: string;
  dueTime: string;
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
  workCenter: WorkCenter;
}

export interface WorkCenter {
  id: number;
  description: string;
  name: string;
}

export interface Machine {
  id: number;
  machineNo: string;
  name: string;
}

export interface ProcessTrackingMap {
  productCode: string;
  productionCode: string;
  category: string;
  rows: number;
  cols: number;
  items: ProcessTrackingItem[];
}

export interface ProcessTrackingItem {
  text: string;
  processCode: string;
  processId?: number;
  id: number;
  row: number;
  col: number;
  toId?: number;
  statusId?: number; // Ongoing, completed, etc.
}
export interface RtdStream {
  WOID: string;
  SalesOrderID: string;
  OutstandingQty: number;
  CompletedQty: number;
  CompletedDate: string | null;
  ScrapQty?: number;
  WOProcessStatus?: string;
  WOStatus?: string;
  ProcessName?: string;
}

export interface SalesOrderStream {}
