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
  @Output() closeOverlay = new EventEmitter();
  private onFirstLoad = true;

  constructor(private elRef: ElementRef) {}

  @HostListener('document:keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    if (event.code === 'Escape') {
      this.closeOverlay.emit();
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
    const tagName = this.elRef.nativeElement.tagName;
    const target = event.target as unknown as HTMLElement;

    if (!target) return;
    if (tagName === 'KENDO-DIALOG') {
      if (target.classList.contains('k-overlay')) this.closeOverlay.emit();
      return;
    }
    if (!this.contains(target)) this.closeOverlay.emit();
  }

  private contains(target: HTMLElement): boolean {
    if (this.elRef.nativeElement.contains(target)) return true;
    return false;
  }
}
