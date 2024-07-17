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
  selector: 'app-layout-six',
  templateUrl: './layout-six.component.html',
  styleUrl: './layout-six.component.scss',
})
export class LayoutSixComponent {
  @Input() widgets: Widget[] = [];
  @Input() position: string;
  @Input() text: string;
  @Input() title: string;
  @Input() apis: Apis;
  @ViewChildren('widgetHost', { read: ViewContainerRef }) widgetHosts: QueryList<ViewContainerRef>;
  widget1!: Widget;

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
    if (this.widgets.length >= 1) {
      this.widgets[0] = this.assignApiToWidget(this.widgets[0], apiKeys[0]);
    }
    this.widget1 = this.widgets[0];
    console.log('Assigned Widgets:', this.widget1);
  }

  assignApiToWidget(widget: Widget, apiKey: string): Widget {
    return { ...widget, api: this.apis[apiKey as keyof Apis] };
  }

  loadWidgets() {
    // Reset and load widgets to handle dynamic updates
    this.widgetHosts.forEach((viewContainerRef, index) => {
      viewContainerRef.clear();
      const widget = this.widgets[index];
      const widgetKey = `${widget.name}Large` as keyof typeof widgetComponentsMapping; // Append 'Medium' to the widget name
      const componentClass = widgetComponentsMapping[widgetKey];

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
        console.warn(`No suitable component mapped for widget named ${widgetKey}`);
      }
    });
  }
}
