import { Injectable } from '@angular/core';
import { featureConstants } from '@core/constants/feature.constant';
import { layoutConstants } from '@core/constants/layout.constants';
// import { featureConstants } from '@core/constants/feature.constant';
// import { layoutConstants } from '@core/constants/layout.constants';
import { NavigationItem } from '@core/models/multi-site.model';
import layoutData from 'layoutConfig.json';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  public multiSiteConfig: NavigationItem[];
  constructor() {
    const dashboardData = layoutData;
    if (dashboardData) {
      this.multiSiteConfig = dashboardData.navigationItems;
    }
  }
  getLayoutWidgetsByFeature(featureName: string) {
    const featureId = Object.keys(featureConstants).find(
      key => featureConstants[parseInt(key)].resource === featureName
    );
    if (!featureId) {
      return null;
    }
    const navigationItem = this.multiSiteConfig.find(item => item.featureId === parseInt(featureId));
    if (!navigationItem) {
      return null;
    }

    console.log('navigation', navigationItem);
    return navigationItem;
  }
  getComponentName(layoutId: number): string {
    return layoutConstants[layoutId];
  }
}
