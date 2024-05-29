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
  SSC1: {
    icon: faTruck,
    name: 'Logistic Tracking',
    resource: 'logistic-tracking',
  },
  SM1: {
    icon: faBriefcase,
    name: 'Management KPI',
    resource: 'management-kpis',
  },
  SSC2: {
    icon: faStreetView,
    name: 'Demand Profile',
    resource: 'demand-profile',
  },
  ME1: {
    icon: faClipboardList,
    name: 'Production Tracking',
    resource: 'production-tracking',
  },
  SD1: {
    icon: faBox,
    name: 'Favourites',
    resource: 'favourite',
  },
  SD2: {
    icon: faRightLeft,
    name: 'Critical Issues',
    resource: 'critical-issue',
  },
  SS1: {
    icon: faBoltLightning,
    name: 'Resource Tracking',
    resource: 'resource-tracking',
  },
  SS2: {
    icon: faBox,
    name: 'Resource Health',
    resource: 'resource-health',
  },
  SM2: {
    icon: faBriefcase,
    name: 'Management KPI',
    resource: 'management-kpis-extended',
  },
});

// Function and additional imports as before
