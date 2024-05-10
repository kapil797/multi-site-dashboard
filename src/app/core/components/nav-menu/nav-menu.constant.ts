import layoutData from 'layoutConfig.json';
import { featureConstants } from '@core/constants/feature.constant';
import { layoutConstants } from '@core/constants/layout.constants';
import { DashboardInput, DashboardOutput, NavItem, NavigationItem } from '@core/models/multi-site.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformDashboardItems(input: DashboardInput): DashboardOutput {
  const navItems: NavItem[] = [];
  const dimensions = input.dimensions.split('*');
  const columns = parseInt(dimensions[1], 10); // Extracting the columns number

  input.navigationItems.forEach((item: NavigationItem) => {
    const feature = featureConstants[item.featureId];
    const layout = item.layoutId !== null ? layoutConstants[item.layoutId] : undefined;
    if (feature) {
      navItems.push({
        name: feature.name,
        icon: feature.icon,
        row: item.row,
        col: item.col,
        rowSpan: item.rowSpan,
        colSpan: item.colSpan,
        resource: feature.resource,
        layout: layout,
      });
    }
  });

  // Return both the navItems array and the columns number
  return {
    navItems: navItems,
    columns: columns,
  };
}

const dashboardData = layoutData;
const dashboardOutput = transformDashboardItems(dashboardData);

export const mfNavItems: NavItem[] = dashboardOutput.navItems;
export const columns: number = dashboardOutput.columns;
import { Params } from '@angular/router';
import { RoutePaths } from '@core/constants/routes.constant';
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
  queryParams?: Params;
}

export const mfNavItems: NavItem[] = [
  {
    name: 'Logistic Tracking',
    icon: faTruck,
    row: 1,
    col: 1,
    resource: RoutePaths.LOGISTIC_TRACKING,
  },
  {
    name: 'Management KPIs',
    icon: faBriefcase,
    row: 1,
    col: 2,
    resource: RoutePaths.MANAGEMENT_KPIS,
  },
  {
    name: 'Management KPIs',
    icon: faBriefcase,
    row: 1,
    col: 3,
    resource: RoutePaths.MANAGEMENT_KPIS,
  },
  {
    name: 'Demand Profile',
    icon: faStreetView,
    row: 1,
    col: 4,
    resource: RoutePaths.DEMAND_PROFILE,
  },
  {
    name: 'Production Tracking',
    icon: faClipboardList,
    row: 2,
    col: 1,
    resource: RoutePaths.PRODUCTION_TRACKING,
  },
  {
    name: 'Production & Inventory',
    icon: faBox,
    row: 2,
    col: 4,
    resource: RoutePaths.PRODUCTION_INVENTORY,
  },
  {
    name: 'Resource Tracking',
    icon: faRightLeft,
    row: 3,
    col: 1,
    resource: RoutePaths.RESOURCE_TRACKING,
  },
  {
    name: 'Resource Health',
    icon: faBoltLightning,
    row: 3,
    col: 4,
    resource: RoutePaths.RESOURCE_HEALTH,
  },
];

export const umfNavItems: NavItem[] = [
  {
    name: 'Logistic Tracking',
    icon: faTruck,
    row: 1,
    col: 1,
    resource: RoutePaths.LOGISTIC_TRACKING,
  },
  {
    name: 'Management KPIs',
    icon: faBriefcase,
    row: 1,
    col: 2,
    resource: RoutePaths.MANAGEMENT_KPIS,
  },
  {
    name: 'Demand Profile',
    icon: faStreetView,
    row: 1,
    col: 3,
    resource: RoutePaths.DEMAND_PROFILE,
  },
  {
    name: 'Production Tracking',
    icon: faClipboardList,
    row: 2,
    col: 1,
    resource: RoutePaths.PRODUCTION_TRACKING,
  },
  {
    name: 'Resource Tracking',
    icon: faRightLeft,
    row: 3,
    col: 1,
    resource: RoutePaths.RESOURCE_TRACKING,
  },
];
