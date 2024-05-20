import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChildren,
  QueryList,
  ViewContainerRef,
  EnvironmentInjector,
  Type,
} from '@angular/core';
import { Widget, DynamicWidget } from '@core/models/multi-site.model';
import { widgetComponentsMapping } from '@core/constants/widgets-component-mapping';

@Component({
  selector: 'app-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements AfterViewInit {
  @Input() widgets: Widget[] = [];
  @Input() position: string;
  @Input() text: string;
  @ViewChildren('widgetHost', { read: ViewContainerRef }) widgetHosts: QueryList<ViewContainerRef>;
  widget1!: Widget;
  widget2!: Widget;
  widget3!: Widget;
  widget4!: Widget;

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
    console.log('check position', this.getPositionClass());
  }

  getPositionClass(): string {
    return `position-${this.position}`; // this.position is 'top', 'left', 'right', or 'none'
  }

  getPositionText(): string {
    return this.position.toUpperCase();
  }

  assignWidgets() {
    if (this.widgets.length > 1) {
      this.widget1 = this.widgets[0];
      this.widget2 = this.widgets[1];
      this.widget3 = this.widgets[2];
      this.widget4 = this.widgets[3];
    }
  }

  loadWidgets() {
    // Reset and load widgets to handle dynamic updates
    this.widgetHosts.forEach((viewContainerRef, index) => {
      viewContainerRef.clear();
      const widget = this.widgets[index];
      const componentClass = widgetComponentsMapping[widget.name as keyof typeof widgetComponentsMapping];
      if (componentClass) {
        const componentRef = viewContainerRef.createComponent(componentClass as Type<DynamicWidget>, {
          environmentInjector: this.injector,
        });
        componentRef.instance.title = widget.title ?? 'Default Title';
        componentRef.instance.subtitle = widget.subtitle ?? 'Default Subtitle';
      } else {
        console.warn(`No component mapped for widget named ${widget.name}`);
      }
    });
  }
}
