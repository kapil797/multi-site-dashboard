export interface Status {
  status?: string;
  isLate?: boolean;
  lastUpdated?: string;
}

export interface SalesOrder {
  salesOrderNo: string;
  customer: string;
}

export interface WorkOrder {
  id: number;
  workOrderNumber: string;
  issueDate: string;
  committedDeliveryDate: string;
  createdBy: string;
  dueDate: string;
  customer: Customer;
  poNumbers: string; // Sales order number.
  soPriority: string;
}

export interface Customer {
  id: number;
  name: string;
  description: string;
}

export interface Execution {
  id: number;
  woid: string;
  step: number;
  processStartTime: string;
  processEndTime: string;
  estimateCompleteTime: string;
  process: Process;
  completeQty: number;
  outStandingQty: number;
  releasedQty: number;
  scrapQty: number;
  statusId: number;
  statusName: string;
}

export interface Process {
  id: number;
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
