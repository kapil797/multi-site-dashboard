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
