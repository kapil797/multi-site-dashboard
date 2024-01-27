import { Directive, ViewContainerRef, OnDestroy, Input, Type } from '@angular/core';

@Directive({
  selector: '[appComponent]',
  standalone: true,
})
export class ComponentDirective implements OnDestroy {
  constructor(private vcRef: ViewContainerRef) {}
  @Input() data: unknown;
  @Input()
  set appComponent(component: Type<unknown>) {
    if (!component) return;
    this.vcRef.clear();
    const c = this.vcRef.createComponent(component);
    c.setInput('data', this.data);
  }

  ngOnDestroy() {
    this.vcRef.clear();
  }
}
