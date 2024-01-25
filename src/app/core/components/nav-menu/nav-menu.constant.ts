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
  layerOneUrl: string;
  layerTwoUrl: string;
}

export const mfNavItems: NavItem[] = [
  {
    name: 'Logistic Tracking',
    icon: faTruck,
    row: 1,
    col: 1,
    layerOneUrl: routePaths.LOGISTIC_TRACKING_ONE,
    layerTwoUrl: routePaths.LOGISTIC_TRACKING_TWO,
  },
  {
    name: 'Management KPIs',
    icon: faBriefcase,
    row: 1,
    col: 2,
    layerOneUrl: routePaths.MANAGEMENT_KPIS_ONE,
    layerTwoUrl: routePaths.MANAGEMENT_KPIS_TWO,
  },
  {
    name: 'Management KPIs',
    icon: faBriefcase,
    row: 1,
    col: 3,
    layerOneUrl: routePaths.MANAGEMENT_KPIS_ONE,
    layerTwoUrl: routePaths.MANAGEMENT_KPIS_TWO,
  },
  {
    name: 'Demand Profile',
    icon: faStreetView,
    row: 1,
    col: 4,
    layerOneUrl: routePaths.DEMAND_PROFILE_ONE,
    layerTwoUrl: routePaths.DEMAND_PROFILE_TWO,
  },
  {
    name: 'Production Tracking',
    icon: faClipboardList,
    row: 2,
    col: 1,
    layerOneUrl: routePaths.PRODUCTION_TRACKING_ONE,
    layerTwoUrl: routePaths.PRODUCTION_TRACKING_TWO,
  },
  {
    name: 'Production & Inventory',
    icon: faBox,
    row: 2,
    col: 4,
    layerOneUrl: routePaths.PRODUCTION_INVENTORY_ONE,
    layerTwoUrl: routePaths.PRODUCTION_INVENTORY_TWO,
  },
  {
    name: 'Resource Tracking',
    icon: faRightLeft,
    row: 3,
    col: 1,
    layerOneUrl: routePaths.RESOURCE_TRACKING_ONE,
    layerTwoUrl: routePaths.RESOURCE_TRACKING_TWO,
  },
  {
    name: 'Resource Health',
    icon: faBoltLightning,
    row: 3,
    col: 4,
    layerOneUrl: routePaths.RESOURCE_HEALTH_ONE,
    layerTwoUrl: routePaths.RESOURCE_HEALTH_TWO,
  },
];
