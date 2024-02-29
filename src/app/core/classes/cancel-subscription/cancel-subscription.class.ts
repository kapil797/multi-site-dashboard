import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class CancelSubscription implements OnDestroy {
  protected ngUnsubscribe$ = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
type Constructor = new (...args: any[]) => {};
export function CancelSubscriptionMixin<TBase extends Constructor>(Base: TBase) {
  return class CancelSubscription extends Base implements OnDestroy {
    // Mixins may not declare private/protected properties
    // however, you can use ES2020 private fields
    public ngUnsubscribe$ = new Subject<void>();

    ngOnDestroy(): void {
      this.ngUnsubscribe$.next();
      this.ngUnsubscribe$.complete();
    }
  };
}
/* eslint-enable */
