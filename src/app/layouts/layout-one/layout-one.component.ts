import { Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Widget } from '@core/models/multi-site.model';
import { widgetComponentsMapping } from '@lt/widgets/widgets-component-mapping';

@Component({
  selector: 'app-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrl: './layout-one.component.scss',
})
export class LayoutOneComponent {
  @Input() widgets: Widget[] = [];
  @ViewChild('widgetHost', { read: ViewContainerRef }) widgetHost: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.loadWidgets();
    console.log('Widgets', this.widgets);
  }

  loadWidgets() {
    this.widgets.forEach(widget => {
      const componentClass = widgetComponentsMapping[widget.name as keyof typeof widgetComponentsMapping];
      if (componentClass) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
        const componentRef = this.widgetHost.createComponent(componentFactory);
        // Pass properties to the component instance
        componentRef.instance.title = widget.title ?? 'Default Title';
        componentRef.instance.subtitle = widget.subtitle ?? 'Default Subtitle';
      } else {
        console.warn(`No component mapped for widget named ${widget.name}`);
      }
    });
  }
}
