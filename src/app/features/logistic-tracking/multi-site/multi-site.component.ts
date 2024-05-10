import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Widget } from '@core/models/multi-site.model';
import { FeatureService } from '@core/services/feature.service';
import { LayoutOneComponent } from 'src/app/layouts/layout-one/layout-one.component';

@Component({
  selector: 'app-multi-site',
  templateUrl: './multi-site.component.html',
  styleUrl: './multi-site.component.scss',
})
export class MultiSiteComponent {
  @ViewChild('layoutHost', { read: ViewContainerRef }) layoutHost: ViewContainerRef;

  constructor(
    private featureService: FeatureService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngAfterViewInit() {
    this.loadLayout();
  }

  loadLayout() {
    const layoutConfig = this.featureService.getLayoutWidgetsByFeature('logistic-tracking');
    if (!layoutConfig) return;

    const widgets: Widget[] = Object.keys(layoutConfig)
      .filter(key => key.startsWith('widget'))
      .map(key => layoutConfig[key] as Widget);

    const layoutId = layoutConfig.layoutId;
    let componentFactory;

    switch (layoutId) {
      case 1:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(LayoutOneComponent);
        break;
      // handle other cases
      default:
        return; // or throw an error, or load a default component
    }

    const componentRef = this.layoutHost.createComponent(componentFactory);
    componentRef.instance.widgets = widgets;
  }
}
