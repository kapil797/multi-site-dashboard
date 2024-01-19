import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appOverlay]',
  standalone: true,
})
export class OverlayDirective {
  /*
    This directive is to append an overlay to the component that is bound to.
    If clicked on the overlay, it will trigger a close event.
    Can be used for dialog, window, etc.
  */
  @Output() toggleClose = new EventEmitter();
  private onFirstLoad = true;

  constructor(private elRef: ElementRef) {}

  @HostListener('document:keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    if (event.code === 'Escape') {
      this.toggleClose.emit();
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: KeyboardEvent): void {
    // When component is first loaded, to skip check, else
    // it will always toggle close.
    if (this.onFirstLoad) {
      this.onFirstLoad = false;
      return;
    }
    if (event.target && !this.contains(event.target)) {
      this.toggleClose.emit();
    }
  }

  private contains(target: EventTarget): boolean {
    if (this.elRef.nativeElement.contains(target)) return true;
    return false;
  }
}
