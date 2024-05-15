import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Widget } from '@core/models/multi-site.model';
import { FeatureService } from '@core/services/feature.service';
import { LayoutOneComponent } from 'src/app/layouts/layout-one/layout-one.component';

@Component({
  selector: 'app-multi-site',
  templateUrl: './multi-site.component.html',
  styleUrls: ['./multi-site.component.scss'], // Notice the correction from styleUrl to styleUrls
})
export class MultiSiteComponent implements AfterViewInit {
  @ViewChild('layoutHost', { read: ViewContainerRef }) layoutHost: ViewContainerRef;

  constructor(
    private featureService: FeatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.loadLayout();
    this.cdr.detectChanges();
  }

  loadLayout() {
    const layoutConfig = this.featureService.getLayoutWidgetsByFeature('logistic-tracking');
    if (!layoutConfig) return;

    const widgets: Widget[] = Object.keys(layoutConfig)
      .filter(key => key.startsWith('widget'))
      .map(key => layoutConfig[key] as Widget);

    const layoutId = layoutConfig.layoutId;
    const sideBarPosition = layoutConfig.sideBar?.position;
    const sideBarText = layoutConfig.sideBar?.text;
    console.log('layouthost', this.layoutHost);
    switch (layoutId) {
      case 1:
        // eslint-disable-next-line no-case-declarations
        const componentRef = this.layoutHost.createComponent(LayoutOneComponent);
        console.log('compnentRef', componentRef);
        componentRef.instance.widgets = widgets;
        componentRef.instance.position = sideBarPosition ? sideBarPosition : 'none';
        componentRef.instance.text = sideBarText ? sideBarText : 'SUPPLY CHAIN';
        break;
      // handle other cases
      default:
        return; // or throw an error, or load a default component
    }
  }
}
