export interface MapToken {
  userName?: string;
  userRole?: string;
  fullName?: string;
  token: string;
}
export interface Vehicle {
  DriverUsername: string;
  EndAddressPostal: string;
  EndTime: string;
  Id: string;
  PlateNumber: string;
  ReturnToEndAddress: boolean;
  StartAddressPostal: string;
  StartTime: string;
  VehicleType: VehicleType;
  VehicleTypeId: number;
}
export interface VehicleType {
  Id: number;
  Name: string;
  Capacity: number;
  FixedCost: number;
  DistanceCost: number;
  TravelTimeCost: number;
  WaitingTimeCost: number;
}
export interface Route {
  startPoint: Point;
  endPoint: Point;
  line_color: string;
}

export interface Delivery {
  driver: string;
  pending: number;
  total: number;
  percentage: number;
  pickup: string;
}
export interface Point {
  title: string;
  description: string;
  coordinates: mapboxgl.LngLatLike;
}
export interface EndPostalCode {
  id: string;
  postal: string;
  lat: number;
  lon: number;
}
export interface TrackingPostalCode {
  id: string;
  postal: string;
  lat: number;
  lon: number;
}
export enum MarkerType {
  start = 0,
  end = 1,
  driver = 2,
}

export interface DeliveryDetail {
  NoteFromPlanner: string | null;
  NoteFromDriver: string | null;
  Id: number;
  DeliveryMasterId: string;
  Status: number;
  JobSequence: number;
  JobType: string;
  Address: string;
  Postal: string;
  Lat: number;
  Lng: number;
  StartTimeWindow: string;
  EndTimeWindow: string;
  ServiceTime: number;
  ContactName: string;
  ContactPhone: string;
  ContactEmail: string;
  ActualDeliveryTime: string | null;
  EngineRouteSeqNum: number | null;
  DeliveryMaster: DeliveryMaster;
  DeliveryItems: DeliveryItem[];
  VerificationCode: VerificationCode | null;
}

export interface DeliveryMaster {
  Id: string;
  Status: number;
  VehicleId: string | null; // Allow VehicleId to be null or string
  LastAttemptedByDriver: string | null;
  LastAttemptedByPlateNumber: string | null;
  Priority: number;
  CustomerName: string;
  CustomerPhone: string;
  CustomerEmail: string;
  VehicleRestriction: string;
}

export interface DeliveryItem {
  Id: number;
  DeliveryDetailId: number;
  ItemId: string;
  ItemQty: number;
  ActualItemQty: number | null;
}
export interface VerificationCode {
  DeliveryDetailId: number;
  Code: string;
}
export interface OrderStatusSummary {
  LateFrequency: number;
  OnTimeFrequency: number;
  OrderStatus: string;
}
export interface IndividualOrderStatus {
  SalesOrderNumber: string;
  AccountType: string;
  CustomerName: string;
  OrderProductionStatus: string;
  OrderDueDate: string;
  ActualDeliveryTime: string;
  ModifiedOn: string;
}
