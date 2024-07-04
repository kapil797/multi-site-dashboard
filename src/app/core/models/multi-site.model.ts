import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface Widget {
  id?: string;
  name: string;
  title?: string;
  subtitle?: string;
  tag?: string;
  featureId?: string;
  api?: string;
}

export interface DynamicWidget {
  title: string;
  subtitle: string;
  tag: string;
  api: string;
}

export interface Sidebar {
  position?: string;
  text?: string;
}

export interface NavigationItem {
  id?: string; // Made optional
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
  scale: string;
  dimensions: number[]; // Array of numbers
  Styles: {
    colorTheme: string;
    font: string;
  };
  features: NavigationItem[];
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
  site: string;
}
export interface Apis {
  API_1: string;
  API_2: string;
  API_3: string;
  API_4: string;
}
