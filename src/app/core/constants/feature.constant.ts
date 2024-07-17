import {
  faTruck,
  faBriefcase,
  faStreetView,
  faClipboardList,
  faBox,
  faRightLeft,
  faBoltLightning,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

// Define the interface for feature constants
interface FeatureConstants {
  [key: string]: {
    icon: IconDefinition;
    name: string;
    resource: string;
  };
}

// Declare feature constants with the explicit interface type
export const featureConstants: FeatureConstants = Object.freeze({
  // SSC1: {
  //   icon: faTruck,
  //   name: 'Logistic Tracking',
  //   resource: 'logistic-tracking',
  // },
  MV1: {
    icon: faTruck,
    name: 'Supplier Information',
    resource: 'supplier-information',
  },
  MV2: {
    icon: faStreetView,
    name: 'Fulfillment',
    resource: 'fulfillment',
  },
  MM1: {
    icon: faBriefcase,
    name: 'Management KPI',
    resource: 'management-kpis-one',
  },
  MM2: {
    icon: faBriefcase,
    name: 'Management KPI',
    resource: 'management-kpis-two',
  },
  MM3: {
    icon: faBriefcase,
    name: 'Management KPI',
    resource: 'management-kpis-three',
  },
  MM4: {
    icon: faBriefcase,
    name: 'Management KPI',
    resource: 'management-kpis-four',
  },
  // SSC2: {
  //   icon: faStreetView,
  //   name: 'Demand Profile',
  //   resource: 'demand-profile',
  // },
  ME1: {
    icon: faClipboardList,
    name: 'Production Tracking',
    resource: 'production-tracking',
  },
  MD1: {
    icon: faBox,
    name: 'Favourites',
    resource: 'favourites',
  },
  MD2: {
    icon: faRightLeft,
    name: 'Critical Issues',
    resource: 'critical-issues',
  },
  MS1: {
    icon: faBoltLightning,
    name: 'Resource Tracking',
    resource: 'resource-tracking',
  },
  MS2: {
    icon: faBox,
    name: 'Resource Health',
    resource: 'resource-health',
  },
  ME2: {
    icon: faClipboardList,
    name: 'Production & Inventory',
    resource: 'production-inventory',
  },
});

// Function and additional imports as before
