import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface Widget {
  name?: string;
  title?: string;
  subtitle?: string;
  tag?: string;
}

export interface DynamicWidget {
  title: string;
  subtitle: string;
  tag: string;
}

export interface Sidebar {
  position?: string;
  text?: string;
}

export interface NavigationItem {
  featureId: string;
  row: number;
  rowSpan: number;
  col: number;
  colSpan: number;
  layoutId: number | null;
  widget1?: Widget;
  widget2?: Widget;
  widget3?: Widget;
  widget4?: Widget;
  sideBar?: Sidebar;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface DashboardInput {
  dashboard: string;
  dimensions: string;
  colorTheme: string;
  navigationItems: NavigationItem[];
}

export interface NavItem {
  name: string;
  icon: IconDefinition;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  resource: string;
  layout: string | undefined;
}

export interface DashboardOutput {
  navItems: NavItem[];
  columns: number;
}
