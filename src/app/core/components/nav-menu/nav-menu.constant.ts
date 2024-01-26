import { routePaths } from '@core/constants/routes.constant';
import {
  faBriefcase,
  faTruck,
  faStreetView,
  faClipboardList,
  faBox,
  faRightLeft,
  faBoltLightning,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export interface NavItem {
  name: string;
  icon: IconDefinition;
  row: number;
  col: number;
  resource: string;
}

export const mfNavItems: NavItem[] = [
  {
    name: 'Logistic Tracking',
    icon: faTruck,
    row: 1,
    col: 1,
    resource: routePaths.LOGISTIC_TRACKING,
  },
  {
    name: 'Management KPIs',
    icon: faBriefcase,
    row: 1,
    col: 2,
    resource: routePaths.MANAGEMENT_KPIS,
  },
  {
    name: 'Management KPIs',
    icon: faBriefcase,
    row: 1,
    col: 3,
    resource: routePaths.MANAGEMENT_KPIS,
  },
  {
    name: 'Demand Profile',
    icon: faStreetView,
    row: 1,
    col: 4,
    resource: routePaths.DEMAND_PROFILE,
  },
  {
    name: 'Production Tracking',
    icon: faClipboardList,
    row: 2,
    col: 1,
    resource: routePaths.PRODUCTION_TRACKING,
  },
  {
    name: 'Production & Inventory',
    icon: faBox,
    row: 2,
    col: 4,
    resource: routePaths.PRODUCTION_INVENTORY,
  },
  {
    name: 'Resource Tracking',
    icon: faRightLeft,
    row: 3,
    col: 1,
    resource: routePaths.RESOURCE_TRACKING,
  },
  {
    name: 'Resource Health',
    icon: faBoltLightning,
    row: 3,
    col: 4,
    resource: routePaths.RESOURCE_HEALTH,
  },
];

export const umfNavItems: NavItem[] = [
  {
    name: 'Logistic Tracking',
    icon: faTruck,
    row: 1,
    col: 1,
    resource: routePaths.LOGISTIC_TRACKING,
  },
  {
    name: 'Management KPIs',
    icon: faBriefcase,
    row: 1,
    col: 2,
    resource: routePaths.MANAGEMENT_KPIS,
  },
  {
    name: 'Demand Profile',
    icon: faStreetView,
    row: 1,
    col: 3,
    resource: routePaths.DEMAND_PROFILE,
  },
  {
    name: 'Production Tracking',
    icon: faClipboardList,
    row: 2,
    col: 1,
    resource: routePaths.PRODUCTION_TRACKING,
  },
  {
    name: 'Resource Tracking',
    icon: faRightLeft,
    row: 3,
    col: 1,
    resource: routePaths.RESOURCE_TRACKING,
  },
];
