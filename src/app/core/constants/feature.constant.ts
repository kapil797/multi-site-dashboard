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
  [key: number]: {
    icon: IconDefinition;
    name: string;
    resource: string;
  };
}

// Declare feature constants with the explicit interface type
export const featureConstants: FeatureConstants = Object.freeze({
  1: {
    icon: faTruck,
    name: 'Logistic Tracking',
    resource: 'logistic-tracking',
  },
  2: {
    icon: faBriefcase,
    name: 'Management KPI',
    resource: 'management-kpis',
  },
  3: {
    icon: faStreetView,
    name: 'Demand Profile',
    resource: 'demand-profile',
  },
  4: {
    icon: faClipboardList,
    name: 'Production Tracking',
    resource: 'production-tracking',
  },
  5: {
    icon: faBox,
    name: 'Favourites',
    resource: 'favourite',
  },
  6: {
    icon: faRightLeft,
    name: 'Critical Issues',
    resource: 'critical-issue',
  },
  7: {
    icon: faBoltLightning,
    name: 'Resource Tracking',
    resource: 'resource-tracking',
  },
  8: {
    icon: faBox,
    name: 'Resource Health',
    resource: 'resource-health',
  },
});

// Function and additional imports as before
