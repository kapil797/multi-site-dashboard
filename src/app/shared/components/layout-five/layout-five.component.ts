import {
  ChangeDetectorRef,
  Component,
  EnvironmentInjector,
  Input,
  QueryList,
  Type,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { Widget, DynamicWidget, Apis } from '@core/models/multi-site.model';
import { widgetComponentsMapping } from '@core/constants/widgets-component-mapping';

@Component({
  selector: 'app-layout-five',
  templateUrl: './layout-five.component.html',
  styleUrl: './layout-five.component.scss',
})
export class LayoutFiveComponent {
  @Input() widgets: Widget[] = [];
  @Input() position: string;
  @Input() text: string;
  @Input() title: string;
  @Input() apis: Apis;
  @ViewChildren('widgetHost', { read: ViewContainerRef }) widgetHosts: QueryList<ViewContainerRef>;
  widget1!: Widget;
  widget2!: Widget;
  widget3!: Widget;

  constructor(
    private cdr: ChangeDetectorRef,
    private injector: EnvironmentInjector
  ) {}

  ngAfterViewInit() {
    if (this.widgetHosts) {
      this.widgetHosts.changes.subscribe(() => {
        this.loadWidgets();
        this.cdr.detectChanges();
      });
    }
    this.assignWidgets();
    console.log('APIs:', this.apis);
    console.log('Widgets after assignment:', this.widgets);
  }

  getPositionClass(): string {
    return `position-${this.position}`; // this.position is 'top', 'left', 'right', or 'none'
  }

  getPositionText(): string {
    return this.position.toUpperCase();
  }

  assignWidgets() {
    const apiKeys = Object.keys(this.apis);
    if (this.widgets.length >= 2) {
      this.widgets[0] = this.assignApiToWidget(this.widgets[0], apiKeys[0]);
      this.widgets[1] = this.assignApiToWidget(this.widgets[1], apiKeys[1]);
    }
    this.widget1 = this.widgets[0];
    this.widget2 = this.widgets[1];
    this.widget3 = this.widgets[2];
    console.log('Assigned Widgets:', this.widget1, this.widget2);
  }

  assignApiToWidget(widget: Widget, apiKey: string): Widget {
    return { ...widget, api: this.apis[apiKey as keyof Apis] };
  }

  loadWidgets() {
    // Reset and load widgets to handle dynamic updates
    this.widgetHosts.forEach((viewContainerRef, index) => {
      viewContainerRef.clear();
      const widget = this.widgets[index];
      console.log(`Widget ${index + 1}:`, widget);
      const componentClass = widgetComponentsMapping[widget.name as keyof typeof widgetComponentsMapping];
      if (componentClass) {
        const componentRef = viewContainerRef.createComponent(componentClass as Type<DynamicWidget>, {
          environmentInjector: this.injector,
        });
        componentRef.instance.title = widget.title ?? 'Default Title';
        componentRef.instance.subtitle = widget.subtitle ?? 'Default Subtitle';
        componentRef.instance.tag = widget.tag ?? 'Combined';
        componentRef.instance.api = widget.api ?? '';
        console.log(`Widget ${index + 1} API:`, componentRef.instance.api);
      } else {
        console.warn(`No component mapped for widget named ${widget.name}`);
      }
    });
  }
}
