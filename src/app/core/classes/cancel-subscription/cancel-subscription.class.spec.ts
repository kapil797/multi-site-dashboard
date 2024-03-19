import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { Observable, delay, of, takeUntil } from 'rxjs';

@Component({
  selector: 'app-base',
  template: '',
  styles: '',
})
class BaseComponent extends CancelSubscription implements OnInit {
  public obs$: Observable<string> = of('');

  ngOnInit(): void {
    this.obs$.subscribe(res => {
      console.log(res);
    });
  }
}

@Component({
  selector: 'app-cancel',
  template: '',
  styles: '',
})
class CancelSubscriptionComponent extends BaseComponent {
  constructor() {
    super();
    this.obs$ = of('hello world').pipe(delay(1000), takeUntil(this.ngUnsubscribe$));
  }
}

@Component({
  selector: 'app-leak',
  template: '',
  styles: '',
})
class MemoryLeakComponent extends BaseComponent {
  constructor() {
    super();
    this.obs$ = of('memory leak!').pipe(delay(1000));
  }
}

@Component({
  selector: 'app-cancel-leak',
  template: '',
  styles: '',
})
class MemoryLeakWithCancelComponent extends BaseComponent {
  constructor() {
    super();
    this.obs$ = of('memory leak!').pipe(takeUntil(this.ngUnsubscribe$), delay(1000));
  }
}

describe('CancelSubscriptionComponent', () => {
  let fixture: ComponentFixture<CancelSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelSubscriptionComponent, MemoryLeakComponent, MemoryLeakWithCancelComponent],
    }).compileComponents();

    spyOn(window.console, 'log');
  });

  it('should subscribe to the observable', fakeAsync(() => {
    fixture = TestBed.createComponent(CancelSubscriptionComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    tick(1200);
    expect(window.console.log).toHaveBeenCalledWith('hello world');
  }));

  it('should cancel subscription to the observable on destroy', fakeAsync(() => {
    fixture = TestBed.createComponent(CancelSubscriptionComponent);
    fixture.detectChanges();

    tick(750);
    fixture.destroy();
    tick(1000);
    expect(window.console.log).not.toHaveBeenCalledWith('hello world');
  }));

  it('should cause memory leak without canceling the subscription', fakeAsync(() => {
    fixture = TestBed.createComponent(MemoryLeakComponent);
    fixture.detectChanges();

    tick(750);
    fixture.destroy();
    tick(1000);
    expect(window.console.log).toHaveBeenCalledWith('memory leak!');
  }));

  it('should cause memory leak with wrong order of canceling the subscription', fakeAsync(() => {
    fixture = TestBed.createComponent(MemoryLeakWithCancelComponent);
    fixture.detectChanges();

    tick(750);
    fixture.destroy();
    tick(1000);
    expect(window.console.log).toHaveBeenCalledWith('memory leak!');
  }));
});
